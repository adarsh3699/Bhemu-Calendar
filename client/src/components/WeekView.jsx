import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	format,
	addWeeks,
	subWeeks,
	getHours,
	addHours,
	setHours,
	setMinutes,
	getMinutes,
	differenceInMinutes,
} from 'date-fns';
import { openModal } from '../redux/reducers/uiSlice';
import { updateEvent, updateEventOptimistically } from '../redux/reducers/eventsSlice';
import TimeSlot from './TimeSlot';
import '../styles/WeekView.css';

const WeekView = forwardRef((props, ref) => {
	const dispatch = useDispatch();
	const { events } = useSelector((state) => state.events);
	const [currentWeek, setCurrentWeek] = useState(new Date());
	const [weekDays, setWeekDays] = useState([]);
	const [timeSlots] = useState(Array.from({ length: 24 }, (_, i) => i)); // 24 hours

	// Set up the current week's days
	useEffect(() => {
		const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 }); // 0 = Sunday
		const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 0 });
		const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
		setWeekDays(days);
	}, [currentWeek]);

	// Handle navigation
	const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
	const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
	const goToToday = () => setCurrentWeek(new Date());

	// Handle click on a time slot
	const handleTimeSlotClick = (date, hour) => {
		const startTime = setMinutes(setHours(date, hour), 0);
		const endTime = addHours(startTime, 1);

		dispatch(
			openModal({
				date: date.toISOString(),
				timeSlot: {
					start: startTime.toISOString(),
					end: endTime.toISOString(),
				},
			})
		);
	};

	// Handle drag end for events inside the calendar
	const handleDragEnd = (result) => {
		// The parent App component already has the DragDropContext
		// so we don't need to wrap our component in another one

		if (!result.destination || result.type !== 'DEFAULT') return;

		const { draggableId, source, destination } = result;
		// Skip if not an event
		if (!draggableId.startsWith('event-')) return;

		const eventId = draggableId.replace('event-', '');
		const event = events.find((e) => e._id === eventId);

		if (!event) return;

		// Parse source and destination IDs to get day index and hour
		const [sourceDayIndex, _sourceHour] = source.droppableId.split('-').map(Number);
		const [destDayIndex, destHour] = destination.droppableId.split('-').map(Number);

		// Get the corresponding day objects
		const sourceDay = weekDays[sourceDayIndex];
		const destDay = weekDays[destDayIndex];

		if (!sourceDay || !destDay) return;

		// Calculate the time difference in minutes
		const sourceDatetime = new Date(event.startTime);
		const eventDuration = differenceInMinutes(new Date(event.endTime), sourceDatetime);
		const minutesInCurrentHour = getMinutes(sourceDatetime);

		// Create new start and end times
		const newStartTime = setMinutes(setHours(new Date(destDay), destHour), minutesInCurrentHour);
		const newEndTime = new Date(newStartTime);
		newEndTime.setMinutes(newStartTime.getMinutes() + eventDuration); // Add duration in minutes

		// Create updated event object
		const updatedEvent = {
			...event,
			date: destDay.toISOString(),
			startTime: newStartTime.toISOString(),
			endTime: newEndTime.toISOString(),
		};

		// Apply optimistic update first
		dispatch(updateEventOptimistically({ id: eventId, event: updatedEvent }));

		// Then dispatch the actual API update
		dispatch(updateEvent({ id: eventId, event: updatedEvent }));
	};

	// Expose the handleDragEnd method to parent components
	useImperativeHandle(ref, () => ({
		handleDragEnd,
	}));

	return (
		<div className="week-view">
			<div className="week-header">
				<button className="nav-button" onClick={goToPreviousWeek}>
					Previous Week
				</button>
				<button className="nav-button" onClick={goToToday}>
					Today
				</button>
				<button className="nav-button" onClick={goToNextWeek}>
					Next Week
				</button>
				<h2>
					{format(weekDays[0] || new Date(), 'MMM d')} - {format(weekDays[6] || new Date(), 'MMM d, yyyy')}
				</h2>
			</div>

			<div className="week-grid">
				{/* Time labels */}
				<div className="time-labels">
					<div className="day-header"></div>
					{timeSlots.map((hour) => (
						<div key={`time-${hour}`} className="hour-label">
							{format(setHours(new Date(), hour), 'ha')}
						</div>
					))}
				</div>

				{/* Days with time slots */}
				<div className="days-container">
					{weekDays.map((day, dayIndex) => (
						<div
							key={format(day, 'yyyy-MM-dd')}
							className="day-column"
							data-date={format(day, 'yyyy-MM-dd')}
						>
							<div className="day-header">
								<div className="day-name">{format(day, 'EEE')}</div>
								<div className="day-date">{format(day, 'd')}</div>
							</div>

							{timeSlots.map((hour) => (
								<TimeSlot
									key={`${dayIndex}-${hour}`}
									day={day}
									dayIndex={dayIndex}
									hour={hour}
									events={events.filter((event) => {
										const eventDate = new Date(event.date);
										const eventStartHour = getHours(new Date(event.startTime));
										return (
											eventDate.getDate() === day.getDate() &&
											eventDate.getMonth() === day.getMonth() &&
											eventDate.getFullYear() === day.getFullYear() &&
											eventStartHour === hour
										);
									})}
									onClick={() => handleTimeSlotClick(day, hour)}
								/>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
});

export default WeekView;

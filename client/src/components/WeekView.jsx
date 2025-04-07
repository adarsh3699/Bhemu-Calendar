import { useState, useEffect } from 'react';
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
} from 'date-fns';
import { openModal } from '../redux/reducers/uiSlice';
import TimeSlot from './TimeSlot';
import '../styles/WeekView.css';

const WeekView = () => {
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
				{/* Days with time slots */}
				<div className="time-labels">
					<div className="day-header"></div>
					{timeSlots.map((hour) => (
						<div key={`time-${hour}`} className="hour-label">
							{format(setHours(new Date(), hour), 'ha')}
						</div>
					))}
				</div>

				{weekDays.map((day, dayIndex) => (
					<div key={format(day, 'yyyy-MM-dd')} className="day-column">
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
	);
};

export default WeekView;

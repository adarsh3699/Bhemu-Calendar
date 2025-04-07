import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { openModal } from '../redux/reducers/uiSlice';
import '../styles/TimeSlot.css';

// Map category to colors
const categoryColors = {
	exercise: '#ff7eb9',
	eating: '#7afcff',
	work: '#feff9c',
	relax: '#fff740',
	family: '#dcb0ff',
	social: '#b4f8c8',
};

const TimeSlot = ({ dayIndex, hour, events = [], onClick }) => {
	const dispatch = useDispatch();
	// Use dayIndex and hour to create a unique data attribute
	const slotId = `slot-${dayIndex}-${hour}`;

	const handleEventClick = (e, event) => {
		e.stopPropagation();
		dispatch(openModal({ event }));
	};

	return (
		<div className="time-slot" onClick={onClick} data-slot-id={slotId}>
			{events.map((event) => (
				<div
					key={event._id}
					className="event-card"
					style={{
						backgroundColor: categoryColors[event.category] || '#eeeeee',
					}}
					onClick={(e) => handleEventClick(e, event)}
				>
					<div className="event-time">
						{format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
					</div>
					<div className="event-title">{event.title}</div>
					{/* <div className="event-category">{event.category}</div> */}
				</div>
			))}
		</div>
	);
};

export default TimeSlot;

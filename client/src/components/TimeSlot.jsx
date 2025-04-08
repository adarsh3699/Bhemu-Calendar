import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { Droppable, Draggable } from '@hello-pangea/dnd';
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
	const slotId = `${dayIndex}-${hour}`;

	const handleEventClick = (e, event) => {
		e.stopPropagation();
		dispatch(openModal({ event }));
	};

	return (
		<Droppable droppableId={slotId}>
			{(provided) => (
				<div className="time-slot" onClick={onClick} ref={provided.innerRef} {...provided.droppableProps}>
					{events.map((event, index) => (
						<Draggable key={event._id} draggableId={event._id} index={index}>
							{(provided) => (
								<div
									ref={provided.innerRef}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
									className="event-card"
									style={{
										...provided.draggableProps.style,
										backgroundColor: categoryColors[event.category] || '#eeeeee',
									}}
									onClick={(e) => handleEventClick(e, event)}
								>
									<div className="event-time">
										{format(new Date(event.startTime), 'h:mm a')} -{' '}
										{format(new Date(event.endTime), 'h:mm a')}
									</div>
									<div className="event-title">{event.title}</div>
									{/* <div className="event-category">{event.category}</div> */}
								</div>
							)}
						</Draggable>
					))}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);
};

export default TimeSlot;

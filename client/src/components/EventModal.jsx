import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { closeModal } from '../redux/reducers/uiSlice';
import { createEvent, updateEvent, deleteEvent } from '../redux/reducers/eventsSlice';
import { updateTask } from '../redux/reducers/tasksSlice';
import '../styles/EventModal.css';

const EventModal = () => {
	const dispatch = useDispatch();
	const { selectedEvent, selectedDate, selectedTimeSlot, taskData } = useSelector((state) => state.ui);

	const [formData, setFormData] = useState({
		title: '',
		category: 'work',
		date: '',
		startTime: '',
		endTime: '',
		taskId: null,
	});

	// Initialize form data when modal opens
	useEffect(() => {
		if (selectedEvent) {
			// Edit mode
			setFormData({
				title: selectedEvent.title,
				category: selectedEvent.category,
				date: format(new Date(selectedEvent.date), 'yyyy-MM-dd'),
				startTime: format(new Date(selectedEvent.startTime), 'HH:mm'),
				endTime: format(new Date(selectedEvent.endTime), 'HH:mm'),
			});
		} else if (taskData) {
			// Create from task
			const startDate = selectedTimeSlot ? new Date(selectedTimeSlot.start) : new Date();
			const endDate = selectedTimeSlot
				? new Date(selectedTimeSlot.end)
				: new Date(startDate.getTime() + 60 * 60 * 1000);

			setFormData({
				title: taskData.title,
				category: taskData.category,
				date: format(new Date(selectedDate), 'yyyy-MM-dd'),
				startTime: format(startDate, 'HH:mm'),
				endTime: format(endDate, 'HH:mm'),
				taskId: taskData.taskId,
			});
		} else if (selectedDate && selectedTimeSlot) {
			// Create mode with pre-selected time slot
			setFormData({
				title: '',
				category: 'work',
				date: format(new Date(selectedDate), 'yyyy-MM-dd'),
				startTime: format(new Date(selectedTimeSlot.start), 'HH:mm'),
				endTime: format(new Date(selectedTimeSlot.end), 'HH:mm'),
			});
		} else {
			// Default create mode
			const now = new Date();
			setFormData({
				title: '',
				category: 'work',
				date: format(now, 'yyyy-MM-dd'),
				startTime: format(now, 'HH:mm'),
				endTime: format(new Date(now.getTime() + 60 * 60 * 1000), 'HH:mm'),
			});
		}
	}, [selectedEvent, selectedDate, selectedTimeSlot, taskData]);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		const eventData = {
			title: formData.title,
			category: formData.category,
			date: new Date(formData.date).toISOString(),
			startTime: new Date(`${formData.date}T${formData.startTime}`).toISOString(),
			endTime: new Date(`${formData.date}T${formData.endTime}`).toISOString(),
		};

		if (selectedEvent) {
			// Update existing event
			dispatch(updateEvent({ id: selectedEvent._id, event: eventData }));
		} else {
			// Create new event
			dispatch(createEvent(eventData));

			// If created from a task, mark the task as completed
			if (formData.taskId) {
				dispatch(
					updateTask({
						id: formData.taskId,
						task: { completed: true },
					})
				);
			}
		}

		dispatch(closeModal());
	};

	const handleDelete = () => {
		if (selectedEvent) {
			dispatch(deleteEvent(selectedEvent._id));
			dispatch(closeModal());
		}
	};

	const handleClose = () => {
		dispatch(closeModal());
	};

	return (
		<div className="modal-overlay">
			<div className="modal-content">
				<div className="modal-header">
					<h2>{selectedEvent ? 'Edit Event' : taskData ? 'Create Event from Task' : 'Create Event'}</h2>
					<button className="close-button" onClick={handleClose}>
						×
					</button>
				</div>

				<form onSubmit={handleSubmit} className="event-form">
					<div className="form-group">
						<label htmlFor="title">Title</label>
						<input
							type="text"
							id="title"
							name="title"
							value={formData.title}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="category">Category</label>
						<select
							id="category"
							name="category"
							value={formData.category}
							onChange={handleChange}
							required
						>
							<option value="exercise">Exercise</option>
							<option value="eating">Eating</option>
							<option value="work">Work</option>
							<option value="relax">Relax</option>
							<option value="family">Family</option>
							<option value="social">Social</option>
						</select>
					</div>

					<div className="form-group">
						<label htmlFor="date">Date</label>
						<input
							type="date"
							id="date"
							name="date"
							value={formData.date}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="startTime">Start Time</label>
						<input
							type="time"
							id="startTime"
							name="startTime"
							value={formData.startTime}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="endTime">End Time</label>
						<input
							type="time"
							id="endTime"
							name="endTime"
							value={formData.endTime}
							onChange={handleChange}
							required
						/>
					</div>

					<div className="button-group">
						{selectedEvent && (
							<button type="button" className="delete-button" onClick={handleDelete}>
								Delete
							</button>
						)}
						<button type="submit" className="save-button">
							{selectedEvent ? 'Update' : taskData ? 'Create from Task' : 'Create'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EventModal;

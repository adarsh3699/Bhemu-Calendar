import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext } from '@hello-pangea/dnd';
import { fetchEvents } from './redux/reducers/eventsSlice';
import { fetchGoals } from './redux/reducers/goalsSlice';
import WeekView from './components/WeekView';
import EventModal from './components/EventModal';
import GoalsSidebar from './components/GoalsSidebar';
import { openModal } from './redux/reducers/uiSlice';
import './styles/App.css';

function App() {
	const dispatch = useDispatch();
	const { modalOpen } = useSelector((state) => state.ui);
	const { selectedGoal } = useSelector((state) => state.goals);
	const { tasksByGoal } = useSelector((state) => state.tasks);
	let weekViewRef = null;

	useEffect(() => {
		dispatch(fetchEvents());
		dispatch(fetchGoals());
	}, [dispatch]);

	// Handle drag and drop
	const handleDragEnd = (result) => {
		const { destination, source, draggableId } = result;

		// If there's no destination or it's the same as source, do nothing
		if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
			return;
		}

		// Handle task to calendar drop (from sidebar to time slot)
		if (draggableId.startsWith('task-') && destination.droppableId.includes('-')) {
			const taskId = draggableId.replace('task-', '');
			const [dayIndex, hour] = destination.droppableId.split('-').map(Number);

			if (!selectedGoal || !tasksByGoal[selectedGoal._id]) return;

			const task = tasksByGoal[selectedGoal._id].find((t) => t._id === taskId);
			if (!task) return;

			// Get the day from day-index to calculate proper date
			const weekDays = document.querySelectorAll('.day-column');
			if (!weekDays || !weekDays[dayIndex]) return;

			const dateStr = weekDays[dayIndex].getAttribute('data-date');
			if (!dateStr) return;

			const date = new Date(dateStr);
			const startTime = new Date(date);
			startTime.setHours(hour, 0, 0, 0);

			const endTime = new Date(startTime);
			endTime.setHours(hour + 1, 0, 0, 0);

			// Open the event modal with pre-filled task information
			dispatch(
				openModal({
					date: date.toISOString(),
					timeSlot: {
						start: startTime.toISOString(),
						end: endTime.toISOString(),
					},
					taskData: {
						taskId: task._id,
						title: task.title,
						category: selectedGoal.category,
					},
				})
			);
		}
		// For event drags (calendar internal drags), delegate to the WeekView component
		else if (draggableId.startsWith('event-') && destination.droppableId.includes('-')) {
			// If weekViewRef's handleDragEnd exists, call it
			if (weekViewRef && typeof weekViewRef.handleDragEnd === 'function') {
				weekViewRef.handleDragEnd(result);
			}
		}
	};

	return (
		<div className="app">
			<header className="app-header">
				<h1>Bhemu Calendar</h1>
			</header>
			<main className="app-content">
				<DragDropContext onDragEnd={handleDragEnd}>
					<GoalsSidebar />
					<WeekView ref={(ref) => (weekViewRef = ref)} />
				</DragDropContext>
				{modalOpen && <EventModal />}
			</main>
		</div>
	);
}

export default App;

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { fetchGoals, setSelectedGoal, createGoal, deleteGoal } from '../redux/reducers/goalsSlice';
import { fetchTasksByGoal, createTask, deleteTask } from '../redux/reducers/tasksSlice';
import '../styles/GoalsSidebar.css';

// Map category to colors
const categoryColors = {
	exercise: '#ff7eb9',
	eating: '#7afcff',
	work: '#feff9c',
	relax: '#fff740',
	family: '#dcb0ff',
	social: '#b4f8c8',
};

const GoalsSidebar = () => {
	const dispatch = useDispatch();
	const { goals, selectedGoal, loading: goalsLoading } = useSelector((state) => state.goals);
	const { tasksByGoal, loading: tasksLoading } = useSelector((state) => state.tasks);
	const [showGoalForm, setShowGoalForm] = useState(false);
	const [showTaskForm, setShowTaskForm] = useState(false);
	const [newGoal, setNewGoal] = useState({
		title: '',
		description: '',
		category: 'work',
	});
	const [newTask, setNewTask] = useState({
		title: '',
		description: '',
		priority: 'medium',
	});

	// Fetch goals on component mount
	useEffect(() => {
		dispatch(fetchGoals());
	}, [dispatch]);

	// Fetch tasks when a goal is selected
	useEffect(() => {
		if (selectedGoal) {
			dispatch(fetchTasksByGoal(selectedGoal._id));
		}
	}, [dispatch, selectedGoal]);

	const handleGoalClick = (goal) => {
		dispatch(setSelectedGoal(goal));
	};

	const handleGoalInputChange = (e) => {
		setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
	};

	const handleTaskInputChange = (e) => {
		setNewTask({ ...newTask, [e.target.name]: e.target.value });
	};

	const handleGoalSubmit = (e) => {
		e.preventDefault();
		if (newGoal.title.trim()) {
			dispatch(createGoal(newGoal));
			setNewGoal({
				title: '',
				description: '',
				category: 'work',
			});
			setShowGoalForm(false);
		}
	};

	const handleTaskSubmit = (e) => {
		e.preventDefault();
		if (newTask.title.trim() && selectedGoal) {
			dispatch(
				createTask({
					...newTask,
					goalId: selectedGoal._id,
				})
			);
			setNewTask({
				title: '',
				description: '',
				priority: 'medium',
			});
			setShowTaskForm(false);
		}
	};

	const handleDeleteGoal = (e, goalId) => {
		e.stopPropagation(); // Prevent goal selection when deleting
		if (window.confirm('Are you sure you want to delete this goal and all its tasks?')) {
			dispatch(deleteGoal(goalId));
		}
	};

	const handleDeleteTask = (e, taskId) => {
		e.stopPropagation(); // Prevent task drag when deleting
		if (window.confirm('Are you sure you want to delete this task?')) {
			dispatch(deleteTask(taskId));
		}
	};

	return (
		<div className="goals-sidebar">
			{/* Goals Section */}
			<div className="sidebar-section">
				<div className="section-header">
					<h3>My Goals</h3>
					<button className="add-button" onClick={() => setShowGoalForm(!showGoalForm)}>
						{showGoalForm ? 'Cancel' : '+ Add Goal'}
					</button>
				</div>

				{/* Add goal form */}
				{showGoalForm && (
					<form className="form-container" onSubmit={handleGoalSubmit}>
						<div className="form-group">
							<input
								type="text"
								name="title"
								value={newGoal.title}
								onChange={handleGoalInputChange}
								placeholder="Goal title"
								required
							/>
						</div>
						<div className="form-group">
							<textarea
								name="description"
								value={newGoal.description}
								onChange={handleGoalInputChange}
								placeholder="Description (optional)"
								rows="2"
							/>
						</div>
						<div className="form-group">
							<select name="category" value={newGoal.category} onChange={handleGoalInputChange} required>
								<option value="exercise">Exercise</option>
								<option value="eating">Eating</option>
								<option value="work">Work</option>
								<option value="relax">Relax</option>
								<option value="family">Family</option>
								<option value="social">Social</option>
							</select>
						</div>
						<button type="submit" className="save-button">
							Save Goal
						</button>
					</form>
				)}

				{/* Goals list */}
				{goalsLoading ? (
					<p className="empty-message">Loading goals...</p>
				) : goals.length === 0 && !showGoalForm ? (
					<p className="empty-message">No goals found. Create your first goal!</p>
				) : (
					<ul className="goal-items">
						{goals.map((goal) => (
							<li
								key={goal._id}
								className={`goal-item ${
									selectedGoal && selectedGoal._id === goal._id ? 'selected' : ''
								}`}
								onClick={() => handleGoalClick(goal)}
								style={{
									borderLeftColor: categoryColors[goal.category] || '#cccccc',
									backgroundColor:
										selectedGoal && selectedGoal._id === goal._id
											? `${categoryColors[goal.category]}22` // Add transparency
											: 'white',
								}}
							>
								<div className="goal-content">
									<div className="goal-title">{goal.title}</div>
									<div className="goal-category">{goal.category}</div>
								</div>
								<button
									className="delete-button"
									onClick={(e) => handleDeleteGoal(e, goal._id)}
									title="Delete Goal"
								>
									×
								</button>
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Tasks Section */}
			<div className="sidebar-section">
				<div className="section-header">
					<h3>{selectedGoal ? `Tasks for "${selectedGoal.title}"` : 'Tasks'}</h3>
					{selectedGoal && (
						<button className="add-button" onClick={() => setShowTaskForm(!showTaskForm)}>
							{showTaskForm ? 'Cancel' : '+ Add Task'}
						</button>
					)}
				</div>

				{/* Add task form */}
				{showTaskForm && selectedGoal && (
					<form className="form-container" onSubmit={handleTaskSubmit}>
						<div className="form-group">
							<input
								type="text"
								name="title"
								value={newTask.title}
								onChange={handleTaskInputChange}
								placeholder="Task title"
								required
							/>
						</div>
						<div className="form-group">
							<textarea
								name="description"
								value={newTask.description}
								onChange={handleTaskInputChange}
								placeholder="Description (optional)"
								rows="2"
							/>
						</div>
						<div className="form-group">
							<select name="priority" value={newTask.priority} onChange={handleTaskInputChange}>
								<option value="low">Low Priority</option>
								<option value="medium">Medium Priority</option>
								<option value="high">High Priority</option>
							</select>
						</div>
						<button type="submit" className="save-button">
							Save Task
						</button>
					</form>
				)}

				{/* Tasks list with drag and drop */}
				<Droppable droppableId="sidebar-tasks" isDropDisabled={true}>
					{(provided) => (
						<div className="task-container" ref={provided.innerRef} {...provided.droppableProps}>
							{!selectedGoal ? (
								<p className="empty-message">Select a goal to view tasks</p>
							) : tasksLoading ? (
								<p className="empty-message">Loading tasks...</p>
							) : !tasksByGoal[selectedGoal._id] ||
							  (tasksByGoal[selectedGoal._id].length === 0 && !showTaskForm) ? (
								<p className="empty-message">No tasks found for this goal. Add your first task!</p>
							) : (
								<ul className="task-items">
									{tasksByGoal[selectedGoal._id]?.map((task, index) => (
										<Draggable key={task._id} draggableId={`task-${task._id}`} index={index}>
											{(provided, snapshot) => (
												<li
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className={`task-item ${snapshot.isDragging ? 'dragging' : ''} ${
														task.completed ? 'completed' : ''
													}`}
													style={{
														...provided.draggableProps.style,
														backgroundColor:
															categoryColors[selectedGoal.category] || '#cccccc',
													}}
												>
													<div className="task-content">
														<div className="task-title">{task.title}</div>
														<div className="task-details">
															<span className="task-priority">{task.priority}</span>
															<span className="task-status">
																{task.completed ? 'Completed' : 'Pending'}
															</span>
														</div>
													</div>
													<button
														className="delete-button"
														onClick={(e) => handleDeleteTask(e, task._id)}
														title="Delete Task"
													>
														×
													</button>
												</li>
											)}
										</Draggable>
									))}
									{provided.placeholder}
								</ul>
							)}
						</div>
					)}
				</Droppable>
			</div>
		</div>
	);
};

export default GoalsSidebar;

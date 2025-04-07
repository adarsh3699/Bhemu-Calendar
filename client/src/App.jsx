import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from './redux/reducers/eventsSlice';
import WeekView from './components/WeekView';
import EventModal from './components/EventModal';
import './styles/App.css';

function App() {
	const dispatch = useDispatch();
	const { modalOpen } = useSelector((state) => state.ui);

	useEffect(() => {
		dispatch(fetchEvents());
	}, [dispatch]);

	return (
		<div className="app">
			<header className="app-header">
				<h1>Bhemu Calendar</h1>
			</header>
			<main className="app-content">
				<WeekView />
				{modalOpen && <EventModal />}
			</main>
		</div>
	);
}

export default App;

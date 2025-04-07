# Bhemu Calendar App

A calendar web application similar to Google Calendar, built with React, Redux, Node.js, and MongoDB.

## Features

- Week view calendar layout
- Create, read, update, and delete events
- Drag-and-drop functionality to reschedule events
- Event categorization (exercise, eating, work, relax, family, social)

## Tech Stack

### Frontend

- React (Vite + SWC)
- Redux Toolkit for state management
- react-beautiful-dnd for drag and drop functionality
- date-fns for date manipulation
- Axios for API requests

### Backend

- Node.js with Express
- MongoDB for data storage
- REST API for CRUD operations

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local installation or MongoDB Atlas account)

### Installation and Setup

1. Clone the repository

```
git clone <repository-url>
cd bhemu_calender
```

2. Setup and start the backend server

```
cd server
npm install
# Make sure MongoDB is running locally at mongodb://localhost:27017
# Or update the MONGO_URI in .env to your MongoDB connection string
npm run dev
```

3. Setup and start the frontend

```
cd client
npm install
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` to use the application.

## API Endpoints

- `GET /events` - Get all events
- `POST /events` - Create a new event
- `PUT /events/:id` - Update an existing event
- `DELETE /events/:id` - Delete an event

## License

MIT

# AI Interior Design Platform

An AI-powered Interior Design Platform built with React, Vite, Context API, Express.js, and MongoDB. The application enables users to discover interior design inspirations, create personalized collections, save favorite designs, and generate AI-inspired room recommendations through a modern, responsive interface.

## Features

- Secure user authentication with JWT
- Browse interior design inspirations
- Search designs by keyword
- Filter by room type, style, color palette, and budget
- Save favorite designs
- Create and manage inspiration boards
- AI-powered room design recommendations
- Responsive masonry gallery
- Global state management using Context API or Zustand
- Reusable API service layer
- Skeleton loaders for all data-fetching pages
- Meaningful empty states with call-to-action buttons
- Dark and Light mode
- Responsive design for desktop, tablet, and mobile
- Smooth animations using Framer Motion
- Protected routes
- Form validation and error handling

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Context API / Zustand
- Axios
- Framer Motion

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

## Project Structure

```
ai-interior-design-platform/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── layouts/
│   │   ├── assets/
│   │   └── utils/
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   └── server.js
│
├── README.md
└── package.json
```

## Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-interior-design-platform.git
```

### Navigate to the project

```bash
cd ai-interior-design-platform
```

### Install dependencies

Frontend

```bash
cd client
npm install
```

Backend

```bash
cd ../server
npm install
```

## Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

## Run the Project

Backend

```bash
npm run dev
```

Frontend

```bash
npm run dev
```

## Application Highlights

- Centralized global state management
- Reduced prop drilling across components
- Reusable API services
- Responsive user interface
- Optimized data fetching
- Skeleton loading screens
- User-friendly empty states
- Smooth page transitions
- Clean and scalable architecture

## Assignment Requirements Covered

- Global state management using Context API or Zustand
- Refactored multiple features to use shared state
- Skeleton loaders for every data-fetching screen
- Empty states for all major modules
- Reusable API layer
- Responsive and polished UI
- Authentication and protected routes
- Client-side and server-side validation

## Future Enhancements

- AI image generation for room concepts
- Drag-and-drop inspiration boards
- 3D room visualization
- Social sharing
- Designer profiles
- Collaboration on shared collections
- AR room preview
- AI furniture recommendations

## License

This project is developed for educational purposes as part of a Frontend AI Engineering assignment.

## Author

**Nabiha Saleem**

Full Stack Web Developer

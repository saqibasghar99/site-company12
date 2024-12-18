import express from 'express';
import Connection from './dataBase/db.js';
import routes from './Router/route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 8000;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000' || 'http://localhost:3001' , // Update this to match your frontend origin
    credentials: true // Allow credentials (cookies) to be sent
}));

app.use(cookieParser());
app.use(express.json()); // Handle JSON data 
app.use(express.urlencoded({ extended: true }));


// Database Connection
Connection();

// Routes
app.use('/', routes);

// Start the server
app.listen(port, () => console.log(`Server is running on port ${port}!`));

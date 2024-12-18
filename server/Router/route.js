import express from 'express';
import { Login, Logout  , signUp , Contact , updateNotifcationStatus , allNotifications , detailNotifcationStatus} from '../controller/routeController.js';

import { authMiddleware } from '../Middleware/authenicate.js'; // Import your middleware here

// We export this function
const route = express.Router();

// Authentication Routes
route.post('/login', Login , authMiddleware);
route.post('/signup', signUp );
route.post('/logout', Logout );

route.post('/contact', Contact );
route.get('/notifications', allNotifications)
route.patch('/notification/:id', updateNotifcationStatus)
route.get('/detailNotifcationStatus/:id', detailNotifcationStatus);

export default route;

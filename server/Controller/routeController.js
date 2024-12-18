import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../Model/User.js';
import FormData from '../Model/FormData.js';

export const Login = async (req, res) => {
  let { email, password } = req.body;
 
   try {
      console.log(email)
      const user = await User.findOne({ email });
      if (!user) {
        console.log(email)
        return res.status(400).json({ message: 'User not Exist' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const payload = {
        user: {
          id: user._id,
          email: user.email
        },
      };
  
      const token = jwt.sign(payload, process.env.JWT_SECRET);
  
      const expirationDate = new Date(Date.now() + 300000); 
      res.cookie('token', token, { expires: expirationDate});
  
      // Send the token in the response body to be stored in local storage
      res.status(200).json({ message: 'Logged in successfully'});
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};


export const Logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
  return res.status(200).json({ message: 'Logout successful' });
};


export const signUp = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = new User({
        email,
        password: hashedPassword,
      });
  
      await newUser.save();

      res.status(200).json({
        message: 'User registered successfully'});
    } 
    catch (error) {
      res.status(500).json({ message: error.message });
    }
};

// export const Contact = async (req, res) => {

//   const { name, email, phone, message  } = req.body;

//   console.log(name, email, phone, message);
  
//   try{
//     // here Comes Model-Name in which we store data
//     const MessageData = new FormData({
//       name,
//       email,
//       phone,
//       message
//     });
  
//     await MessageData.save();
  
//     res.status(200).json({ message: 'Message sent successfully' });
//   }

//   catch (error) {
//     res.status(500).json({ message: error.message });
//   }

// }


// =================================== > Savwe Message and send to mail also < =================================
import nodemailer from 'nodemailer';

export const Contact = async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Step 1: Save the message to the MongoDB database
    const newMessage = new FormData({
      name,
      email,
      phone,
      message,
    });

    // Save the data to the database
    await newMessage.save();
    
    

    // Step 2: Set up the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // Or use another email service (e.g., SendGrid, Mailgun, etc.)
      auth: {
        user: process.env.Sender_Mail,  // Your email address
        pass: process.env.E_Password,   // Your email password or app-specific password (for Gmail)
      },
    });

    // Step 3: Define the email options (recipient, subject, and body)
    const mailOptions = {
      from: process.env.Sender_Mail,
      to: process.env.Receiver_Mail, // The recipient's email (you can use your email for testing)
      subject: 'New Contact Form Submission',
      text: `
        You have received a new contact form submission:

        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    };

    // Step 4: Send the email using Nodemailer
    await transporter.sendMail(mailOptions);

    // Step 5: Return a response back to the user
    res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Error sending email or saving message:', error);
    res.status(500).json({ message: 'Failed to send message! Please use by new mail.' });
  }
};


// Read Message Send BY const Others : 

// Fetch all notifications
export const allNotifications = async (req, res) => {
  try {
    const notifications = await FormData.find(); // Get all messages
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const detailNotifcationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const notifications = await FormData.findOne({_id: id}) // Get all messages
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// // Update 'seen' status
// export const updateNotifcationStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedMessage = await FormData.findByIdAndUpdate(
//       id,
//       { seen: true }, // Mark as seen
//       { new: true } // Return the updated document
//     );
//     if (updatedMessage) {
//       res.status(200).json({ message: 'Notification marked as seen', data: updatedMessage });
//     } else {
//       res.status(404).json({ message: 'Notification not found' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// controllers/notificationController.js

// Update 'seen' status and set 'seenAt' timestamp
export const updateNotifcationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMessage = await FormData.findByIdAndUpdate(
      id,
      { 
        seen: true, // Mark as seen
        seenAt: new Date(), // Set the current timestamp when marked as seen
      },
      { new: true } // Return the updated document
    );
    if (updatedMessage) {
      res.status(200).json({ message: 'Notification marked as seen', data: updatedMessage });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

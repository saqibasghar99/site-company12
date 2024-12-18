import mongoose from 'mongoose';

const Connection = () =>{

    try{
        mongoose.connect(process.env.DB_URI)
        .then(() => console.log("Database connected successfully"))
        .catch(error => console.log("Error while connecting with the database", error.message));
    }
    catch(error)
    {
        console.log("Error while connecting with the database",error.message)
    }
}

export default Connection;
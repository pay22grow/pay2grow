require("dotenv").config();
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

const connectToMongo = () => {
    mongoose
        .connect(mongoURI, { useNewUrlParser: true })
        .then(() => {
            console.log("Connected to MongoDB Successfully");
        })
        .catch((err) => {
            console.error("Error connecting to MongoDB", err);
        });
};

module.exports = connectToMongo;

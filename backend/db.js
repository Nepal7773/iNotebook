const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://nepalsinhrajput007773:TbAr2aN9zNdd3EP4@cluster0.cudw43d.mongodb.net/inotebook?retryWrites=true&w=majority";

const connectToMongo = () => {
    try {
        mongoose.set("strictQuery", true);
        mongoose.connect(mongoURI).then(() => {
            console.log("Connected")
        }).catch((error) => {
            console.log("Error")
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongo;


const cors = require("cors");
const express  = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = 8082;
const DB_URI = "mongodb+srv://udeshya1706:z2kNm7Q4UIcuk7ZR@cluster0.hpsku.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(DB_URI)
    .then(() => console.log("DB connected"))
    .catch((error) => console.log("Error in connecting DB", error));

app.use(cors());


app.use(express.json());


app.listen(PORT, ()=>{
    console.log(`Backend is listening on PORT ${PORT}`);
});
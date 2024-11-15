const mongoose = require("mongoose"); 
const Schema = mongoose.Schema;

const serviceSchema = new Schema({
    name: String,
    description: String,
    price: Number,
})

const ServiceModel = mongoose.model("service",serviceSchema);
module.exports = ServiceModel;
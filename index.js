const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ServiceModel = require('./models/ServiceModel');

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true })); 
app.use(methodOverride("_method"));

app.engine('ejs',ejsMate)

main()
 .then(() => {
    console.log("Mongodb Connected Successfully");
 })
 .catch((err) => {
    console.log("Error", err.message);
 })

async function main(){
    await mongoose.connect("mongodb+srv://user:BJTf1CGtNhMXR2Hp@deliverymgmtcluster.nnozz.mongodb.net/?retryWrites=true&w=majority&appName=DeliveryMgmtCluster");
}

app.get("/", (req, res) => {
    res.redirect("/allServices");
})

app.get("/allServices", async (req, res) => {
    const allServices = await ServiceModel.find({});
    res.render("services/ServicesPage.ejs", { allServices });
})

app.get("/addService", (req, res) => {
    res.render("services/AddServicePage.ejs");
})

app.post("/addService", async (req, res) => {
    try {
        const addService = new ServiceModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        });
        
        const savedService = await addService.save();
        console.log("Service saved:", savedService);    
        res.redirect("/allServices");

    } catch (error) {
        console.error("Error saving service:", error);
    }
})

app.get("/editService/:id", async (req, res) => {
    const id = req.params.id;
    const service = await ServiceModel.findById(id);
    res.render("services/EditServicePage", { service });
})

app.put("/editService/:id", async (req, res) => {
    const id = req.params.id;
    const {name, description, price} = req.body
    const updatedService = await ServiceModel.findByIdAndUpdate(
        id,
        { name, description, price }, 
        { new: true, runValidators: true }
    );
    res.redirect("/allServices");
})

app.delete("/deleteService/:id", async(req, res) => {
    await ServiceModel.findByIdAndDelete(req.params.id);
    res.redirect("/allServices");
})

app.listen(8080, ()=>{
    console.log("App Listening on port 8080");
})
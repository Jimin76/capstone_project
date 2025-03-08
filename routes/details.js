const express = require("express");
const router = express.Router();
const Reserve = require("../models/reserve");
const FoodItem = require("../models/food");
const Connection = require("../models/connect");

router.get("/:revsID/details", async (req, res) => {
    try {
        const revsID = req.params.revsID;

        //Find all FoodIDs for the given reservation
        const foodLinks = await Connection.find({ ReserveID: new mongoose.Types.ObjectId(revsID) });

        //Extract FoodIDs
        const foodIDs = foodLinks.map(link => link.FoodID);

        //Find food items that match the FoodIDs
        const foodItems = await FoodItem.find({ _id: { $in: foodIDs } });

        //Get reservation info
        const row = await Reserve.find({ _id: revsID })
        //Render the details page with food items
        res.render("details", { foodItems, row });
    } catch (err) {
        console.error("Error fetching food items:", err);
        res.status(500).send("Error retrieving food data");
    }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const FoodItem = require("../models/food");
const Connection = require("../models/connect");

router.get("/:revsID/details", async (req, res) => {
    try {
        const revsID = parseInt(req.params.revsID);

        //Find all FoodIDs for the given reservation
        const foodLinks = await Connection.find({ ReserveID: revsID });

        //Extract FoodIDs
        const foodIDs = foodLinks.map(link => link.FoodID);

        //Find food items that match the FoodIDs
        const foodItems = await FoodItem.find({ _id: { $in: foodIDs } });

        //Render the details page with food items
        res.render("details", { foodItems });
    } catch (err) {
        console.error("Error fetching food items:", err);
        res.status(500).send("Error retrieving food data");
    }
});

module.exports = router;
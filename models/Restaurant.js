const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: String,
  location: String,
  hours: {
    weekday: String,
    weekend: String
  },
  menu: [{ name: String, price: String }],
  contact: String
});

module.exports = mongoose.model("Restaurant", restaurantSchema);

// import packages that we need -> mongoose, bcrypt,
const mongoose = require("mongoose");
const { isEmail } = require("validator");
const ClientSchema = new mongoose.Schema({
  // what do elements do I need -> clientEmail, ID/imei, externalIP, port{http, socks}, validUntil, status, operator, userCredentials{username/password}
  clientEmail: {
    type: String,
    required: [true, "You must have a valid client email"],
    unique: true,
    validate: [isEmail, "invalid Email"],
  },
  proxyData: [
    {
      ID: {
        type: String,
        required: [true, "You must have a valid client ID/IMEI"],
        unique: true,
      },
      validUntil: {
        type: Date,
        required: [true, "You must have a valid End Date"],
      },
      status: {
        type: String,
        enum: ["inactive", "active"],
        default: "active",
      },
      operator: {
        type: String,
        enum: [
          "Odido",
          "AT&T",
          "T-mobile",
          "Verizon",
          "US Mobile",
          "Cricket Wireless",
          "Google Fi",
          "Mint Mobile",
          "Vodafone",
          "Xfinity Mobile",
          "Visible",
          "Consumer Cellular",
          "Metro by T-Mobile",
        ],
        default: "Odido",
      },
      port: {
        http: {
          type: Number,
          unique: true,
        },
        socks: {
          type: Number,
          unique: true,
        },
      },
      proxyCredentials: {
        username: String,
        Password: String,
      },
    },
  ],
});

module.exports = mongoose.model("ClientProxies", ClientSchema);

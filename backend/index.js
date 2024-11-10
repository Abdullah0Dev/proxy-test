const express = require("express");
const mongoose = require("mongoose");
const {
  assignFreeProxy,
  rotateIP,
  getBandwidthUsage,
  downloadVPNProfile,
  getSpeedTest,
  sendSMS,
  logIpRotation,
  connectionTestResults,
  readSMS,
  updateCredentials,
  showStatus,
  listActivePorts,
  editCredentials,
} = require("./proxyService");
const cors = require("cors");
const { default: axios } = require("axios");
// Load environment variables
require("dotenv").config();

const app = express();
app.use(express.json()); // Enable JSON body parsin

app.use(cors());
// ! Protect server requests
// 'http://localhost:5173/, http://localhost:3000/, https://powerproxies.vercel.app, https://powerproxy.io '
// const corsOptions = {
//   origin: "https://powerproxy.io", // only allow this website to access the server
//   optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));
// Routes
app.post("/assign-proxy", async (req, res) => {
  try {
    const userId = req.body.userId;
    const proxy = await assignFreeProxy(userId);
    res.json(proxy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/rotate-ip/:proxyId", async (req, res) => {
  try {
    const proxyId = req.params.proxyId;
    const result = await rotateIP(proxyId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
    res.json(err);
  }
});
// http://188.245.37.125:7016/modem/speedtest/352733105770960
app.get("/bandwidth/:portId", async (req, res) => {
  // ex: port8dJfIDXI
  try {
    const portId = req.params.portId;
    const bandwidth = await getBandwidthUsage(portId);
    res.json(bandwidth);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/*
-> Connections test result
http://188.245.37.125:7016/modem/conn_test/352733105770960

-> IP rotation log
http://188.245.37.125:7016/modem/rotation_log/352733105770960
-> USSB reset
http://188.245.37.125:7016/modem/usb_reset_modem?arg=wwan_modem658
 
->reboot
http://188.245.37.125:7016/modem/reboot?imei=352733105770960

-> READ sms
http://188.245.37.125:7016/modem/sms/352733105770960
 
 
*/
app.post("/speed-test/", async (req, res) => {
  // ex: port8dJfIDXI

  try {
    const { imei } = req.body; //ipAddress, port, imei, username, password

    // Pass all extracted values to the getSpeedTest function
    const speedTest = await getSpeedTest(imei);

    res.json(speedTest);
    /*
    ex request:
    {
      "ipAddress": "188.245.37.125",
      "port": "7016",
      "imei": "352733105770960",
      "username": "proxy",
      "password": "proxy"
    }
    */
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ip log
app.get("/ip-logs/:imei", async (req, res) => {
  try {
    const { imei } = req.params;

    const logRotation = await logIpRotation(imei);

    res.json(logRotation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// connection results
app.get("/connection-results/:imei", async (req, res) => {
  try {
    const { imei } = req.params;

    const connectionTest = await connectionTestResults(imei);

    res.json(connectionTest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// show status json -> Show External IP -> Model, Device -> SIM, Carrier	-> NICK -> IMEI -> Net Mode	-> Modem IP	->
app.get("/show-user-info", async (req, res) => {
  try {
    const statusJson = await showStatus();
    const activePort = await listActivePorts();
    res.json({ userStatus: statusJson, activeUserInfo: activePort });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Change credentials
app.post("/credentials/:portId", async (req, res) => {
  try {
    const portId = req.params.portId;
    const { newUsername, newPassword } = req.body;

    const result = await updateCredentials(portId, newUsername, newPassword);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read SMS
app.get("/read-sms/:imei", async (req, res) => {
  try {
    const { imei } = req.params;

    const readMessages = await readSMS(imei);

    res.json(readMessages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// send sms
app.post("/send-sms", async (req, res) => {
  try {
    const { imei, phone, sms } = req.body;
    const smsResponse = await sendSMS(imei, phone, sms);
    // return the res
    res.json(smsResponse);
    console.log(`sms response`, smsResponse);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
  /*
  ex req:
  { 
  "imei": "352733105770960",
  "phone": "+201122026970",
  "sms": "you bro, this is a test from the API.. so if you received it.. msg me on whatsapp, OK?"
}
  */
});
// download ovpn profile
app.get("/ovpn/:portId", async (req, res) => {
  try {
    const portId = req.params.portId;
    const ovpnLink = await downloadVPNProfile(portId);
    res.json({ downloadUrl: ovpnLink });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Track Website visitors
app.get("/web-statistics/last-30-days", async (req, res) => {
  try {
    const response = await axios.get(
      "https://checkstat.net/includes/statistics/get_chart_statistics.php?site_id=911&start_date=2024-10-11T00:00:00+03:00&end_date=2024-11-09T23:59:59+02:00&onlyUnique=false&activity=null&limit=300"
    );

    console.log(`Web analysis`, response.data);
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
// device type
app.get("/web-statistics/device-type", async (req, res) => {
  try {
    const response = await axios.get(
      `https://checkstat.net/includes/statistics/get_device_statistics.php?site_id=911&start_date=2024-10-12T00:00:00+03:00&end_date=2024-11-10T23:59:59+02:00&onlyUnique=false&activity=null&limit=8`
    );

    console.log(`Device type analysis`, response.data);
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
// user country
app.get("/web-statistics/user-country", async (req, res) => {
  try {
    const response = await axios.get(
      `https://checkstat.net/includes/statistics/get_country_statistics.php?site_id=911&start_date=2024-10-12T00:00:00+03:00&end_date=2024-11-10T23:59:59+02:00&onlyUnique=false&activity=null&limit=300`
    );

    console.log(`user country analysis`, response.data);
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
// when you send a response twice it doesn't work
// device type: https://checkstat.net/includes/statistics/get_device_statistics.php?site_id=911&start_date=2024-10-11T00:00:00+03:00&end_date=2024-11-09T23:59:59+02:00&onlyUnique=false&activity=null&limit=8

// MongoDB connection and Server start
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// 0:50 + 1:09 + 2:05 + 1:57 + 1:28

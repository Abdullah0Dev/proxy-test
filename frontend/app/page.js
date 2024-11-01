"use client";
import axios from "axios";
import { useState } from "react";

const BackendTest = () => {
  const [speedTest, setSpeedTest] = useState([]);
  const handleSpeedTest = async () => {
    const response = await axios.post(`http://localhost:4000/speed-test/`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        // Accept: "*/*",
        // Connection: "keep-alive",
      },
      body: JSON.stringify({
        // ipAddress: "188.245.37.125",
        // port: "7016",
        imei: "860191063669325",
        // username: "proxy",
        // password: "proxy",
      }),
    });
    setSpeedTest(response?.data);
  };
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="  min-h-[30vh] bg-blue-400 items-center justify-center flex">
        {speedTest}
      </div>
      <div className="w-full h-full flex items-center-justify-center">
        <button
          className=" mt-9 ml-9  rounded-lg py-2 self-center flex items-center bg-slate-600 px-9"
          onClick={handleSpeedTest}
        >
          Test
        </button>
      </div>
    </div>
  );
};

export default BackendTest;

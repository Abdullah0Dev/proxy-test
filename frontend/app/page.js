"use client";
import axios from "axios";
import { useState } from "react";

const BackendTest = () => {
  const [speedTest, setSpeedTest] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleSpeedTest = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `https://proxy-test-iqka.onrender.com/speed-test/`,
        {
          imei: "860191063669325",
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
      setSpeedTest(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error during speed test:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="  min-h-[30vh] bg-blue-400 items-center justify-center flex">
        {speedTest}
      </div>
      <div className="w-full h-full flex items-center-justify-center">
        {loading ? (
          <h1> loading</h1>
        ) : (
          <button
            className=" mt-9 ml-9  rounded-lg py-2 self-center flex items-center bg-slate-600 px-9"
            onClick={handleSpeedTest}
          >
            Test
          </button>
        )}
      </div>
    </div>
  );
};

export default BackendTest;

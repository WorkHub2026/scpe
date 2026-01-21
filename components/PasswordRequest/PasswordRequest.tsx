"use client";
import { adminGetsPasswordRequests } from "@/lib/services/passwordRequest.service";
import { useState, useEffect } from "react";
import PasswordRequestTable from "./PasswordRequestTable";
const PasswordRequest = () => {
  const [requests, setRequests] = useState([]);
  const fetchRequests = async () => {
    try {
      const response: any = await adminGetsPasswordRequests();
      console.log(response);
      setRequests(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);
  return (
    <div className="">
      <h1 className="text-xl font-bold mb-4">DIB-U-CUSBOONAYSIINIT GELITAANKA </h1>
      <PasswordRequestTable requests={requests} />
    </div>
  );
};

export default PasswordRequest;

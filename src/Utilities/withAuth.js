import React from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../Components/navbar";
export default function withAuth(Component) {
  const token = JSON.parse(sessionStorage.getItem("token") || "{}");
  return token === "{}" ? <Navigate to="/" /> : <Navbar>{Component}</Navbar>;
}

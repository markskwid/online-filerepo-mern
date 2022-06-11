import { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Forgot from "./pages/forgot";
import Navigation from "./navigation/navigation";
import SideBar from "./imports/sidebar";

const Context = createContext("Default Value");

function App() {
  return <Navigation />;
}

export default App;

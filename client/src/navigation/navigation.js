import { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Home from "../pages/home";
import Forgot from "../pages/forgot";
import NotFound from "../pages/notFound";
import Sample from "../pages/sample";
import Profile from "../pages/edit_profile";
import ViewHistory from "../pages/area_history";

import PrintFile from "../admin/printFile";
import PrintLogs from "../admin/printLogs";

import AdminLogin from "../admin/admin_login";
import AdminHome from "../admin/admin_home";
import User from "../admin/user";
import AdminLogs from "../admin/admin_logs";
import AdminFiles from "../admin/admin_files";
import Archive from "../admin/admin_archive";
const Navigation = () => {
  const [user, setLoginUser] = useState({});

  return (
    <Routes>
      <Route
        index
        element={
          user && user._id ? <Home /> : <Login setLoginUser={setLoginUser} />
        }
      />
      <Route path="login" element={<Login setLoginUser={setLoginUser} />} />
      <Route path="home" element={<Home />} />
      <Route path="sample" element={<Sample />} />
      <Route path="profile" element={<Profile />} />
      <Route path="history" element={<ViewHistory />} />
      <Route path="forgot" element={<Forgot />} />
      <Route path="admin" element={<AdminLogin />}></Route>
      <Route path="/admin/home" element={<AdminHome />} />
      <Route path="/admin/user" element={<User />} />
      <Route path="/admin/logs" element={<AdminLogs />} />
      <Route path="/admin/files" element={<AdminFiles />} />
      <Route path="/admin/archive" element={<Archive />} />
      <Route path="/admin/printfiles" element={<PrintFile />} />
      <Route path="/admin/printlogs" element={<PrintLogs />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Navigation;

import "./global.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, Redirect } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [notVerified, setVerified] = useState("");
  useEffect(() => {
    document.title = "Admin Login";
  });
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const handleInputs = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const AlertBox = () => {
    return (
      <div className="alert alert-danger alert-dismissible w-75 mx-auto fade show alert-box">
        <strong>
          {notVerified === "password"
            ? "Wrong Password"
            : notVerified === "not admin"
            ? "You are not an admin!"
            : notVerified === "exists"
            ? "Cannot find your account"
            : null}
        </strong>
      </div>
    );
  };

  const formSubmit = (e) => {
    e.preventDefault();
    axios.post("/manage-user/admin-login", values).then((res) => {
      if (res.data.user) {
        res.data.user ? navigate("/admin/home") : navigate("/admin");
      } else if (res.data === "password") {
        setVerified(res.data);
        setValues({
          username: "",
          password: "",
        });
      } else {
        setVerified(res.data);
        setValues({
          username: "",
          password: "",
        });
      }
    });
  };
  return (
    <div className="container-fluid main-container">
      <div className="col-md-5 form-container">
        <form onSubmit={formSubmit} autoComplete={"off"}>
          <div className="mb-3 mt-3 w-75 mx-auto">
            <img
              height={"260"}
              width={"260"}
              src={
                "https://res.cloudinary.com/dvdpkvkj2/image/upload/v1652954737/admin_trkl6d.png"
              }
            ></img>
            <input
              type={"text"}
              name={"username"}
              value={values.username}
              placeholder={"Enter username"}
              className="mt-2 form-control"
              onChange={handleInputs}
            ></input>
          </div>
          <div className="mb-3 mt-3 w-75 mx-auto">
            <input
              name={"password"}
              type={"password"}
              value={values.password}
              placeholder={"Enter password"}
              className="form-control"
              onChange={handleInputs}
            ></input>
          </div>
          {notVerified !== "" && <AlertBox />}
          <div className="mb-3 mt-3 w-75 mx-auto">
            <button className="btn btn-success w-100 login-btn" type="submit">
              Sign In
            </button>
          </div>
        </form>
        <Link className="link" to="/login">
          <p>Member Login</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;

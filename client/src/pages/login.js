import "./global.css";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, Redirect } from "react-router-dom";
import axios from "axios";

const Login = ({ setLoginUser }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [notVerified, setVerified] = useState("");
  const [notExists, setExists] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);
  const [valid, setValid] = useState(false);

  const [counter, setCounter] = useState(60);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    document.title = "Login";

    if (attempts === 3) {
      const timer =
        counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

      if (counter === 0) {
        setCounter(60);
        setAttempts(0);
        setVerified("");
      }
      return () => clearInterval(timer);
    }
  }, [counter, attempts]);

  const AlertBox = () => {
    return (
      <div className="alert alert-danger alert-dismissible w-75 mx-auto fade show alert-box">
        <strong>
          {notVerified === "password"
            ? "Wrong Password"
            : notVerified === "exists"
            ? "Account doesn't exists!"
            : notVerified === "email"
            ? "Your email is not verified!"
            : null}
        </strong>
      </div>
    );
  };

  const login = () => {
    axios
      .post("/manage-user/login", { username: username, password: password })
      .then((res) => {
        if (res.data.user) {
          navigate("/", setLoginUser(res.data.user));
        } else if (res.data === "password") {
          setVerified(res.data);
          setAttempts(attempts + 1);
          setPassword("");
        } else {
          setVerified(res.data);
          setPassword("");
        }
      });
  };

  return (
    <div className="container-fluid main-container">
      <div className="col-md-5 form-container">
        <img
          height={"200"}
          width={"260"}
          src={
            "https://res.cloudinary.com/dvdpkvkj2/image/upload/v1652888487/logo_nvvc3i.png"
          }
        ></img>

        <div className="mb-3 mt-3 w-75 mx-auto">
          <input
            type={"text"}
            value={username}
            placeholder={"Enter your username"}
            className="form-control"
            onChange={(e) => setUsername(e.target.value)}
          ></input>
        </div>
        <div className="mb-3 mt-3 w-75 mx-auto">
          <input
            value={password}
            type={"password"}
            placeholder={"Enter your password"}
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>
        {notVerified !== "" && <AlertBox />}
        <div className="mb-3 mt-3 w-75 mx-auto">
          <button
            className="btn btn-success w-100 login-btn"
            onClick={login}
            disabled={counter === 60 || counter === 0 ? false : true}
          >
            Sign In
          </button>
        </div>

        {attempts === 3 && (
          <p className="text-danger">
            Please wait {counter} seconds to login again
          </p>
        )}

        {/* <Link className="link" to="forgot">
          <p>Forgot Password?</p>
        </Link> */}

        <Link className="link" to="/admin">
          <p>Are you an Admin?</p>
        </Link>
      </div>
    </div>
  );
};

export default Login;

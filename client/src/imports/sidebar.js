import "./styles.css";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Logout from "./logout_modal";
const Sidebar = (props) => {
  const [logout, setLogout] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    role: "",
    area: "",
    picture: "",
  });

  const [flag, setFlag] = useState(false);

  useEffect(() => {
    getName();
  }, []);

  const toggleModal = () => {
    setLogout(!logout);
  };

  const getName = () => {
    axios.get("/manage-user/get-info").then(
      (res) =>
        setUserData({
          username: res.data.username,
          role: res.data.role,
          area: res.data.area,
          picture: res.data.picture,
        }),
      setFlag(true)
    );
  };
  return (
    <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 sidebar">
      <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
        <span className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none"></span>

        <img
          src={
            userData.picture === ""
              ? "https://res.cloudinary.com/dvdpkvkj2/image/upload/v1652871890/obtmnrtlh69nafrfiqjq.jpg"
              : userData.picture
          }
          width="150"
          height="150"
          className="text-center rounded-circle profile-picture mb-2"
        />

        <span className="d-none d-sm-inline name">{userData.username}</span>

        <span className="d-none d-sm-inline role">{userData.role}</span>

        <ul
          className="nav nav-pills flex-column mb-sm-auto mt-2 mb-0 align-items-center align-items-sm-start"
          id="menu"
        >
          <li className="nav-item py-2">
            <Link
              to={userData.role === "Admin" ? "/admin/home" : "/home"}
              className="nav-link align-middle px-0"
            >
              <i className="fs-4 fa fa-home"></i>{" "}
              <span className="ms-3 d-none d-sm-inline">Home</span>
            </Link>
          </li>

          {userData.role !== "Admin" && (
            <li className="nav-item py-2">
              <Link to="/profile" className="nav-link align-middle px-0">
                <i className="fs-4 fa fa-user"></i>{" "}
                <span className="ms-3 d-none d-sm-inline">View Profile</span>
              </Link>
            </li>
          )}

          {userData.role === "Faculty" && (
            <li className="nav-item py-2">
              <Link to="/history" className="nav-link align-middle px-0">
                <i className="fs-4 fa fa-history"></i>{" "}
                <span className="ms-3 d-none d-sm-inline">Area History</span>
              </Link>
            </li>
          )}

          {userData.role === "Admin" ? (
            <div>
              <li className="nav-item py-2">
                <Link to="/admin/files" className="nav-link align-middle px-0">
                  <i className="fs-4 fa fa-folder"></i>{" "}
                  <span className="ms-3 d-none d-sm-inline">Manage Files</span>
                </Link>
              </li>

              <li className="nav-item py-2">
                <Link
                  to="/admin/archive"
                  className="nav-link align-middle px-0"
                >
                  <i className="fs-4 fa fa-archive"></i>{" "}
                  <span className="ms-3 d-none d-sm-inline">Archive</span>
                </Link>
              </li>

              <li className="nav-item py-2">
                <Link to="/admin/user" className="nav-link align-middle px-0">
                  <i className="fs-4 fa fa-user-plus"></i>{" "}
                  <span className="ms-2 d-none d-sm-inline">Manage Users</span>
                </Link>
              </li>

              <li className="nav-item py-2">
                <Link to="/admin/logs" className="nav-link align-middle px-0">
                  <i className="fs-4 fa fa-history"></i>{" "}
                  <span className="ms-3 d-none d-sm-inline">Manage Logs</span>
                </Link>
              </li>
            </div>
          ) : null}

          <li className="nav-item py-2">
            <button
              onClick={() => toggleModal()}
              className="nav-link align-middle px-0"
            >
              <i className="fs-4 fa fa-sign-out"></i>{" "}
              <span className="ms-2 d-none d-sm-inline">Sign Out</span>
            </button>
          </li>
        </ul>

        <hr />
      </div>
      <Logout isOpen={logout} toggle={toggleModal} userRole={userData.role} />
    </div>
  );
};

export default Sidebar;

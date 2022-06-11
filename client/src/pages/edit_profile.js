import "./global.css";
import Sidebar from "../imports/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import EditProfileModal from "./edit_profile_modal";
import ChangeProfile from "./changeProfile_modal";

const EditProfile = () => {
  const [image, setImage] = useState("");
  const [url, setURL] = useState("");
  const [profileModal, setProfileModal] = useState(false);
  const [cannotEdit, setCannotEdit] = useState(false);
  const [logs, setLogs] = useState([]);

  const [userData, setUserData] = useState({
    fullname: "",
    username: "",
    email: "",
    role: "",
    area: "",
    password: "",
    picture: "",
    id: "",
  });

  const [edit, setEdit] = useState(false);

  const [password, setPassword] = useState("mypassword");

  useEffect(() => {
    document.title = "Edit Profile";
    getUserData();
    getLogs();
  }, [profileModal, url, edit]);

  const getLogs = () => {
    axios.get("/logs/read-logs").then((res) => setLogs(res.data));
  };

  const getUserData = () => {
    axios.get("/manage-user/get-info").then((res) => {
      setUserData({
        username: res.data.username,
        role: res.data.role,
        area: res.data.area,
        fullname: res.data.fullname,
        password: res.data.password,
        email: res.data.email,
        id: res.data.id,
      });
      setURL(res.data.picture);
    });
  };

  const toggleProfileModal = () => {
    setProfileModal(!profileModal);
  };

  const toggleModal = () => {
    setEdit(!edit);
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const AlertBox = () => {
    return (
      <div className="alert alert-danger alert-dismissible  mx-auto fade show alert-box">
        <strong>You cannot change your credentials</strong>
      </div>
    );
  };

  const DisplayUsers = () => {
    return logs.map((i) => (
      <tr key={i._id}>
        {userData.id === i.uid && (
          <>
            <td>{i.action}</td>
            <td>{i.date.substring(0, i.date.indexOf("T"))}</td>
          </>
        )}
      </tr>
    ));
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Sidebar />
        <div className="col py-3 content-area">
          <h5>Your Profile</h5>
          <div className="container-fluid view-container">
            <div className="row">
              <div className="col-md-2 p-2 text-center">
                <img
                  src={
                    url === ""
                      ? "https://res.cloudinary.com/dvdpkvkj2/image/upload/v1652871890/obtmnrtlh69nafrfiqjq.jpg"
                      : url
                  }
                  width="180"
                  height="180"
                  className="rounded-circle profile-picture"
                />
                {userData.role === "Faculty" && (
                  <button
                    className="btn btn-primary mt-1 update-profile"
                    onClick={() => setProfileModal(true)}
                  >
                    Change Profile
                  </button>
                )}
              </div>

              <div className="col-md-8 p-3 ps-4 user-information">
                <h3 className="user-name">{userData.fullname}</h3>
                <h6 className="user-role">{userData.role}</h6>
                <span className="fs-5 mt-3 ml-2 fa fa-user icons" />{" "}
                <span className="user-data">{userData.username}</span>
                <span className="fs-5 mt-3 ml-2 fa fa-envelope icons" />{" "}
                <span className="user-data">{userData.email}</span>
                <br />
                <span className="fs-5 mt-3 fa fa-lock icons" />{" "}
                <span className="user-data">
                  {userData.password.replace(
                    userData.password.substring(
                      1,
                      userData.password.length - 3
                    ),
                    userData.password
                      .substring(1, userData.password.length - 3)
                      .replace(/./g, "*")
                  )}
                </span>
              </div>
              {userData.role !== "Accreditors" && (
                <div
                  className="col-md-2 edit-btn-container"
                  onClick={() => {
                    userData.role === "Accreditors"
                      ? setCannotEdit(true)
                      : setEdit(true);
                  }}
                >
                  <div className="edit-btn float-end">Edit Profile</div>
                </div>
              )}

              {userData.role === "Accreditors" && (
                <div
                  className="col-md-2 edit-btn-container"
                  onClick={() => setProfileModal(true)}
                >
                  <div className="edit-btn float-end">Change Profile</div>
                </div>
              )}
            </div>
          </div>

          <div className="container-fluid for-sort">
            {cannotEdit && <AlertBox />}
            <div className="row">
              <div className="col-md-12">
                <span>History</span>
                {/* <select className="form-select form-select-sm w-25 float-sm-end">
                  <option value="name">Sort by name</option>
                  <option value="role">Sort by role</option>
                  <option value="email">Sort by email</option>
                </select> */}
              </div>
            </div>
          </div>

          <div className="container-fluid border for-table-history">
            <table className="table mb-0 table-hover table-bordered text-center title-table">
              <thead className="table-dark">
                <tr>
                  <th>Action</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <DisplayUsers />
              </tbody>
            </table>
          </div>
        </div>
        <ChangeProfile isOpen={profileModal} toggle={toggleProfileModal} />
        <EditProfileModal isOpen={edit} toggle={toggleModal} />
      </div>
    </div>
  );
};

export default EditProfile;

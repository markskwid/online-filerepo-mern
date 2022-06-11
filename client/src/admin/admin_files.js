import "./global.css";
import Sidebar from "../imports/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
const AdminFiles = () => {
  const [logs, setLogs] = useState([]);
  const [emailExists, setExists] = useState(false);
  const [modalEdit, setVisibleEdit] = useState(false);
  const [print, setPrint] = useState(false);

  const [successUpdate, setSuccessUpdate] = useState("");

  const [sort, setSort] = useState("name");

  const [render, setRender] = useState(1);
  useEffect(() => {
    document.title = "Manage Files";
    getLogs();
  }, []);

  const getLogs = () => {
    axios.get("/api/read").then((res) => setLogs(res.data));
  };

  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    username: "",
    email: "",
    role: "",
    area: "",
    password: "",
  });

  const [editValues, setEditValues] = useState({
    id: "",
    username: "",
    email: "",
    role: "",
    area: "",
    password: "",
  });

  const handleInputs = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditInputs = (e) => {
    setEditValues({
      ...editValues,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setValues({
      username: "",
      email: "",
      role: "",
      area: "",
      password: "",
    });
  };

  const AlertBox = () => {
    return (
      <div
        className={
          successUpdate === "success"
            ? "alert alert-success alert-dismissible fade show"
            : successUpdate === "failed"
            ? "alert alert-danger alert-dismissible fade show"
            : emailExists
            ? "alert alert-danger alert-dismissible fade show"
            : "alert alert-success alert-dismissible fade show"
        }
      >
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
        ></button>
        <strong>
          {successUpdate === "success"
            ? "User updated successfully"
            : successUpdate === "failed"
            ? "Failed to update user"
            : emailExists
            ? "Email already exists!"
            : ""}
        </strong>
      </div>
    );
  };

  const printData = () => {
    window.print();
  };

  const deleteUser = (id) => {
    axios
      .delete("/manage-user/delete/" + id)
      .then((res) => (res.data ? setRender(render + 1) : null));
  };

  const formSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/manage-user/add", values)
      .then((res) => (res.data.success ? setRender(render + 1) : null));
  };

  const formEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put("/manage-user/update/" + editValues.id, editValues)
      .then((res) => setSuccessUpdate(res.data));
  };

  const DisplayFiles = () => {
    if (sort === "date") {
      return logs
        .sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated))
        .map((item, i) => (
          <tr key={item._id}>
            <td>{item.fileName}</td>

            <td>{item.extensionName}</td>
            <td>
              {item.dateCreated.substring(0, item.dateCreated.indexOf("T"))}
            </td>
            <td>
              <button
                type="button"
                className="btn btn-success"
                onClick={() =>
                  setVisibleEdit(true) ||
                  setEditValues({
                    id: item._id,
                    username: item.username,
                    email: item.email,
                    role: item.role,
                    area: item.area,
                    password: item.password,
                  })
                }
              >
                <i className="fa fa-edit"></i>
              </button>{" "}
              <button
                type="button"
                className="btn btn-danger ml-2"
                onClick={() => deleteUser(item._id)}
              >
                <i className="fa fa-archive"></i>
              </button>
            </td>
          </tr>
        ));
    } else if (sort === "name") {
      return logs
        .sort((a, b) => (a.fileName > b.fileName ? 1 : -1))
        .map((item, i) => (
          <tr key={item._id}>
            <td>{item.fileName}</td>

            <td>{item.extensionName}</td>
            <td>
              {item.dateCreated.substring(0, item.dateCreated.indexOf("T"))}
            </td>
            <td>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteUser(item._id)}
              >
                <i className="fa fa-archive"></i> <span>Delete File</span>
              </button>
            </td>
          </tr>
        ));
    } else if (sort === "extension") {
      return logs
        .sort((a, b) => (a.extensionName > b.extensionName ? 1 : -1))
        .map((item, i) => (
          <tr key={item._id}>
            <td>{item.fileName}</td>

            <td>{item.extensionName}</td>
            <td>
              {item.dateCreated.substring(0, item.dateCreated.indexOf("T"))}
            </td>
            <td>
              <button
                type="button"
                className="btn btn-danger ml-2"
                onClick={() => deleteUser(item._id)}
              >
                <i className="fa fa-archive"></i>
              </button>
            </td>
          </tr>
        ));
    }
  };

  const PrintContainer = () => {
    return (
      <table className="table mb-0 table-hover table-bordered text-center title-table">
        <thead className="table-dark">
          <tr>
            <th>FileName</th>
            <th>Extension</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        {logs
          .sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated))
          .map((item, i) => (
            <tr key={item._id}>
              <td>{item.fileName}</td>
            </tr>
          ))}
      </table>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <Sidebar />
        <div className="col py-3 content-area">
          <h5>Search</h5>
          <div className="container-fluid search-container">
            <div className="row p-1">
              <div className="col-md-6 p-2">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Search User"
                  name="email"
                />
              </div>

              <div className="col-md-3 text-center p-2">
                <Link
                  type="button"
                  className="btn btn-success w-100"
                  to="/admin/printfiles"
                >
                  <i className="fs-5 fa fa-print"></i>
                  <span className="ms-3  d-sm-inline">Print Lists</span>
                </Link>
              </div>

              <div className="col-md-3  text-center p-2">
                <button type="button" className="btn btn-success w-100">
                  <span className="d-sm-inline">Search</span>
                </button>
              </div>
            </div>
          </div>
          {emailExists === true ? (
            <AlertBox />
          ) : successUpdate != "" ? (
            <AlertBox />
          ) : null}
          <div className="container-fluid for-sort">
            <div className="row">
              <div className="col-md-12">
                <span>List of Files</span>
                <select
                  className="form-select form-select-sm w-25 float-sm-end"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="name">Sort by name</option>
                  <option value="date">Sort by date</option>
                  <option value="extension">Sort by extension</option>
                </select>
              </div>
            </div>
          </div>

          <div className="container-fluid border for-table-users">
            <table className="table mb-0 table-hover table-bordered text-center title-table">
              <thead className="table-dark">
                <tr>
                  <th>FileName</th>
                  <th>Extension</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <DisplayFiles />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFiles;

import "./global.css";
import Sidebar from "../imports/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [emailExists, setExists] = useState(false);
  const [modalEdit, setVisibleEdit] = useState(false);

  const [successUpdate, setSuccessUpdate] = useState("");

  const [sort, setSort] = useState("name");

  const [render, setRender] = useState(1);
  useEffect(() => {
    document.title = "Manage Logs";
    getLogs();
  }, []);

  const getLogs = () => {
    axios.get("/logs/read-logs").then((res) => setLogs(res.data));
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

  const DisplayUsers = () => {
    if (sort === "date") {
      return logs
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((item, i) => (
          <tr key={item._id}>
            <td>{item.username}</td>
            <td>{item.action}</td>
            <td>{item.date.substring(0, item.date.indexOf("T"))}</td>
          </tr>
        ));
    } else if (sort === "name") {
      return logs
        .sort((a, b) => (a.username > b.username ? 1 : -1))
        .map((item, i) => (
          <tr key={item._id}>
            <td>{item.username}</td>
            <td>{item.action}</td>
            <td>{item.date.substring(0, item.date.indexOf("T"))}</td>
          </tr>
        ));
    } else if (sort === "action") {
      return logs
        .sort((a, b) => (a.action > b.action ? 1 : -1))
        .map((item, i) => (
          <tr key={item._id}>
            <td>{item.username}</td>
            <td>{item.action}</td>
            <td>{item.date.substring(0, item.date.indexOf("T"))}</td>
          </tr>
        ));
    }
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
                  to="/admin/printlogs"
                >
                  <i className="fs-5 fa fa-print"></i>
                  <span className="ms-3  d-sm-inline">Print Logs</span>
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
                <span>Logs</span>
                <select
                  className="form-select form-select-sm w-25 float-sm-end"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="name">Sort by name</option>
                  <option value="date">Sort by date</option>
                  <option value="action">Sort by action</option>
                </select>
              </div>
            </div>
          </div>

          <div className="container-fluid border for-table-users">
            <table className="table mb-0 table-hover table-bordered text-center title-table">
              <thead className="table-dark">
                <tr>
                  <th>Username</th>
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
      </div>
      <Modal show={visible} onHide={() => setVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formSubmit}>
            <h6>Username: </h6>
            <Form.Control
              type={"text"}
              name={"username"}
              className={"mb-2"}
              value={values.username}
              onChange={handleInputs}
            />

            <h6>Email: </h6>
            <Form.Control
              type={"text"}
              className={"mb-2"}
              name={"email"}
              value={values.email}
              onChange={handleInputs}
            />
            <h6>Role: </h6>
            <Form.Select
              className={"mb-2"}
              value={values.role}
              name={"role"}
              onChange={handleInputs}
            >
              <option>Select the role</option>
              <option value="Accreditors">Accreditors</option>
              <option value="Faculty">Faculty</option>
            </Form.Select>

            {values.role === "Faculty" ? (
              <div>
                <h6>Assign Area: </h6>
                <Form.Select
                  className={"mb-2"}
                  value={values.area}
                  name={"area"}
                  onChange={handleInputs}
                >
                  <option value="Area 1">Area 1</option>
                  <option value="Area 2">Area 2</option>
                  <option value="Area 3">Area 3</option>
                  <option value="Area 4">Area 4</option>
                  <option value="Area 5">Area 5</option>
                  <option value="Area 6">Area 6</option>
                  <option value="Area 7">Area 7</option>
                  <option value="Area 8">Area 8</option>
                  <option value="Area 9">Area 9</option>
                  <option value="Area 10">Area 10</option>
                </Form.Select>
              </div>
            ) : (
              ""
            )}

            <h6>Password: </h6>
            <Form.Control type={"text"} className={"mb-2"} />

            <h6>Confirm Password: </h6>
            <Form.Control
              type={"text"}
              className={"mb-2"}
              name={"password"}
              value={values.password}
              onChange={handleInputs}
            />

            <Button
              variant="primary"
              type="submit"
              onClick={() => setVisible(false)}
              className="mt-2 w-100"
            >
              Add New User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal for editing */}
      <Modal show={modalEdit} onHide={() => setVisibleEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formEditSubmit}>
            <h6>Username: </h6>
            <Form.Control
              type={"text"}
              name={"username"}
              className={"mb-2"}
              value={editValues.username}
              onChange={handleEditInputs}
            />

            <h6>Email: </h6>
            <Form.Control
              type={"text"}
              className={"mb-2"}
              name={"email"}
              value={editValues.email}
              onChange={handleEditInputs}
              disabled={true}
            />
            <h6>Role: </h6>
            <Form.Select
              className={"mb-2"}
              value={editValues.role}
              name={"role"}
              onChange={handleEditInputs}
            >
              <option>Select the role</option>
              <option value="Accreditors">Accreditors</option>
              <option value="Faculty">Faculty</option>
            </Form.Select>

            {editValues.role === "Faculty" ? (
              <div>
                <h6>Assign Area: </h6>
                <Form.Select
                  className={"mb-2"}
                  value={editValues.area}
                  name={"area"}
                  onChange={handleEditInputs}
                >
                  <option value="Area 1">Area 1</option>
                  <option value="Area 2">Area 2</option>
                  <option value="Area 3">Area 3</option>
                  <option value="Area 4">Area 4</option>
                  <option value="Area 5">Area 5</option>
                  <option value="Area 6">Area 6</option>
                  <option value="Area 7">Area 7</option>
                  <option value="Area 8">Area 8</option>
                  <option value="Area 9">Area 9</option>
                  <option value="Area 10">Area 10</option>
                </Form.Select>
              </div>
            ) : (
              ""
            )}

            <h6>Password: </h6>
            <Form.Control
              type={"text"}
              className={"mb-2"}
              name={"password"}
              value={editValues.password}
              onChange={handleEditInputs}
            />

            {editValues.password.length > 8 ? (
              <div>
                <h6>Confirm Password: </h6>
                <Form.Control type={"text"} className={"mb-2"} />
              </div>
            ) : (
              ""
            )}

            <Button
              variant="primary"
              type="submit"
              onClick={() => setVisibleEdit(false)}
              className="mt-2 w-100"
            >
              Update User
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminLogs;

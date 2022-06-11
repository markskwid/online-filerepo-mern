import "./global.css";
import Sidebar from "../imports/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import AddUser from "./addUser_modal";

const User = () => {
  const [users, setUsers] = useState([]);
  const [emailExists, setExists] = useState(false);
  const [modalEdit, setVisibleEdit] = useState(false);

  const [successUpdate, setSuccessUpdate] = useState("");
  const [sort, setSort] = useState("name");

  const [deleteModal, setDelete] = useState(false);
  const [uid, setUID] = useState("");

  const [visible, setVisible] = useState(false);
  const [render, setRender] = useState(1);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPass, setConPass] = useState("");

  const [success, setSuccess] = useState("");

  const [searchVal, setSearchVal] = useState("");
  const [search, setSearch] = useState(false);

  useEffect(() => {
    document.title = "Manage Users";
    getUsers();
  }, [render, visible, success, successUpdate]);

  const getUsers = async () => {
    const res = await axios.get("/manage-user/read");
    setUsers(res.data);
  };

  const togglePassword = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [values, setValues] = useState({
    username: "",
    email: "",
    role: "",
    area: "",
    password: "",
    fullname: "",
  });

  const [editValues, setEditValues] = useState({
    id: "",
    username: "",
    email: "",
    role: "",
    area: "",
    password: "",
    fullname: "",
  });

  const handleInputs = (e) => {
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
      <div className="alert alert-success alert-dismissible w-100 mx-auto fade show alert-box">
        <button
          type="button"
          className="btn-close"
          onClick={() => setSuccess("")}
        ></button>
        <strong>User successfully deleted!</strong>
      </div>
    );
  };

  const AlertBoxEdit = () => {
    return (
      <div className="alert alert-success alert-dismissible w-100 mx-auto fade show alert-box">
        <button
          type="button"
          className="btn-close"
          onClick={() => setSuccessUpdate("")}
        ></button>
        <strong>User successfully edited!</strong>
      </div>
    );
  };

  const toggleModal = () => {
    setVisible(!visible);
    console.log("yup");
  };

  const deleteUser = () => {
    axios
      .delete("/manage-user/delete/" + uid)
      .then((res) => setSuccess(res.data));
  };

  const formSubmit = (e) => {
    e.preventDefault();
    axios.post("/manage-user/add", values).then((res) => {
      setSuccess(res.data);
    });
  };

  const refresh = () => {
    setRender(render + 1);
  };

  const formEditSubmit = (e) => {
    e.preventDefault();
    axios
      .put("/manage-user/update/" + editValues.id, editValues)
      .then((res) => {
        setSuccessUpdate(res.data);
        setConPass("");
      });
  };

  const SearchUser = () => {
    return users
      .some((e) => e.fullname === searchVal)
      .map((item) => {
        <tr key={item._id}>
          {item.role !== "Admin" && (
            <>
              <td>{item.fullname}</td>
              <td>{item.username}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td>{item.area === "" ? "None" : item.area}</td>
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
                      fullname: item.fullname,
                    })
                  }
                >
                  <i className="fa fa-edit"></i>
                </button>{" "}
                <button
                  type="button"
                  className="btn btn-danger ml-2"
                  onClick={() => setUID(item._id) || setDelete(true)}
                >
                  <i className="fa fa-archive"></i>
                </button>
              </td>
            </>
          )}
        </tr>;
      });
  };

  const DisplayUsers = () => {
    if (sort === "name") {
      return users
        .sort((a, b) => (a.fullname > b.fullname ? 1 : -1))
        .map((item, i) => (
          <tr key={i}>
            {item.role !== "Admin" && (
              <>
                <td>{item.fullname}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.area === "" ? "None" : item.area}</td>
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
                        fullname: item.fullname,
                      })
                    }
                  >
                    <i className="fa fa-edit"></i>
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-danger ml-2"
                    onClick={() => setUID(item._id) || setDelete(true)}
                  >
                    <i className="fa fa-archive"></i>
                  </button>
                </td>
              </>
            )}
          </tr>
        ));
    } else if (sort === "role") {
      return users
        .sort((a, b) => (a.role > b.role ? 1 : -1))
        .map((item, i) => (
          <tr key={i}>
            {item.role !== "Admin" && (
              <>
                <td>{item.fullname}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.area === "" ? "None" : item.area}</td>
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
                        fullname: item.fullname,
                      })
                    }
                  >
                    <i className="fa fa-edit"></i>
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-danger ml-2"
                    onClick={() => setUID(item._id) || setDelete(true)}
                  >
                    <i className="fa fa-archive"></i>
                  </button>
                </td>
              </>
            )}
          </tr>
        ));
    } else if (sort === "email") {
      return users
        .sort((a, b) => (a.email > b.email ? 1 : -1))
        .map((item, i) => (
          <tr key={i}>
            {item.role !== "Admin" && (
              <>
                <td>{item.fullname}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.area === "" ? "None" : item.area}</td>
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
                        fullname: item.fullname,
                      })
                    }
                  >
                    <i className="fa fa-edit"></i>
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-danger ml-2"
                    onClick={() => setUID(item._id) || setDelete(true)}
                  >
                    <i className="fa fa-archive"></i>
                  </button>
                </td>
              </>
            )}
          </tr>
        ));
    } else if (sort === "username") {
      return users
        .sort((a, b) => (a.username > b.username ? 1 : -1))
        .map((item, i) => (
          <tr key={i}>
            {item.role !== "Admin" && (
              <>
                <td>{item.fullname}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.role}</td>
                <td>{item.area === "" ? "None" : item.area}</td>
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
                        fullname: item.fullname,
                      })
                    }
                  >
                    <i className="fa fa-edit"></i>
                  </button>{" "}
                  <button
                    type="button"
                    className="btn btn-danger ml-2"
                    onClick={() => setUID(item._id) || setDelete(true)}
                  >
                    <i className="fa fa-archive"></i>
                  </button>
                </td>
              </>
            )}
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
                  type="text"
                  className="form-control"
                  id="email"
                  placeholder="Search User"
                />
              </div>

              <div className="col-md-3 text-center p-2">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={() => setVisible(true)}
                >
                  <i className="fs-5 fa fa-user-plus"></i>
                  <span className="ms-3  d-sm-inline">Add User</span>
                </button>
              </div>

              <div className="col-md-3  text-center p-2">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={() => setSearch(true)}
                >
                  <span className="d-sm-inline">Search</span>
                </button>
              </div>
            </div>
          </div>
          {success !== "" && <AlertBox />}
          <div className="container-fluid for-sort">
            <div className="row">
              <div className="col-md-12">
                <span>List of Members</span>
                <select
                  className="form-select form-select-sm w-25 float-sm-end"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="name">Sort by name</option>
                  <option value="username">Sort by username</option>
                  <option value="role">Sort by role</option>
                  <option value="email">Sort by email</option>
                </select>
              </div>
            </div>
          </div>

          <div className="container-fluid border for-table-users">
            <table className="table mb-0 table-hover text-center table-bordered">
              <thead className="table-dark">
                <tr>
                  <th>FullName</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Assigned Area</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <DisplayUsers />
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <AddUser isOpen={visible} toggle={toggleModal} isSuccess={refresh} />

      {/* Modal for editing */}
      <Modal show={modalEdit}>
        <Modal.Header>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form autoComplete="off" onSubmit={formEditSubmit}>
            <div className="input-group mt-1 mb-2">
              <span className="input-group-text">
                <span className="fa fa-user-circle" />
              </span>
              <input
                type="text"
                className="form-control"
                name="fullname"
                placeholder="Full Name"
                value={editValues.fullname}
                onChange={handleInputs}
              />
            </div>

            <div className="input-group mt-1 mb-2">
              <span className="input-group-text">
                <span className="fa fa-envelope" />
              </span>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Email Address"
                value={editValues.email}
                onChange={handleInputs}
              />
            </div>

            <div className="input-group mt-1 mb-2">
              <span className="input-group-text">
                <span className="fa fa-address-book" />
              </span>
              <input
                type="text"
                className="form-control"
                name="username"
                placeholder="Username"
                value={editValues.username}
                onChange={handleInputs}
              />
            </div>

            <div className="input-group mt-1 mb-2">
              <span className="input-group-text">
                <span className="fa fa-group" />
              </span>
              <Form.Select
                name="role"
                value={editValues.role}
                onChange={handleInputs}
              >
                <option>Select the role</option>
                <option value="Accreditors">Accreditors</option>
                <option value="Faculty">Faculty</option>
              </Form.Select>
            </div>

            {editValues.role === "Faculty" && (
              <div className="input-group mt-1 mb-2">
                <span className="input-group-text">
                  <span className="fa fa-cogs" />
                </span>
                <Form.Select
                  name="area"
                  value={editValues.area}
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
            )}

            <div className="input-group mt-1 mb-2">
              <span className="input-group-text">
                <span
                  className={passwordVisible ? "fa fa-eye" : "fa fa-eye-slash"}
                  onClick={() => togglePassword()}
                />
              </span>
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                name="password"
                value={editValues.password}
                onChange={handleInputs}
              />
            </div>

            {editValues.password.length > 8 && (
              <div className="input-group mt-1 mb-3">
                <span className="input-group-text">
                  <span
                    className={
                      passwordVisible ? "fa fa-eye" : "fa fa-eye-slash"
                    }
                    onClick={() => togglePassword()}
                  />
                </span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  className={
                    editValues.password !== confirmPass
                      ? "form-control border-danger"
                      : "form-control"
                  }
                  placeholder="Confirm Password"
                  value={confirmPass}
                  onChange={(e) => setConPass(e.target.value)}
                />
              </div>
            )}
            {successUpdate !== "" && <AlertBoxEdit />}
            <Button variant="success w-100 mb-2" type="submit">
              Update User
            </Button>
          </Form>
          <Button variant="danger w-100" onClick={() => setVisibleEdit(false)}>
            Close
          </Button>
        </Modal.Body>
      </Modal>

      <Modal
        show={deleteModal}
        backdrop="static"
        keyboard={false}
        centered
        className="modal-logout"
      >
        <i class="display-1 fa fa-archive text-danger"></i>
        <Modal.Title>Are you sure you want to delete?</Modal.Title>
        <Modal.Body>
          <div className="btn-group w-100 mt-2 btn-group-md">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setDelete(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => deleteUser() || setDelete(false)}
            >
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default User;

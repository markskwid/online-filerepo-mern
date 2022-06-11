import { useState } from "react";
import "./global.css";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const AddUser = (props) => {
  const [visible, setVisible] = useState(false);

  const [values, setValues] = useState({
    fullname: "",
    username: "",
    email: "",
    role: "",
    area: "",
    password: "",
  });

  const [success, setSuccess] = useState("");

  const [confirmPass, setConPass] = useState("");

  const handleInputs = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const togglePassword = () => {
    setVisible(!visible);
  };

  const formSubmit = (e) => {
    e.preventDefault();
    axios.post("/manage-user/add", values).then((res) => {
      if (res.data === "success") {
        setSuccess(res.data);
        setValues({
          fullname: "",
          username: "",
          email: "",
          role: "",
          area: "",
          password: "",
        });
      } else {
        setSuccess(res.data);
      }
    });
  };

  const AlertBox = () => {
    if (success === "success") {
      return (
        <div className="alert alert-success alert-dismissible w-100 mx-auto fade show alert-box">
          <strong>New user added!</strong>
        </div>
      );
    } else {
      return (
        <div className="alert alert-danger alert-dismissible w-100 mx-auto fade show alert-box">
          <strong>
            {success === "email"
              ? "Email already used!"
              : "Username already used!"}
          </strong>
        </div>
      );
    }
  };

  return (
    <Modal show={props.isOpen}>
      <Modal.Header>
        <Modal.Title>Add User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form autoComplete="off" onSubmit={formSubmit}>
          <div className="input-group mt-1 mb-2">
            <span className="input-group-text">
              <span className="fa fa-user-circle" />
            </span>
            <input
              type="text"
              className="form-control"
              name="fullname"
              placeholder="Full Name"
              value={values.fullname}
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
              value={values.email}
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
              value={values.username}
              onChange={handleInputs}
            />
          </div>

          <div className="input-group mt-1 mb-2">
            <span className="input-group-text">
              <span className="fa fa-group" />
            </span>
            <Form.Select
              name="role"
              value={values.role}
              onChange={handleInputs}
            >
              <option>Select the role</option>
              <option value="Accreditors">Accreditors</option>
              <option value="Faculty">Faculty</option>
            </Form.Select>
          </div>

          {values.role === "Faculty" && (
            <div className="input-group mt-1 mb-2">
              <span className="input-group-text">
                <span className="fa fa-cogs" />
              </span>
              <Form.Select
                name="area"
                value={values.area}
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
                className={visible ? "fa fa-eye" : "fa fa-eye-slash"}
                onClick={() => togglePassword()}
              />
            </span>
            <input
              type={visible ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              name="password"
              value={values.password}
              onChange={handleInputs}
            />
          </div>

          {values.password.length > 8 && (
            <div className="input-group mt-1 mb-3">
              <span className="input-group-text">
                <span
                  className={visible ? "fa fa-eye" : "fa fa-eye-slash"}
                  onClick={() => togglePassword()}
                />
              </span>
              <input
                type={visible ? "text" : "password"}
                className={
                  values.password !== confirmPass
                    ? "form-control border-danger"
                    : "form-control"
                }
                placeholder="Confirm Password"
                value={confirmPass}
                onChange={(e) => setConPass(e.target.value)}
              />
            </div>
          )}

          {success !== "" && <AlertBox />}
          <Button variant="success w-100 mb-2" type="submit">
            Add new user
          </Button>
        </Form>
        <Button variant="danger w-100" onClick={props.toggle}>
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default AddUser;

import "./global.css";
import { Form, Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import DeleteAccount from "../imports/delete_modal";

const EditProfileModal = (props) => {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [link, setLink] = useState("");
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [confirmPass, setConPass] = useState("");
  const [uid, setUID] = useState("");
  useEffect(() => {
    getUserData();
  }, []);

  const [values, setValues] = useState({
    fullname: "",
    username: "",
    email: "",
    role: "",
    area: "",
    password: "",
  });

  const getUserData = () => {
    axios.get("/manage-user/get-info").then((res) => {
      setValues({
        username: res.data.username,
        role: res.data.role,
        area: res.data.area,
        fullname: res.data.fullname,
        password: res.data.password,
        email: res.data.email,
      });

      setUID(res.data.id);
    });
  };

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
    axios
      .put("/manage-user/update/" + uid, values)
      .then((res) => console.log(res));
  };

  const toggleDeleteModal = () => {
    setVisibleDelete(!visibleDelete);
  };

  return (
    <Modal show={props.isOpen}>
      <Modal.Header>
        <Modal.Title>Edit Profile</Modal.Title>
        <button
          className="btn btn-danger"
          data-bs-toggle="tooltip"
          title="Delete My Account"
          onClick={toggleDeleteModal}
        >
          <span className="fa fa-trash" />
        </button>
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
              disabled
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
          <Button
            variant="success w-100 mb-2"
            type="submit"
            disabled={values.password !== confirmPass}
          >
            Update Profile
          </Button>
        </Form>
        <Button variant="danger w-100" onClick={props.toggle}>
          Close
        </Button>
      </Modal.Body>
      <DeleteAccount
        isOpen={visibleDelete}
        toggle={toggleDeleteModal}
        userID={uid}
      />
    </Modal>
  );
};

export default EditProfileModal;

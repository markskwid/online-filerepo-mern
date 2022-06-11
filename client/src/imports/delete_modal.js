import "./styles.css";
import { Form, Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeleteAccount = (props) => {
  const navigate = useNavigate();
  const deleteUser = () => {
    axios.delete("/manage-user/delete/" + props.userID).then((res) => {
      if (res.data === "deleted") {
        navigate("/login");
      }
    });
  };
  return (
    <Modal
      show={props.isOpen}
      backdrop="static"
      keyboard={false}
      className="modal-logout"
    >
      <i class="display-1 fa fa-trash text-danger"></i>
      <Modal.Title>Do you want to delete your account?</Modal.Title>
      <Modal.Body>
        <div className="btn-group w-100 mt-2 btn-group-md">
          <button type="button" className="btn btn-primary"   onClick={props.toggle}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={deleteUser}
          >
            Delete
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteAccount;

import "./styles.css";
import { Form, Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Logout = (props) => {
  return (
    <Modal show={props.isOpen} backdrop="static" keyboard={false} centered className="modal-logout">
      <i class="display-1 fa fa-question text-danger"></i>
      <Modal.Title>Do you want to sign out?</Modal.Title>
      <Modal.Body>
        <div className="btn-group w-100 mt-2 btn-group-md">
          <Link to={props.userRole === "Admin" ? "/admin" : "/login"} type="button" className="btn btn-primary">
            Logout
          </Link>
          <button
            type="button"
            className="btn btn-danger"
            onClick={props.toggle}
          >
            Cancel
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Logout;

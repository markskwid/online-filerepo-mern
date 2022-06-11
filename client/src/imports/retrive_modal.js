import "./styles.css";
import { Form, Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Retrieve = (props) => {
  const [area, setArea] = useState("");
  const [success, setSuccess] = useState("");
  const retriveFile = () => {
    axios
      .post("/api/retrieve-file", {
        fileName: props.fileName,
        area: area,
      })
      .then((res) => {
        setSuccess(res.data);
      });
  };

  const AlertBoxEdit = () => {
    if (success === "success") {
      return (
        <div className="alert alert-success alert-dismissible w-100 mx-auto fade show alert-box">
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
          <strong>Success! Open the area and see it.</strong>
        </div>
      );
    } else {
      return (
        <div className="alert alert-danger alert-dismissible w-100 mx-auto fade show alert-box">
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess("")}
          ></button>
          <strong>Failed to retrieve. Try again...</strong>
        </div>
      );
    }
  };

  return (
    <Modal
      show={props.isOpen}
      backdrop="static"
      keyboard={false}
      centered
      className="modal-retrieve"
    >
      <Modal.Body>
        <Modal.Title>Choose area:</Modal.Title>
        <Form autoComplete="off" onSubmit={retriveFile}>
          <Form.Select
            name="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
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
          <button className="btn btn-primary w-100 mt-3" type="submit">
            Confirm
          </button>
        </Form>
        <button
          type="button"
          className="btn btn-danger w-100 mt-1 mb-2"
          onClick={props.toggle}
        >
          Cancel
        </button>
        {success !== "" && <AlertBoxEdit />}
      </Modal.Body>
    </Modal>
  );
};

export default Retrieve;

import "./global.css";
import { Form, Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

const RenameModal = (props) => {
  const [name, setName] = useState("");

  const oldDir = props.oldName.slice(0, props.oldName.lastIndexOf("/"));
  const [success, setSuccess] = useState("");
  const formSubmit = (e) => {
    e.preventDefault();
    let filename = props.oldName.slice(0 + props.oldName.lastIndexOf("/"));
    let ext = filename.split(".").pop();
    let type = ext === filename ? "folder" : "file";

    if (type === "folder") {
      console.log("Old Dir: " + props.oldName);
      console.log("New Dir: " + oldDir + "/" + name);

      axios
        .post("/api/rename", {
          oldName: props.oldName,
          newName: oldDir + "/" + name,
        })
        .then((res) => {
          if (res.data === "success rename") {
            setSuccess(res.data);
            setName("");
          } else {
            setSuccess(res.data);
            setName("");
          }
        });
    } else {
      console.log("Old Dir: " + props.oldName);
      console.log("New Dir: " + oldDir + "/" + name + "." + ext);

      axios
        .post("/api/rename", {
          oldName: props.oldName,
          newName: oldDir + "/" + name + "." + ext,
        })
        .then((res) => {
          if (res.data === "success rename") {
            setSuccess(res.data);
            setName("");
          } else {
            setSuccess(res.data);
            setName("");
          }
        });
    }
  };

  const AlertBox = () => {
    if (success === "success rename") {
      return (
        <div className="alert alert-success alert-dismissible w-100 mx-auto mt-2 fade show alert-box">
          <strong>Successfully renamed the file!</strong>
        </div>
      );
    } else {
      return (
        <div className="alert alert-danger alert-dismissible w-100 mx-auto mt-2 fade show alert-box">
          <strong>Failed to rename the file</strong>
        </div>
      );
    }
  };

  return (
    <Modal show={props.isOpen}>
      <Modal.Header>
        <Modal.Title>Rename File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formSubmit}>
          <input
            className={"form-control"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {success !== "" && <AlertBox />}
          <Button variant="primary w-100 mb-2 mt-2" type={"submit"}>
            Update Name
          </Button>
          <Button variant="danger w-100 mb-2" onClick={props.toggle}>
            Close
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameModal;

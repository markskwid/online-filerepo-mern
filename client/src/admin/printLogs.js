import "./global.css";
import Sidebar from "../imports/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const PrintLogs = () => {
  const [logs, setLogs] = useState([]);
  const [emailExists, setExists] = useState(false);
  const [modalEdit, setVisibleEdit] = useState(false);

  const [open, setOpen] = useState(false);

  const [successUpdate, setSuccessUpdate] = useState("");

  const [category, setCategory] = useState("all");

  const [sort, setSort] = useState("name");

  const [render, setRender] = useState(1);
  useEffect(() => {
    document.title = "Print Logs";
    getLogs();
  }, []);

  const getLogs = () => {
    axios.get("/logs/read-logs").then((res) => setLogs(res.data));
  };

  const printData = () => {
    window.print();
  };

  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var d = new Date();
  var monthName = d.getMonth() + " " + d.getDate() + ", " + d.getFullYear();
  var month = d.getMonth() + 1;

  var today = d.getFullYear() + "-" + d.getDate() + "-0" + month;

  const DisplayLogs = () => {
    if (category === "all") {
      return (
        <tbody>
          {logs.map((items) => (
            <tr key={items._id}>
              <td>{items.username}</td>
              <td>{items.action}</td>
              <td>{items.date.substring(0, items.date.indexOf("T"))}</td>
            </tr>
          ))}
        </tbody>
      );
    } else if (category === "today") {
      return (
        <tbody>
          {logs.map((i) => (
            <tr key={i._id}>
              {i.date.substring(0, i.date.indexOf("T")) === today ? (
                <>
                  <td>{i.username}</td>
                  <td>{i.action}</td>
                  <td>{i.date.substring(0, i.date.indexOf("T"))}</td>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      );
    } else {
      return (
        <tbody>
          {logs.map((items) => (
            <tr key={items._id}>
              {items.action.includes(category) && (
                <>
                  <td>{items.username}</td>
                  <td>{items.action}</td>
                  <td>{items.date.substring(0, items.date.indexOf("T"))}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      );
    }
  };

  const DisplayUsers = () => {
    if (category === "all") {
      return (
        <tbody>
          {logs.map((i) => (
            <tr key={i._id}>
              <td>{i.username}</td>
              <td>{i.action}</td>
              <td>{i.date.substring(0, i.date.indexOf("T"))}</td>
            </tr>
          ))}
        </tbody>
      );
    } else if (category === "today") {
      return (
        <tbody>
          {logs.map((i) => (
            <tr key={i._id}>
              {i.date.substring(0, i.date.indexOf("T")) === today ? (
                <>
                  <td>{i.username}</td>
                  <td>{i.action}</td>
                  <td>{i.date.substring(0, i.date.indexOf("T"))}</td>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      );
    } else if (category === "date") {
      return (
        <tbody>
          {logs
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((items, item) => (
              <tr key={items._id}>
                <td>{items.username}</td>
                <td>{items.action}</td>
                <td>{items.date.substring(0, items.date.indexOf("T"))}</td>
              </tr>
            ))}
        </tbody>
      );
    } else if (category === "name") {
      return (
        <tbody>
          {logs
            .sort((a, b) => (a.username > b.username ? 1 : -1))
            .map((items, item) => (
              <tr key={items._id}>
                <td>{items.username}</td>
                <td>{items.action}</td>
                <td>{items.date.substring(0, items.date.indexOf("T"))}</td>
              </tr>
            ))}
        </tbody>
      );
    } else if (category === "area 1") {
      return (
        <tbody>
          {logs.map((items) => (
            <tr key={items._id}>
              {items.action.includes("Area 1") && (
                <>
                  <td>{items.username}</td>
                  <td>{items.action}</td>
                  <td>{items.date.substring(0, items.date.indexOf("T"))}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      );
    }
  };

  return (
    <div className="container-fluid">
      <div className="col-md-6 mx-auto mt-2 table-container ">
        <div className="container-fluid button-print-container">
          <div className="row">
            <Form.Select
              name="role"
              className="w-50"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">----SELECT----</option>
              <option value="today">Only Today</option>
              <option value="Area 1">Only in Area 1</option>
              <option value="Area 2">Only in Area 2</option>
              <option value="Area 3">Only in Area 3</option>
              <option value="Area 4">Only in Area 4</option>
              <option value="Area 5">Only in Area 5</option>
              <option value="Area 6">Only in Area 6</option>
              <option value="Area 7">Only in Area 7</option>
              <option value="Area 8">Only in Area 8</option>
              <option value="Area 9">Only in Area 9</option>
              <option value="Area 10">Only in Area 10</option>
            </Form.Select>

            <button
              className="btn btn-secondary w-25 print-btn"
              onClick={() => printData()}
            >
              <span className="fa fa-print me-2"></span>
              Print
            </button>
          </div>
        </div>
        <div className="container-fluid text-center p-2 table-head">
          <h1>File Repository</h1>
          <h5>{category === "all" ? "All Logs" : "Logs Today"}</h5>
        </div>
        <table className="table table-hover text-center title-table">
          <thead className="table-dark thead-table">
            <tr>
              <th>Username</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <DisplayLogs />
        </table>

        <div className="container-fluid fixed-bottom footer">{today}</div>
      </div>

      {/* <Modal
        show={open}
        backdrop="static"
        keyboard={false}
        centered
        className="text-center hide-modal"
      >
        <i class="display-1 fa fa-question text-danger"></i>
        <Modal.Title>Choose what to print</Modal.Title>
        <Modal.Body>
          <button
            type="button"
            className="btn btn-primary w-100"
            onClick={() => setCategory("today") || setOpen(false)}
          >
            Only Today
          </button>

          <button
            type="button"
            className="btn btn-primary w-100 mt-2 mb-2"
            onClick={() => setCategory("all")}
          >
            All Data
          </button>

          <button
            type="button"
            className="btn btn-primary w-100 mt-2 mb-2"
            onClick={() => setOpen(false)}
          >
            All Data
          </button>
        </Modal.Body>
      </Modal> */}
    </div>
  );
};

export default PrintLogs;

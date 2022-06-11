import "./global.css";
import Sidebar from "../imports/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const PrintFiles = () => {
  const [logs, setLogs] = useState([]);
  const [emailExists, setExists] = useState(false);
  const [modalEdit, setVisibleEdit] = useState(false);

  const [open, setOpen] = useState(false);

  const [successUpdate, setSuccessUpdate] = useState("");

  const [category, setCategory] = useState("all");

  const [sort, setSort] = useState("name");

  const [render, setRender] = useState(1);
  useEffect(() => {
    document.title = "Print Files";
    getLogs();
  }, []);

  const getLogs = () => {
    axios.get("/api/read").then((res) => setLogs(res.data));
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

  const DisplayUsers = () => {
    if (category === "all") {
      return (
        <tbody>
          {logs.map((i) => (
            <tr key={i._id}>
              <td>{i.fileName}</td>
            </tr>
          ))}
        </tbody>
      );
    } else if (category === "today") {
      return (
        <tbody>
          {logs.map((i) => (
            <tr key={i._id}>
              {i.dateCreated.substring(0, i.dateCreated.indexOf("T")) ===
              "2022-05-21" ? (
                <td>{i.fileName}</td>
              ) : null}
            </tr>
          ))}
        </tbody>
      );
    }
  };

  const DisplayFiles = () => {
    if (category === "all") {
      return (
        <tbody>
          {logs.map((items) => (
            <tr key={items._id}>
              <td>{items.fileName}</td>
            </tr>
          ))}
        </tbody>
      );
    } else {
      return (
        <tbody>
          {logs.map((items) => (
            <tr key={items._id}>
              {items.belongsTo.includes(category) && (
                <>
                  <td>{items.fileName}</td>
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
          <h5>Summary of Files</h5>
        </div>
        <table className="table table-hover text-center title-table">
          <DisplayFiles />
        </table>

        <div className="container-fluid fixed-bottom footer">{today}</div>
      </div>

    </div>
  );
};

export default PrintFiles;

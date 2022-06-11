import "./global.css";
import Sidebar from "../imports/sidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

const ViewHistory = () => {
  const [logs, setLogs] = useState([]);
  const [emailExists, setExists] = useState(false);
  const [modalEdit, setVisibleEdit] = useState(false);

  const [successUpdate, setSuccessUpdate] = useState("");

  const [sort, setSort] = useState("name");

  const [userArea, setArea] = useState("");

  const [render, setRender] = useState(1);
  useEffect(() => {
    document.title = "Area History";
    getLogs();
    getUserData();
  }, []);

  const getLogs = () => {
    axios.get("/logs/read-logs").then((res) => setLogs(res.data));
  };

  const getUserData = () => {
    axios.get("/manage-user/get-info").then((res) => {
      setArea(res.data.area);
    });
  };

  const DisplayUsers = () => {
    if (sort === "date") {
      return logs
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((item, i) => (
          <tr key={item._id}>
            {item.action.includes(userArea) && (
              <>
                <td>{item.username}</td>
                <td>{item.action}</td>
                <td>{item.date.substring(0, item.date.indexOf("T"))}</td>
              </>
            )}
          </tr>
        ));
    } else if (sort === "name") {
      return logs
        .sort((a, b) => (a.username > b.username ? 1 : -1))
        .map((item, i) => (
          <tr key={item._id}>
            {item.action.includes(userArea) && (
              <>
                <td>{item.username}</td>
                <td>{item.action}</td>
                <td>{item.date.substring(0, item.date.indexOf("T"))}</td>
              </>
            )}
          </tr>
        ));
    } else if (sort === "action") {
      return logs
        .sort((a, b) => (a.action > b.action ? 1 : -1))
        .map((item, i) => (
          <tr key={item._id}>
            {item.action.includes(userArea) && (
              <>
                <td>{item.username}</td>
                <td>{item.action}</td>
                <td>{item.date.substring(0, item.date.indexOf("T"))}</td>
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
          <h5>Area History</h5>
          <div className="container-fluid for-sort">
            <div className="row">
              <div className="col-md-12">
                <span>{userArea}</span>
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
    </div>
  );
};

export default ViewHistory;

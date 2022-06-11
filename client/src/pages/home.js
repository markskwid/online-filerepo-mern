import "./global.css";
import Sidebar from "../imports/sidebar";
import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate, Link } from "react-router-dom";
import RenameModal from "./renameModal";
import download from "js-file-download";

const Home = () => {
  const [filev2, setFilev2] = useState([]);

  const [myfile, setmyFile] = useState();
  const [fileName, setFileName] = useState("");
  const [extName, setExtName] = useState("");
  const [currentPath, setPath] = useState("");

  const [alert, setAlert] = useState(null);

  const [showModalFolder, setVisible] = useState(false);
  const [showModalFile, setVisibleFile] = useState(false);
  const [folderName, setFolderName] = useState("");

  const [searchVal, setSearchVal] = useState("");

  const [newName, setNewName] = useState({
    old: "",
    new: "",
    ext: "",
  });

  const [userData, setUserData] = useState({
    id: "",
    username: "",
    role: "",
    area: "",
  });

  const [click, setClick] = useState(false);

  const [renameModal, setRenameModal] = useState(false);

  const [moveFileName, setMoveFile] = useState(null);

  useEffect(() => {
    document.title = "Homepage";

    getName();
    getArea();

    if (currentPath === "") {
      setClick(false);
    }
  }, [currentPath, moveFileName, renameModal, alert]);

  const getName = async () => {
    let res = await axios.get("/manage-user/get-info");
    setUserData({
      username: res.data.username,
      role: res.data.role,
      area: res.data.area,
      id: res.data.id,
    });
  };

  const getArea = async () => {
    if (currentPath === "") {
      const res = await axios.get("/api/get-area");
      setFilev2(res.data);
    } else {
      const res = await axios.post("/api/get-file", {
        folderName: currentPath,
      });
      setFilev2(res.data);
    }
  };

  const fileType = (extension) => {
    const imageType = ["jpg", "jpeg", "png", "gif"];
    const arcType = ["rar", "zip"];
    const txt = ["txt"];

    if (imageType.includes(extension)) {
      return "fa fa-file-picture-o";
    } else if (txt.includes(extension)) {
      return "fa fa-file-text-o";
    } else if (extension === "pdf") {
      return "fa fa-file-pdf-o";
    } else if (extension === "docx" || extension === "doc") {
      return "fa fa-file-word-o";
    } else if (extension === "mp4") {
      return "fa fa-file-movie-o";
    } else if (extension === "pptx") {
      return "fa fa-file-powerpoint-o";
    } else if (extension === "xlsx") {
      return "fa fa-file-excel-o";
    } else {
      return "fa fa-folder-open";
    }
  };

  const insertLog = (action) => {
    axios.post("/logs/create-log", {
      id: userData.id,
      name: userData.username,
      action: action,
    });
  };

  const softDelete = (fullpath, filename) => {
    const area = currentPath.slice(1);
    var get_area = "";
    if (area.includes("/")) {
      get_area = area.slice(0, area.indexOf("/"));
    } else {
      const new_area = area + "/";
      get_area = new_area.slice(0, new_area.indexOf("/"));
    }
    axios
      .post("/api/soft-delete", {
        oldPath: fullpath,
        id: userData.id,
        name: userData.username,
        action: "Deleted the file " + filename + " in " + get_area,
      })
      .then((res) => setAlert(res.data))
      .catch((err) => console.log(err));
  };

  const moveFile = () => {
    if (currentPath.includes(userData.area) || userData.role === "Admin") {
      const index = moveFileName.lastIndexOf("/");
      let sliced = moveFileName.slice(index + 1);
      const area = currentPath.slice(1);
      var get_area = "";
      if (area.includes("/")) {
        get_area = area.slice(0, area.indexOf("/"));
      } else {
        const new_area = area + "/";
        get_area = new_area.slice(0, new_area.indexOf("/"));
      }
      axios
        .post("/api/move", {
          oldDir: moveFileName,
          moveDir: currentPath + "/" + sliced,
          id: userData.id,
          name: userData.username,
          action: "Moved the file " + sliced + " in " + get_area,
        })
        .then((res) => (res.data ? setMoveFile(null) : null));
    } else {
      setMoveFile(null);
      setAlert("area");
    }
  };

  const SearchComponent = () => {
    return (
      <div>
        {filev2
          .filter((name) => name.includes(searchVal))
          .map((item) => (
            <div
              key={item}
              className="d-flex aligns-items-center mb-1 folder-container"
            >
              <i className={fileType(item.split(".").pop())}></i>
              <span className="ms-2">{item}</span>

              <i
                className="fa fa-ellipsis-h ms-auto dropdown-toggle button-more"
                data-bs-toggle="dropdown"
              ></i>
              <ul className="dropdown-menu">
                {fileType(item.split(".").pop()) !== "fa fa-folder-open" && (
                  <li>
                    <Link
                      to="/sample"
                      className="dropdown-item bg-transparent"
                      state={{ fileName: currentPath + "/" + item }}
                    >
                      {" "}
                      View
                    </Link>
                  </li>
                )}

                {fileType(item.split(".").pop()) === "fa fa-folder-open" && (
                  <li>
                    <button
                      className="dropdown-item bg-transparent"
                      onClick={() => setPath(currentPath + "/" + item)}
                    >
                      {" "}
                      Open
                    </button>
                  </li>
                )}

                {userData.role == "Admin" ||
                currentPath.includes(userData.area) ? (
                  <div>
                    <li>
                      <button
                        className="dropdown-item bg-transparent"
                        onClick={() =>
                          setNewName({
                            old: item,
                            ext: item.split(".").pop(),
                          }) || setRenameModal(true)
                        }
                      >
                        Rename
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item bg-transparent"
                        onClick={() => setMoveFile(currentPath + "/" + item)}
                      >
                        {" "}
                        Move
                      </button>
                    </li>

                    <li>
                      <button
                        className="dropdown-item bg-transparent"
                        onClick={() => deleteFolder(item)}
                      >
                        {" "}
                        Remove
                      </button>
                    </li>
                  </div>
                ) : null}

                {fileType(item.split(".").pop()) !== "fa fa-folder-open" && (
                  <li>
                    <button
                      className="dropdown-item bg-transparent"
                      onClick={() => downloadFile(item)}
                    >
                      {" "}
                      Download
                    </button>
                  </li>
                )}
                {/* <li>
              <button
                className="dropdown-item bg-transparent"
                onClick={() => downloadFile(item)}
              >
                {" "}
                Download
              </button>
            </li> */}
              </ul>
            </div>
          ))}
      </div>
    );
  };

  const DisplayTry = () => {
    return filev2
      .sort((a, b) => a.length > b.length)
      .map((item) => (
        <div
          key={item}
          className={
            userData.area === item
              ? "d-flex aligns-items-center mb-1 folder-container-home"
              : "d-flex aligns-items-center mb-1 folder-container"
          }
        >
          <i className={fileType(item.split(".").pop())}></i>
          <span className="ms-2">{item}</span>

          <i
            className="fa fa-ellipsis-h ms-auto dropdown-toggle button-more"
            data-bs-toggle="dropdown"
          ></i>
          <ul className="dropdown-menu">
            {fileType(item.split(".").pop()) !== "fa fa-folder-open" && (
              <li>
                <Link
                  to="/sample"
                  className="dropdown-item bg-transparent"
                  state={{ fileName: currentPath + "/" + item }}
                >
                  {" "}
                  View
                </Link>
              </li>
            )}

            {fileType(item.split(".").pop()) === "fa fa-folder-open" && (
              <li>
                <button
                  className="dropdown-item bg-transparent"
                  onClick={() => setPath(currentPath + "/" + item)}
                >
                  {" "}
                  Open
                </button>
              </li>
            )}

            {userData.role === "Admin" ||
            (userData.role === "Faculty" &&
              currentPath.includes(userData.area)) ? (
              <div>
                <li>
                  <button
                    className="dropdown-item bg-transparent"
                    onClick={() =>
                      setNewName({
                        old: item,
                        ext: item.split(".").pop(),
                      }) || setRenameModal(true)
                    }
                  >
                    Rename
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item bg-transparent"
                    onClick={() => setMoveFile(currentPath + "/" + item)}
                  >
                    {" "}
                    Move
                  </button>
                </li>

                <li>
                  <button
                    className="dropdown-item bg-transparent"
                    onClick={() => softDelete(currentPath + "/" + item, item)}
                  >
                    {" "}
                    Remove
                  </button>
                </li>
              </div>
            ) : null}

            {fileType(item.split(".").pop()) !== "fa fa-folder-open" && (
              <li>
                <button
                  className="dropdown-item bg-transparent"
                  onClick={() => downloadFile(item)}
                >
                  {" "}
                  Download
                </button>
              </li>
            )}
            {/* <li>
              <button
                className="dropdown-item bg-transparent"
                onClick={() => downloadFile(item)}
              >
                {" "}
                Download
              </button>
            </li> */}
          </ul>
        </div>
      ));
  };

  const Areas = () => {
    if (!filev2.length) {
      return (
        <div className="container-fluid text-center px-5">
          <span className="display-1 fa fa-frown-o"></span>
          <h3>This directory is empty</h3>
        </div>
      );
    } else if (searchVal !== "") {
      return <SearchComponent />;
    } else {
      return filev2.map((item) => (
        <div
          key={item}
          className={
            userData.area === item
              ? "d-flex aligns-items-center mb-1 folder-container-home"
              : "d-flex aligns-items-center mb-1 folder-container"
          }
        >
          <i className={fileType(item.split(".").pop())}></i>
          <span className="ms-2">{item}</span>

          <i
            className="fa fa-ellipsis-h ms-auto dropdown-toggle button-more"
            data-bs-toggle="dropdown"
          ></i>
          <ul className="dropdown-menu">
            {fileType(item.split(".").pop()) !== "fa fa-folder-open" && (
              <li>
                <Link
                  to="/sample"
                  className="dropdown-item bg-transparent"
                  state={{ fileName: currentPath + "/" + item }}
                >
                  {" "}
                  View
                </Link>
              </li>
            )}

            {fileType(item.split(".").pop()) === "fa fa-folder-open" && (
              <li>
                <button
                  className="dropdown-item bg-transparent"
                  onClick={() => setPath(currentPath + "/" + item)}
                >
                  {" "}
                  Open
                </button>
              </li>
            )}

            {userData.role === "Admin" ||
            (userData.role === "Faculty" &&
              currentPath.includes(userData.area)) ? (
              <div>
                <li>
                  <button
                    className="dropdown-item bg-transparent"
                    onClick={() =>
                      setNewName({
                        old: item,
                        ext: item.split(".").pop(),
                      }) || setRenameModal(true)
                    }
                  >
                    Rename
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item bg-transparent"
                    onClick={() => setMoveFile(currentPath + "/" + item)}
                  >
                    {" "}
                    Move
                  </button>
                </li>

                <li>
                  <button
                    className="dropdown-item bg-transparent"
                    onClick={() => softDelete(currentPath + "/" + item, item)}
                  >
                    {" "}
                    Remove
                  </button>
                </li>
              </div>
            ) : null}

            {fileType(item.split(".").pop()) !== "fa fa-folder-open" && (
              <li>
                <button
                  className="dropdown-item bg-transparent"
                  onClick={() => downloadFile(item)}
                >
                  {" "}
                  Download
                </button>
              </li>
            )}
            {/* <li>
              <button
                className="dropdown-item bg-transparent"
                onClick={() => downloadFile(item)}
              >
                {" "}
                Download
              </button>
            </li> */}
          </ul>
        </div>
      ));
    }
  };

  const downloadFile = async (fileName) => {
    let cPath = currentPath + "/" + fileName;
    let myfile2 = cPath.replaceAll("/", "$");

    let res = await fetch("/api/download/" + myfile2);
    const blob = await res.blob();

    download(blob, fileName);
  };

  const saveFile = (e) => {
    setmyFile(e.target.files[0]);
    setExtName(e.target.files[0].type);
  };

  const uploadFile = (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("file", myfile);
    data.append("path", currentPath);
    data.append("uid", userData.id);
    data.append("username", userData.username);
    data.append("extension", extName.slice(1 + extName.lastIndexOf("/")));
    data.append("fileName", fileName);
    axios({
      method: "post",
      url: "/api/upload",
      data: data,
      header: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    }).then((res) => setAlert(res.data));
  };

  const uploadFileInfo = () => {
    let params = {
      fileName: fileName,
      extName: extName,
    };

    axios.post("/api/upload-info", params).then((res) => console.log(res.data));
  };

  const deleteFolder = (name) => {
    const area = currentPath.slice(1);
    var get_area = "";
    if (area.includes("/")) {
      get_area = area.slice(0, area.indexOf("/"));
    } else {
      const new_area = area + "/";
      get_area = new_area.slice(0, new_area.indexOf("/"));
    }

    axios
      .post("/api/delete", {
        fileName: currentPath.concat("/" + name),
        id: userData.id,
        name: userData.username,
        action: "Deleted the file " + name + " in " + get_area,
      })
      .then((res) => setAlert(res.data))
      .catch((err) => console.log(err));
  };

  const renameFile = () => {
    axios
      .post("/api/rename", {
        newName,
      })
      .then((res) => console.log(res));
  };

  const handleInputs = (e) => {
    setNewName({
      ...newName,
      [e.target.name]: e.target.value,
    });
  };

  const AlertBox = () => {
    if (alert === "folder created") {
      return (
        <div className="alert alert-success alert-dismissible fade show">
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
          ></button>
          <strong>New Folder Created!</strong>
        </div>
      );
    } else if (alert === "file deleted") {
      return (
        <div className="alert alert-danger alert-dismissible fade show">
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
          ></button>
          <strong>File deleted!</strong>
        </div>
      );
    } else if (alert === "area") {
      return (
        <div className="alert alert-danger alert-dismissible fade show">
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
          ></button>
          <strong>You cannot upload or create folder in this area!</strong>
        </div>
      );
    } else if (alert === "file") {
      return (
        <div className="alert alert-success alert-dismissible fade show">
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
          ></button>
          <strong>Successfully uploaded the file!</strong>
        </div>
      );
    } else if (alert === "accreditors") {
      return (
        <div className="alert alert-danger alert-dismissible fade show">
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert(null)}
          ></button>
          <strong>Your account cannot create or upload file!</strong>
        </div>
      );
    }
  };

  const createFolder = (e) => {
    e.preventDefault();
    if (currentPath.includes(userData.area) || userData.role === "Admin") {
      const area = currentPath.slice(1);
      var get_area = "";
      if (area.includes("/")) {
        get_area = area.slice(0, area.indexOf("/"));
      } else {
        const new_area = area + "/";
        get_area = new_area.slice(0, new_area.indexOf("/"));
      }
      axios
        .post("/api/create", {
          fileName: folderName,
          extName: "folder",
          belongsTo: currentPath + "/" + folderName,
          id: userData.id,
          name: userData.username,
          action: "Created the folder " + folderName + " in " + get_area,
        })
        .then((res) => setAlert(res.data))
        .catch((err) => console.log(err));
    } else {
      setAlert("area");
    }
  };

  const toggleModal = () => {
    setRenameModal(!renameModal);
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
                  id="search"
                  value={searchVal}
                  placeholder="Search Area"
                  name="search"
                  onChange={(e) => setSearchVal(e.target.value)}
                />
              </div>

              <div className="col-md-3 text-center p-2">
                <button
                  type="button"
                  onClick={() => {
                    userData.role !== "Accreditors"
                      ? setVisible(true)
                      : setAlert("accreditors");
                  }}
                  className="btn btn-success w-100 shadow-sm"
                  disabled={currentPath === "" ? true : false}
                >
                  <i className="fs-5 fa fa-folder"></i>
                  <span className="ms-3  d-sm-inline ">Add Folder</span>
                </button>
              </div>

              <div className="col-md-3  text-center p-2">
                <button
                  type="button"
                  className="btn btn-success w-100 shadow-sm"
                  onClick={() => {
                    userData.role !== "Accreditors"
                      ? setVisibleFile(true)
                      : setAlert("accreditors");
                  }}
                  disabled={currentPath === "" ? true : false}
                >
                  <i className="fs-5 fa fa-upload"></i>
                  <span className="ms-3  d-sm-inline ">Upload File</span>
                </button>
              </div>
            </div>
          </div>
          {alert !== null && <AlertBox />}
          <div className="container-fluid for-sort">
            <div className="row">
              <div className="col-md-12">
                <span
                  className="border-bottom border-dark back-label"
                  onClick={() =>
                    setPath(currentPath.slice(0, currentPath.lastIndexOf("/")))
                  }
                >
                  Back
                </span>
                <span>{currentPath}</span>
                {/* <select className="form-select form-select-sm w-25 float-sm-end">
                  <option>Sort by name</option>
                  <option>Sort by date</option>
                  <option>Sort by type</option>
                </select> */}

                {moveFileName === null ? null : (
                  // <button
                  //   className="btn btn-primary btn-sm float-sm-end"
                  //   onClick={() => moveFile(moveFileName)}
                  // >
                  //   <span className={"fa fa-paste"}></span> Move Here
                  // </button>

                  <div class="btn-group btn-group-sm w-25 float-sm-end">
                    <button
                      className="btn btn-primary"
                      onClick={() => moveFile(moveFileName)}
                    >
                      <span className={"fa fa-paste"}></span> Move here
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => setMoveFile(null)}
                    >
                      <span className={"fa fa-times"}></span> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container-fluid border for-table">
            <table className="table mb-0 table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                </tr>
              </thead>
            </table>

            <div className="container-fluid for-folder">
              {/* {!click && userData.role === "Faculty" ? <Areasv2 /> : <Areas />} */}
              <Areas />
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModalFolder} onHide={() => setVisible(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={createFolder}>
            <h6>Folder Name: </h6>
            <Form.Control
              type={"text"}
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
            />

            <Button
              variant="primary"
              type="submit"
              onClick={() => setVisible(false)}
              className="mt-2 w-100"
            >
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showModalFile} onHide={() => setVisibleFile(false)}>
        <Modal.Header closeButton>
          <Modal.Title>New File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={uploadFile}>
            <h6>Name of File: </h6>
            <Form.Control
              type={"text"}
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="mb-1"
            />
            <h6>Select File: </h6>
            <Form.Control type={"file"} onChange={saveFile} />

            <Button
              variant="primary"
              type="submit"
              onClick={() => setVisibleFile(false)}
              className="mt-2 w-100"
            >
              Upload File
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <RenameModal
        isOpen={renameModal}
        toggle={toggleModal}
        oldName={currentPath + "/" + newName.old}
        extName={newName.ext}
      />
    </div>
  );
};
export default Home;

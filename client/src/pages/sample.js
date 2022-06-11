import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./global.css";
import FileViewer from "react-file-viewer";
import { useLocation, Link } from "react-router-dom";
import download from "js-file-download";
const onError = (e) => {
  console.log(e, "error in file-viewer");
};

const Sample = () => {
  const location = useLocation();
  const data = location.state;
  const filePath = require(`../Areas${data.fileName}`);
  const extension = data.fileName.slice(1 + data.fileName.lastIndexOf("."));

  useEffect(() => {
    document.title = `${data.fileName.slice(
      1 + data.fileName.lastIndexOf("/")
    )}`;
  });

  const downloadFile = async () => {
    let cPath = data.fileName;
    let myfile2 = cPath.replaceAll("/", "$");

    let res = await fetch("/api/download/" + myfile2);
    const blob = await res.blob();

    download(
      blob,
      `${data.fileName.slice(1 + data.fileName.lastIndexOf("/"))}`
    );
  };

  return (
    <div className="container-fluid text-center mainDivider">
      <div className="container-fluid text-center header-file">
        <h1>{data.fileName.slice(1 + data.fileName.lastIndexOf("/"))}</h1>
        <div className="col-md-5 p-2 mx-auto text-center">
          <div className="mx-md-n5">
            <div class="col px-md-4 mb-2">
              <button
                type="button"
                className="btn btn-primary w-75 shadow-lg"
                onClick={() => downloadFile()}
              >
                Download
              </button>
            </div>

            <div class="col px-md-4">
              <Link
                to="/home"
                type="button"
                className="btn btn-secondary w-75 shadow-lg"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-8 mx-auto p-2 shadow p-4">
        <div>
          <FileViewer
            fileType={extension}
            filePath={filePath}
            onError={onError}
          />
        </div>
      </div>
    </div>
  );
};

export default Sample;

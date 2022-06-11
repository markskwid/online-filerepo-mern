const express = require("express");
const mongoose = require("mongoose");
const FileModel = require("../models/fileSchema.js");
const LogModel = require("../models/logsSchema");
const app = express();
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
let router = express.Router();
var fs = require("fs");
var multer = require("multer");
var cors = require("cors");

router.use(express.static("./client/src/Areas/"));
router.use(
  fileUpload({
    useTempFiles: true,
    safeFileNames: true,
    preserveExtension: true,
  })
);

router.route("/upload").post((req, res) => {
  const { body } = req;
  let uploadFile = req.files.file;
  const name = body.fileName + "." + body.extension;

  const fullPath = body.path;
  const area = fullPath.slice(1);
  const get_area = area.slice(0, area.indexOf("/"));

  let fileInfo = new FileModel({
    fileName: body.fileName,
    extensionName: body.extension,
    belongsTo: `./client/src/Areas${body.path}/${name}`,
  });

  let logInfo = new LogModel({
    uid: body.uid,
    username: body.username,
    action: "Uploaded a file in " + get_area + " named: " + name,
  });

  uploadFile.mv(`./client/src/Areas/${body.path}/${name}`, function (err) {
    if (err) {
      return res.status(500).send(err);
    } else {
      fileInfo.save((err, file) => {
        if (!err) {
          logInfo.save((err, file) => {
            if (!err) {
              res.send("file");
            } else {
              console.log(err);
            }
          });
        } else {
          console.log(err);
        }
      });
    }
  });
});

const createFolder = (name) => {
  const dir = `./client/src/Areas/${name}`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
    return true;
  }
};

const moveFile = (oldPath, newPath) => {
  const dir = `./client/src/Areas/${oldPath}`;
  const dest = `./client/src/Areas/${newPath}`;

  fs.rename(dir, dest, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully moved the file!");
      return true;
    }
  });
};

const renameFile = (oldName, newName) => {
  const dir = `./client/src/Areas/${oldName}`;
  const dest = `./client/src/Areas/${newName}`;

  fs.rename(dir, dest, function (err) {
    if (err) {
      console.log(err);
      return false;
    } else {
      console.log("Successfully renamed the file!");
      return true;
    }
  });
};

const deleteFolder = (folderName) => {
  const dir = `./client/src/Areas/${folderName}`;
  fs.rmdir(dir, { recursive: true }, (err) => {
    if (err) {
      throw err;
    }
    console.log(`deleted!`);
  });
};

router.route("/get-file").post((req, res) => {
  const { body } = req;
  const name = `./client/src/Areas/${body.folderName}`;
  fs.readdir(name, (err, files) => {
    res.send(files);
  });
});

router.route("/get-archive").post((req, res) => {
  const { body } = req;
  const name = `./client/src/Archive/`;
  fs.readdir(name, (err, files) => {
    res.send(files);
  });
});

router.route("/get-area").get((req, res) => {
  const name = `./client/src/Areas`;
  fs.readdir(name, (err, files) => {
    res.send(files);
  });
});

router.route("/read").get((req, res, next) => {
  FileModel.find((error, data) => {
    if (error) {
      console.log("error fetching data");
    } else {
      res.json(data);
    }
  });
});

router.route("/create").post((req, res, next) => {
  const { body } = req;

  let logInfo = new LogModel({
    uid: body.id,
    username: body.name,
    action: body.action,
  });

  logInfo.save((err, file) => {
    if (!err) {
      createFolder(body.belongsTo);
      res.send("folder created");
    } else {
      console.log(err);
    }
  });
});

router.route("/soft-delete").post((req, res) => {
  const { body } = req;
  const dir = `./client/src/Areas${body.oldPath}`;
  const filename = dir.slice(1 + dir.lastIndexOf("/"));
  const dest = `./client/src/Archive/${filename}`;
  console.log(dir);
  console.log(dest + filename);
  console.log(body.action);
  let logInfo = new LogModel({
    uid: body.id,
    username: body.name,
    action: body.action,
  });

  logInfo.save((err, file) => {
    if (!err) {
      fs.rename(dir, dest, function (err) {
        if (err) {
          console.log(err);
        } else {
          res.send("file deleted");
          return true;
        }
      });
    } else {
      console.log(err);
    }
  });
});

router.route("/delete").post((req, res) => {
  const { body } = req;
  let logInfo = new LogModel({
    uid: body.id,
    username: body.name,
    action: body.action,
  });

  logInfo.save((err, file) => {
    if (!err) {
      deleteFolder(body.fileName);
      res.send("file deleted");
    } else {
      console.log(err);
    }
  });
});

router.route("/retrieve-file").post((req, res) => {
  const { body } = req;
  const dir = `./client/src/Archive/${body.fileName}`;
  const dest = `./client/src/Areas/${body.area}/${body.fileName}`;

  // console.log(dir);
  // console.log(dest);

  fs.rename(dir, dest, function (err) {
    if (err) {
      console.log(err);
      res.send("failed");
    } else {
      console.log("Successfully moved the file!");
      res.send("success");
    }
  });
});

router.route("/move").post((req, res) => {
  const { body } = req;
  const dir = `./client/src/Areas/${req.body.moveDir}`;

  let logInfo = new LogModel({
    uid: body.id,
    username: body.name,
    action: body.action,
  });

  logInfo.save((err, file) => {
    if (!err) {
      moveFile(req.body.oldDir, req.body.moveDir);
      res.send(true);
    } else {
      console.log(err);
    }
  });
});

router.route("/copy").post((req, res) => {
  fs.copyFile(
    `./client/src/Areas/${req.body.oldDir}`,
    `./client/src/Areas/${req.body.moveDir}`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        res.send(true);
        console.log("copied");
      }
    }
  );
});

router.route("/rename").post(async (req, res) => {
  const { oldName, newName } = req.body;
  // if(renameFile(oldName, newName)){
  //   console.log("yehey")
  // }else if(renameFile(oldName, newName) === false){
  //   console.log(mali)
  // }
  // res.send(true);

  const dir = `./client/src/Areas/${oldName}`;
  const dest = `./client/src/Areas/${newName}`;

  fs.rename(dir, dest, function (err) {
    if (err) {
      res.send("error rename");
    } else {
      console.log("Successfully renamed the file!");
      res.send("success rename");
    }
  });
});

router.route("/download/:file").get((req, res) => {
  let myFile = req.params.file.toString();
  let myFilev2 = myFile.split("$").join("/");
  const dir = `./client/src/Areas/${myFilev2}`;
  res.download(dir);
});

module.exports = router;

import "./global.css";
import { Form, Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

const ChangeProfile = (props) => {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [link, setLink] = useState("");
  const [displayImg, setDisplayIMG] = useState(null);
  const [confirmPass, setConPass] = useState("");

  useEffect(() => {
    getUserData();
  }, []);

  const [uid, setUID] = useState("");

  const getUserData = () => {
    axios.get("/manage-user/get-info").then((res) => {
      setUID(res.data.id);
      setDisplayIMG(res.data.picture);
    });
  };

  const updateProfile = () => {
    axios
      .put("/manage-user/change-profile/" + uid, { picture: link })
      .then((res) => console.log("updated"));
  };

  const uploadProfile = async (e) => {
    e.preventDefault();
    const data = new FormData();

    data.append("api_key", "784774792134983");
    data.append("api_secret", "JtpGlC2xAwtKSO-HVZh1InnXh14");
    data.append("file", image);
    data.append("upload_preset", "dm1jptku");
    data.append("cloud_name", "dvdpkvkj2");

    let res = await axios.post(
      "https://api.cloudinary.com/v1_1/dvdpkvkj2/image/upload",
      data
    );

    setLink(res.data.url);

    if (res) {
      axios
        .put("/manage-user/change-profile/" + uid, {
          picture: res.data.url,
        })
        .then((res) => console.log("updated"));
    } else {
      console.log("error");
    }
  };

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setDisplayIMG(URL.createObjectURL(event.target.files[0]));
      setImage(event.target.files[0]);
    }
  };
  return (
    <Modal show={props.isOpen}>
      <Modal.Header className="text-center">
        <Modal.Title>Change Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form autoComplete="off" onSubmit={uploadProfile}>
          <div className="text-center p-1 profile-container">
            <img
              src={
                displayImg === ""
                  ? "https://res.cloudinary.com/dvdpkvkj2/image/upload/v1652871890/obtmnrtlh69nafrfiqjq.jpg"
                  : displayImg
              }
              width="200"
              height="200"
              className="rounded-circle profile-picture"
            />

            <input
              type="file"
              name="file"
              id="file"
              onChange={onImageChange}
              className="form-control inputfile"
              accept="image/*"
            />
            <label for="file">
              <span className="fa fa-upload" /> Choose a file
            </label>
          </div>

          <Button
            variant="success w-100 mt-2 mb-2"
            type="submit"
            onClick={props.toggle}
          >
            Update Profile
          </Button>
        </Form>
        <Button variant="danger w-100" onClick={props.toggle}>
          Close
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ChangeProfile;

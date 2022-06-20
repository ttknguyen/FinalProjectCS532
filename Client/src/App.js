import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Container, Tabs, Tab } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import services from "./service";
import background from "./assets/background-2.jpg";
import Popup from 'reactjs-popup';


function App() {
  const [srcImg, setSrcImg] = useState(null);
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({});
  const [queryPath, setQueryPath] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [method, setMethod] = useState("");
  // const [apiHealth, setApiHealth] = useState(false);
  // const [apiUrl, setApiUrl] = useState("");
  const [tab, setTab] = useState(0);

  useEffect(() => {
    document.title = "Image search engine";
  }, []);

  const handleImage = async (event) => {
    if (event.target.files[0].type.match("image/*") === null) {
      return setError("Image file is required");
    } else {
      setError("");
    }
    setSrcImg(URL.createObjectURL(event.target.files[0]));
  };

  const handleMethod = async (event) => {
    const id = event.target.id;
    return setMethod(id.charAt(id.length - 1) - 1);
  };

  const handleSubmit = async () => {
    if (method === "") return setError("Please choose a method");
    else setError("");

    if (!image) return setError("Please upload a file");
    else setError("");

    await setLoading(true);
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height);
    const base64Image = canvas.toDataURL("image/png", 1);

    const req = {
      x: crop.x,
      y: crop.y,
      x_max: crop.x + crop.width,
      y_max: crop.y + crop.height,
      image: base64Image,
      method,
    };

    await console.log(req);

    const response = await services.requestToServer(req, "http://localhost:5000");
    // await setQueryPath(response.data["query-path"]);
    await setResult(response.data.results);
    await setLoading(false);
  };

  const listResult = result.map((base64Img) => {
    return (
      <li key={base64Img}>
        <img
          src={`data:image/png;base64,${base64Img}`}
          alt="Loading..."
          class="img-thumbnail"
        />
      </li>
    );
  });
  return (
    // return apiHealth ? (
    <div>
      <Container className="container" fluid="md">
        <h1 className="d-flex justify-content-center">
          <b>SEARCH ENGINE</b>
        </h1>
        <Tabs
          defaultActiveKey="Txt"
          className="mb-3"
          activeKey={tab}
          onSelect={(k) => setTab(k)}
        >

          {/* IMAGE SEARCH */}
          <Tab eventKey="Img" title="Image Search">
            {" "}
            <Form style={{ marginTop:'25px' }}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="d-flex justify-content-center">
                  <b>Select Image you want to retrieve</b>
                </Form.Label>
                {error && (
                  <Form.Label className="d-flex justify-content-center text-danger">
                    {error}
                  </Form.Label>
                )}

                <div className="mb-3 d-flex justify-content-center" style={{ marginTop:'20px' }}>
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    accept=".jpg, .jpeg, .jfif, .pjpeg, .pjp, .png, .gif"
                    onChange={handleImage}
                  />
                </div>

                <div>
                  {srcImg && (
                    <div
                      id="inputImg"
                      className="d-flex justify-content-center"
                    >
                      <ReactCrop
                        style={{ maxWidth: "20%" }}
                        src={srcImg}
                        onImageLoaded={setImage}
                        crop={crop}
                        onChange={setCrop}
                      />
                    </div>
                  )}
                </div>
                <Form.Label className="d-flex justify-content-center" style={{ marginTop:'25px' }}>
                  <b>Select method for Image Search</b>
                </Form.Label>
                <div
                  class="btn-group"
                  role="group"
                  aria-label="Basic radio toggle button group"
                  className="d-flex justify-content-center mt-3"
                  onChange={handleMethod}
                >
                  <input
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    id="btnradio1"
                    autocomplete="off"
                  />
                  <label
                    class="btn btn-outline-primary"
                    for="btnradio1"
                    style={{
                      padding: "0.5em 3em",
                      borderRadius: "10px",
                      margin: "0.5em",
                    }}
                  >
                    <b>SIR</b>
                  </label>

                  <input
                    type="radio"
                    class="btn-check"
                    name="btnradio"
                    id="btnradio2"
                    autocomplete="off"
                  />
                  <label
                    class="btn btn-outline-primary"
                    for="btnradio2"
                    style={{
                      padding: "0.5em 1.5em",
                      borderRadius: "10px",
                      margin: "0.5em",
                    }}
                  >
                    <b>CNN-IRwNHA</b>
                  </label>
                </div>
              </Form.Group>
              <div class="d-flex justify-content-center">
                <Button variant="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </Form>
            {loading && (
              <div class="d-flex justify-content-center mt-3">
                <div class="spinner-grow text-primary" role="status">
                  <span class="sr-only"></span>
                </div>
                <div class="spinner-grow text-secondary" role="status">
                  <span class="sr-only"></span>
                </div>
                <div class="spinner-grow text-success" role="status">
                  <span class="sr-only"></span>
                </div>
                <div class="spinner-grow text-danger" role="status">
                  <span class="sr-only"></span>
                </div>
                <div class="spinner-grow text-warning" role="status">
                  <span class="sr-only"></span>
                </div>
                <div class="spinner-grow text-info" role="status">
                  <span class="sr-only"></span>
                </div>
              </div>
            )}
            <br />
            <br />
            <ul>{listResult}</ul>
          </Tab>


          {/* TEXT SEARCH */}
          <Tab eventKey="Txt" title="Text Search">
          {" "}
            <Form style={{ marginTop:'25px' }}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label className="d-flex justify-content-center">
                  <b>Type here to search</b>
                </Form.Label>
                {error && (
                  <Form.Label className="d-flex justify-content-center text-danger">
                    {error}
                  </Form.Label>
                )}

                <div className="mb-3 d-flex justify-content-center" style={{ marginTop:'20px' }}>
                  <input
                    type="text"
                  />
                </div>
              
                {/* <Popup
              trigger={<button className="button"> Open Modal </button>}
              modal
              nested
            >
              {close => (
                <div className="modal">
                  <button className="close" onClick={close}>
                    &times;
                  </button>
                  <div className="header"> Modal Title </div>
                  <div className="content">
                    {' '}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum.
                    Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates
                    delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos?
                    <br />
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit
                    commodi beatae optio voluptatum sed eius cumque, delectus saepe repudiandae
                    explicabo nemo nam libero ad, doloribus, voluptas rem alias. Vitae?
                  </div>
                  <div className="actions">
                    <Popup
                      trigger={<button className="button"> Trigger </button>}
                      position="top center"
                      nested
                    >
                      <span>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
                        magni omnis delectus nemo, maxime molestiae dolorem numquam
                        mollitia, voluptate ea, accusamus excepturi deleniti ratione
                        sapiente! Laudantium, aperiam doloribus. Odit, aut.
                      </span>
                    </Popup>
                    <button
                      className="button"
                      onClick={() => {
                        console.log('modal closed ');
                        close();
                      }}
                    >
                      close modal
                    </button>
                  </div>
                </div>
              )}
            </Popup> */}

              </Form.Group>
              <div class="d-flex justify-content-center">
                <Button variant="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </Form>
            {loading && (
              <div class="d-flex justify-content-center mt-3">
                <div class="spinner-grow text-primary" role="status">
                  <span class="sr-only"></span>
                </div>
                <div class="spinner-grow text-secondary" role="status">
                  <span class="sr-only"></span>
                </div>
                <div class="spinner-grow text-success" role="status">
                  <span class="sr-only"></span>
                </div>
                <div class="spinner-grow text-danger" role="status">
                  <span class="sr-only"></span>
                </div>
                <div class="spinner-grow text-warning" role="status">
                  <span class="sr-only"></span>
                </div>
                <div class="spinner-grow text-info" role="status">
                  <span class="sr-only"></span>
                </div>
              </div>
            )}
            <br />
            <br />

            <ul>{listResult}</ul>
          </Tab>
        </Tabs>
      </Container>
    </div>
    //  ) : (
    // <div
    //   style={{
    //     backgroundImage: url(${background}),
    //     backgroundSize: "cover",
    //     backgroundRepeat: "no-repeat",
    //     backgroundPosition: "center",
    //     marginTop: "-17px",
    //     height: "100vh",
    //   }}
    // >
    //   <Container className="container" fluid="md">
    //     <h1 className="d-flex justify-content-center">
    //       <b>IMAGE SEARCH ENGINE</b>
    //     </h1>
    //     <Form.Label className="d-flex justify-content-center">
    //       <b>Input API URL</b>
    //     </Form.Label>
    //     {error && (
    //       <Form.Label className="d-flex justify-content-center text-danger">
    //         {error}
    //       </Form.Label>
    //     )}
    //     <div className="mb-3 d-flex justify-content-center">
    //       <input class="form-control" type="url" onChange={handleApiUrl} />
    //     </div>
    //     <div class="d-flex justify-content-center">
    //       <Button variant="primary" onClick={handleSubmitUrl}>
    //         Submit
    //       </Button>
    //     </div>
    //   </Container>
    // </div>
  );
}

export default App;
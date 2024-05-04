import { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import Home from "./Home";
// import "./App.css";

function App() {
  return (
    <Fragment>
      <Home />
      <ToastContainer position="bottom-right" pauseOnFocusLoss={false} />
    </Fragment>
  );
}

export default App;

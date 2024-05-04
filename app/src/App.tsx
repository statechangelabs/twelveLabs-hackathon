import { Fragment, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { ToastContainer } from "react-toastify";
import Home from "./Home";
// import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Fragment>
      <Home />
      <ToastContainer position="bottom-right" pauseOnFocusLoss={false} />
    </Fragment>
  );
}

export default App;

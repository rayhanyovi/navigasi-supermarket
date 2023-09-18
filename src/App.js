import React from "react";
import PathfindingGrid from "./Grid.js";
import Navbar from "./Navbar.jsx";
import "./Grid.css";

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}>
      <Navbar />
      <br />
      <PathfindingGrid />
    </div>
  );
}

export default App;

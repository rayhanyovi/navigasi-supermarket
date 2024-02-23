import React, { useState } from "react";
import PathfindingGrid from "./Grid.js";
import Navbar from "./Navbar.jsx";
import "./Grid.css";
import "./index.css";
function App() {
  // Define onFindPathClick function here if it's not already defined

  const handleFindPathClick = () => {
    // Implement your logic to find the path here
  };

  return (
    <div className="App">
      <Navbar />
      <br />
      <PathfindingGrid onFindPathClick={handleFindPathClick} />
    </div>
  );
}

export default App;

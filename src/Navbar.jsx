import React from "react";
import "./Grid.css";
import ModalBox from "./Modalbox";

function Navbar() {
  return (
    <nav className="navStyle">
      <div></div>
      <div>
        <h1 style={{ margin: 0 }}>APLIKASI NAVIGASI SUPERMARKET</h1>
      </div>
      <div style={{ paddingRight: "50px" }}>
        <ModalBox />
      </div>
    </nav>
  );
}

export default Navbar;

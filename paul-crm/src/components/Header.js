import React from "react";
import logo from "../images/logo.svg";

function Header({ filterStatus, add, deleteDoc }) {
  return (
    <div>
      <img src={logo} alt="Swift Payments"/>
      <div className="main-header">
        <h1>{`Client List - ${filterStatus}`}</h1>
        <div className="button-header">
          <button className="button-delete" onClick={() => add()}>
            Add
          </button>
          <button className="button-add" onClick={() => deleteDoc()}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Header;

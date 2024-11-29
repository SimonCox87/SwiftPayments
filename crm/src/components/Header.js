import React from "react";
import logo from "../images/wordpress-logo-long.png";

function Header({ setPage, page }) {
  return (
    <div className="header">
      <img src={logo} alt="Swift Payments" className="logo" />
      <h2
        onClick={() => setPage("Deals")}
        style={{ color: (!page || page === "Deals") && "RGB(29, 176, 233)" }}
      >
        Deals
      </h2>
      <h2
        onClick={() => setPage("Locations")}
        style={{ color: page === "Locations" && "RGB(29, 176, 233)" }}
      >
        Locations
      </h2>
      <h2
        onClick={() => setPage("Companies")}
        style={{ color: page === "Companies" && "RGB(29, 176, 233)" }}
      >
        Companies
      </h2>
      <h2
        onClick={() => setPage("Contact")}
        style={{ color: page === "Contact" && "RGB(29, 176, 233)" }}
      >
        Contact
      </h2>
    </div>
  );
}

export default Header;

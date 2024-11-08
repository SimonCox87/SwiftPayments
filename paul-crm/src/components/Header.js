import React from "react";
import logo from "../images/wordpress-logo-long.png";

function Header({ setPage }) {
    return (
        <div className="header">
            <img src={logo} alt="Swift Payments" className="logo"/>
            <h2 onClick={() => setPage("Deals")}>Deals</h2>
            <h2 onClick={() => setPage("Locations")}>Locations</h2>
            <h2 onClick={() => setPage("Companies")}>Companies</h2>  
            <h2 onClick={() => setPage("Contact")}>Contact</h2>        
        </div>
    )
}

export default Header;

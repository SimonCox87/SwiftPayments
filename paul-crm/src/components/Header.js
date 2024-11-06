import React from "react";
import logo from "../images/wordpress-logo-long.png";

function Header({ setPage }) {
    return (
        <div className="header">
            <img src={logo} alt="Swift Payments" className="logo"/>
            <h1 onClick={() => setPage("Deals")}>Deals</h1>
            <h1 onClick={() => setPage("Locations")}>Locations</h1>
            <h1 onClick={() => setPage("Companies")}>Companies</h1>  
            <h1 onClick={() => setPage("Contact")}>Contact</h1>        
        </div>
    )
}

export default Header;
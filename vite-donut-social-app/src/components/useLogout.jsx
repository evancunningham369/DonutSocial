import React from "react";
import { logout } from "../../api/account";

function Logout() {

    return(
        <header>
            <div className="logout">
                <button className="btn btn-primary" onClick={logout}>Logout</button>
            </div>
        </header>
    )
}

export default Logout;
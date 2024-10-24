import React from "react";
import { useNavigate } from 'react-router-dom';
import { logout } from "../../api/account";

function Logout() {
    const navigate = useNavigate();

    const handleLogout = async() => {
        const response = await logout();

        if(response.ok){
            sessionStorage.clear();
            navigate('/');
        }
    }

    return(
        <header>
            <div className="logout">
                <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
            </div>
        </header>
    )
}

export default Logout;
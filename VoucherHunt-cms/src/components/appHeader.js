import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

//import context
import { AuthContext } from '../contexts/authContext';

//import css
import './appHeader.css';

function AppHeader(props) {

    //consume the AuthContext
    const {isAuthenticated, setIsAuthenticated, signOut} = useContext(AuthContext);

    //Sign out and redirect to the main page
    const handleOnClick = (e) => {
        e.preventDefault();

        //sign out
        signOut();
}

    useEffect(() => {
        if (localStorage.getItem('Auth') === "true") {
            setIsAuthenticated(true)
            // console.log("auth");
        }
        else {
            setIsAuthenticated(false);
            // console.log("not auth");
        }
    }, []);

    return (
        <header className="App-header">
            <Link className="logo" to={'/'}>Admin</Link>

            <div className="navi-bar">
                {isAuthenticated ? (
                    <div>
                        <Link className="link" to='/add'>Add</Link>
                        <Link className="link" to={'#'} onClick={handleOnClick}>Log out</Link>
                    </div>
                ): (
                    <Link className="link" to='/signin'>Sign in</Link>
                )} 
            </div>
        </header>
    );
}

export default AppHeader;
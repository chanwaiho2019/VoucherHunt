import React from 'react';
import {Link} from 'react-router-dom';
import './appHeader.css';

function AppHeader() {
    return (
      
        <header className="App-header">
            <p>VoucherHunt Database Management Sysyem</p>
            <div className="navi-bar">
                <Link className="link" to={'add'}>Add</Link>
                <Link className="link" to={'delete'}>Delete</Link>
            </div>
            
            
        </header>
      
    );
}

export default AppHeader;
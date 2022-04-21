import React from 'react';
//import logo from './logo.svg';
import './App.css';
import Add from './add';
import Delete from './delete';
import {BrowserRouter, Route} from 'react-router-dom';
import AppHeader from './appHeader';

function App() {
  return (
    <BrowserRouter>
      <Route exact path={'/'} component={AppHeader}></Route>
      <Route path={'/add'} component={Add}></Route>
      <Route path={'/delete'} component={Delete}></Route>
    </BrowserRouter>
  );
}

export default App;

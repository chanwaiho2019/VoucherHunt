import React from 'react';
import './App.css';
import Add from './pages/add';
import Update from './pages/update';
import Main from './pages/main';
import { BrowserRouter, Route } from 'react-router-dom';
import SignIn from './pages/signin';
import AuthContextProvider from './contexts/authContext';

function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Route exact path={'/'} component={Main}></Route>
        <Route path={'/signin'} component={SignIn}></Route>
        <Route path={'/add'} component={Add}></Route>
        <Route path={'/update'} component={Update}></Route>
      </BrowserRouter>
    </AuthContextProvider>  
  );
}

export default App;

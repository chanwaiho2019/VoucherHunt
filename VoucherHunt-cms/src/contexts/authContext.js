import React, { createContext, useState, useEffect } from 'react';
import firebase from 'firebase';

//Create the context and export it 
export const AuthContext = createContext();

const AuthContextProvider = (props) => {

    //state
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({email: '', password: ''});
    const [forgetPw, setForgetPw] = useState(false);
    const [pwDisabled, setPwDisabled] = useState(false);

    //Log in with the email and pw
    const login = (e) => {
        //To prevent reload of page when button is clicked
        e.preventDefault();

        //login to the firebase with the provided email and pw
        firebase.auth().signInWithEmailAndPassword(user.email, user.password).then((user => {
        })).catch((err) => {
            alert("Please enter a valid email and password!");
            // console.log(err);
        });
    }

    //Sign up with the email and pw
    const signup = (e) => {
        //To prevent reload of page when button is clicked
        e.preventDefault();

        //sign up to the firebase with the provided email and pw
        firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then((user) => {
        }).catch((err) => {
            console.log(err);
        })
    }

    //Sign out the user
    const signOut = () => {
        //set the state of AuthContext
        setIsAuthenticated(false);

        //sign out firebase
        firebase.auth().signOut();

        //Redirect to the signin page
        window.location = '/';
    }

    //handle forget password
    const handleForgetPw = (e) => {
        e.preventDefault();
        setForgetPw(true);
        setPwDisabled(true);
    }

    //Send password reset email
    const sendPwResetEmail = (e) => {
        e.preventDefault();
        
        //Send pw reset email 
        firebase.auth().sendPasswordResetEmail(user.email)
        .then((user) => {
            alert('Please follow the instructions of the email and reset the password!')
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            // setIsSignedIn(!!user);

            //set the state of AuthContext
            setIsAuthenticated(!!user);

            //set localStorage 
            localStorage.setItem('Auth', !!user);
        });
    });

    return (
        <AuthContext.Provider value={{isAuthenticated, 
                                    setIsAuthenticated, 
                                    signOut,
                                    user, 
                                    setUser,
                                    forgetPw, 
                                    setForgetPw,
                                    pwDisabled, 
                                    setPwDisabled,
                                    login,
                                    signup,
                                    handleForgetPw,
                                    sendPwResetEmail}}>
            { props.children }
        </AuthContext.Provider>
    );
}
 
export default AuthContextProvider;
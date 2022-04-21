import React, { useContext } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Redirect } from 'react-router-dom';

//import components
import AppHeader from '../components/appHeader';

//import css file
import './signin.css';
import { AuthContext } from '../contexts/authContext';


const SignIn = (props) => {

    //consume the AuthContext
    const {isAuthenticated, 
            user, 
            setUser,
            forgetPw, 
            pwDisabled, 
            login,
            signup,
            handleForgetPw,
            sendPwResetEmail} = useContext(AuthContext);

    const uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            signInSuccess: () => false
        }
    }

    //Handle text input on change
    const handleOnChange = (e) => {
        if (e.target.name === "email") {
            setUser({
                ...user,
                email: e.target.value
            });
        }
        else {
            setUser({
                ...user,
                password: e.target.value
            });
        }
    }

    return (
        <div>
            <AppHeader />
            <div className="signin-form">
                {isAuthenticated ? (
                    <Redirect to='/'/>
                ) : (
                    <form className="login-form">
                        <div className="heading">Please sign in</div>

                        <StyledFirebaseAuth
                            uiConfig={uiConfig}
                            firebaseAuth={firebase.auth()}
                        /> 

                        <div className="separation">
                            <hr className="separation-line"/>
                            <div className="separation-text">or</div>
                            <hr className="separation-line"/>
                        </div>
                        
                        <div className="login-input">
                            <label htmlFor="email-imput">Email</label>
                            <input type="text" id="email-input" placeholder="Enter email" name="email" value={user.email} onChange={handleOnChange} required="required" />
                        </div>

                        <div className="login-input">
                            <label htmlFor="password-input">Password</label>
                            <input type="text" id="password-input" placeholder="Enter password" name="password" disabled={pwDisabled} value={user.password} onChange={handleOnChange} />
                        </div>

                        {forgetPw ? (
                            <div className="login-input">
                                <input type="button" id="reset-button" value="Reset password" onClick={sendPwResetEmail} />
                            </div>
                        ) : (
                            <div className="login-input">
                                <input type="submit" id="login-button" value="Log in" onClick={login} />
                                <input type="button" id="signup-button" value="Sign up" onClick={signup} />
                            </div>
                        )}

                        <div className="login-input">
                            <div className="forget-pw" onClick={handleForgetPw}>Forget your password?</div>
                        </div>
                    </form>
                )}
            </div>
        </div>
        
    );
}
 
export default SignIn;
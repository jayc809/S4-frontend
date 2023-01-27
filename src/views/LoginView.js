import React from 'react';
import '../styles/LoginView.css'
import axios from 'axios'

const LoginView = ({ setView, windowId, userDetails }) => {

    const onSignInClick = async () => {
        const username = document.getElementById('username-input').value
        const password = document.getElementById('password-input').value
        if (!username || !password) return
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/password_login', {
                params: {
                    username: username,
                    password: password, 
                    windowId: windowId.current
                }
            })
            userDetails.current['username'] = username
            setView('twoFALogin')
        } 
        catch (err) {
            console.log(err)
        }
    }

    const onRegisterClick = () => {
        setView('register')
    }

    return (
        <div id='login-container'>
            <h1>Please Sign In to Continue</h1>
            <div id='login-form'>
                <input id='username-input' type='email' autoCapitalize='off' autoCorrect='off' autoComplete='off' placeholder='Email'></input>
                <input id='password-input' type='password' autoCapitalize='off' autoCorrect='off' autoComplete='off' placeholder='Password'></input>
                <button id='sign-in-button' className='button-1' onClick={onSignInClick}>Sign In</button>
            </div>
            <div>
                <text>Dont have an account yet?</text>
                <button id='register-button' className='button-2' onClick={onRegisterClick}>Create one</button>
            </div>
        </div>
    );
};

export default LoginView;
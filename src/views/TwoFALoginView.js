import React, { useState, useCallback } from 'react';
import axios from 'axios';

const TwoFALoginView = ({ setView, windowId, userDetails }) => {

    const [code, setCode] = useState('')
    const updateCode = (ev) => {
        setCode(ev.target.value)
    }

    const onVerifyClick = useCallback(async () => {
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/twoFA_login', {
                params: {
                    username: userDetails.current['username'],
                    code: code,
                    windowId: windowId.current
                }
            })
            .then(() => {
                // setView('directories')
                setView('fcLogin')
            })
        }
        catch {
            return
        }
    }, [code])


    return (
        <div id='login-container'>
            <h1>Two-Factor Authetication</h1>
            <div id='login-form'>
                <text>Please enter the code shown in your 2FA app</text>
                <input id='twoFA-code-input' type='text' autoCapitalize='off' autoCorrect='off' autoComplete='off' placeholder='2FA Code' value={code} onChange={updateCode}></input>
                <button id='twoFA-code-button' className='button-1' onClick={onVerifyClick}>Continue</button>
            </div>
        </div>
    );
};

export default TwoFALoginView;
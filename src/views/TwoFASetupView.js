import React, { useCallback, useState } from 'react';
import axios from 'axios';
import "../styles/RegisterView.css"

const TwoFASetupView = ({ setView, signUpDetails }) => {

    const [code, setCode] = useState('')
    const updateCode = (ev) => {
        setCode(ev.target.value)
    }

    const onVerifyClick = useCallback(async () => {
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/validate_twoFA_code', {
                params: {
                    username: signUpDetails.current['username'],
                    code: code
                }
            })
            .then(() => {
                // setView('secretSetup')
                setView('fcSetup')
            })
        }
        catch {
            return
        }
    }, [code])

    const [refreshImg, setRefreshImg] = useState(true)
    const [refreshable, setRefreshable] = useState(true)
    const REFRESH_TIME_LIMIT = 3000
    
    const onRegenerateClick = useCallback(() => {
        if (!refreshable) return
        setRefreshImg(!refreshImg)
        setRefreshable(false)
        setTimeout(() => {
            setRefreshable(true)
        }, REFRESH_TIME_LIMIT)
    }, [refreshImg, refreshable])

    return (
        <div id='register-container'>
            <h1>Create an Account (3/8)</h1>
            <h2>Two-Factor Authetication</h2>
            <div id='register-form'>
                <text>Please scan the code below with a two-factor authetication app to enable 2FA</text>
                <div id='twoFA-container'>
                    {
                        !refreshImg ?
                        <img src={process.env.REACT_APP_SERVER_BASE_URL + '/send_twoFA_code_refresh?username=' + signUpDetails.current['username']} alt='2FA_code'></img> :
                        <img src={process.env.REACT_APP_SERVER_BASE_URL + '/send_twoFA_code?username=' + signUpDetails.current['username']} alt='2FA_code'></img>
                    }
                </div> 
                <input id='twoFA-code-input' type='text' autoCapitalize='off' autoCorrect='off' autoComplete='off' placeholder='2FA Code' value={code} onChange={updateCode}></input>
                <button id='twoFA-code-button' className='button-1' onClick={onVerifyClick}>Verify</button>
                <div>
                    <text>Don't see a code?</text>
                    <button id='regenerate-twoFA-button' className='button-2' onClick={onRegenerateClick}>Regenerate code</button>
                </div>
            </div>
        </div>
    );
};

export default TwoFASetupView;
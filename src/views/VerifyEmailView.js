import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const VerifyEmailView = ({ setView, signUpDetails }) => {

    useEffect(() => {
        sendEmail(1)
    }, [])

    const sendEmail = async (loopCounter) => {
        if (!signUpDetails.current['username'] || loopCounter >= 5) return
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/send_verification', {
                params: {
                    username: signUpDetails.current['username']
                }
            })
        }
        catch (err) {
            console.log(err)
            sendEmail(loopCounter + 1)
        }
    }

    const [code, setCode] = useState('')

    const updateCode = (ev) => {
        setCode(ev.target.value)
    }

    const onVerifyClick = useCallback(async () => {
        if (!(
            signUpDetails.current['username'] &&
            signUpDetails.current['password'] &&
            signUpDetails.current['securityQuestion'] &&
            signUpDetails.current['securityAnswer'] &&
            code
        )) {
            console.log("missing credentials")
            return
        }
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/validate_verification', {
                params: {
                    username: signUpDetails.current['username'],
                    code: code
                }
            })
            setView('twoFASetup')
        }
        catch (err) {
            console.log(err)
        }
    }, [code])

    const onResendClick = () => {
        sendEmail(1)
    }

    return (
        <div id='register-container'>
            <h1>Create an Account (2/8)</h1>
            <h2>Verify Your Email</h2>
            <div id='register-form'>
                <text>A 6-digit verification code has been sent to your email account</text>
                <br></br>
                <br></br>
                <text>Please check your inbox/spam and enter it below</text>
                <br></br>
                <br></br>
                <input id='verification-code-input' type='text' autoCapitalize='off' autoCorrect='off' autoComplete='off' placeholder='Verification Code' value={code} onChange={updateCode}></input>
                <button id='verification-code-button' className='button-1' onClick={onVerifyClick}>Verify</button>
                <div>
                    <text>Didn't receive a code?</text>
                    <button id='resend-verification-button' className='button-2' onClick={onResendClick}>Resend email</button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailView;
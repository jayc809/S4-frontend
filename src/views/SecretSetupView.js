import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const SecretSetupView = ({ setView, signUpDetails }) => {

    const [secret, setSecret] = useState('')

    useEffect(() => {
        createAccount()
    }, [])

    const createAccount = async () => {
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/create_user', {
                params: {
                    username: signUpDetails.current['username'],
                    password: signUpDetails.current['password'],
                    securityQuestion: signUpDetails.current['securityQuestion'],
                    securityAnswer: signUpDetails.current['securityAnswer']
                }
            })
            .then(res => {
                if (res.data) {
                    setSecret(res.data['secret'])
                    signUpDetails.current = {}
                }
            })
        } 
        catch (err) {
            console.log(err)
        }
    }

    const onCompleteClick = useCallback(() => {
        if (!secret) return
        setView('login')
    }, [secret])

    return (
        <div id='register-container'>
            <h1>Create an Account (8/8)</h1>
            <h2>Secret Key</h2>
            <div id='register-form'>
                <text>Please copy the secret key below and store it at a secure location</text>
                <br></br>
                <br></br>
                <text>This is the <b>ONLY WAY</b> you can restore your account if you forget your password</text>
                <br></br>
                <br></br>
                <br></br>
                <text> Your secret key:</text>
                <textarea type='text' value={secret} style={{backgroundColor: 'lightgray'}} rows={5}></textarea>
                <br></br>
                <br></br>
                <button className='button-1' onClick={onCompleteClick} style={{
                    backgroundColor: secret ? 'transparent' : 'lightgray',
                    cursor: secret ? 'pointer' : 'default'
                }}>Complete Account Creation</button>
                <div>
                    <text>Don't see a secret key?</text>
                    <button className='button-2' onClick={createAccount}>Regenerate Secret</button>
                </div>
            </div>
        </div>
    );
};

export default SecretSetupView;
import React from 'react';
import '../styles/RegisterView.css'
import { useState, useEffect, useCallback } from 'react';
import { encryptString } from '../Encrypt';
import axios from 'axios';

const RegisterView = ({ setView, signUpDetails }) => {

    const [robotQuestionOps, setRobotQuestionOps] = useState(null)
    const [robotQuestionText, setRobotQuestionText] = useState('')
    const [username, setUsername] = useState(signUpDetails.current['username'] || '')
    const [securityQuestion, setSecurityQuestion] = useState(signUpDetails.current['securityQuestion'] || 'default')
    const [securityAnswer, setSecurityAnswer] = useState(signUpDetails.current['securityAnswer'] || '')

    useEffect(() => {
        const operand1 = (Math.floor(Math.random() * 100) + 1) * (Math.random() > 0.5 ? 1 : -1)
        const operand2 = Math.floor(Math.random() * 100) + 1
        const operator = Math.random() > 0.5 ? 1 : -1
        setRobotQuestionOps({
            operand1, 
            operand2, 
            operator
        })
    }, [])

    useEffect(() => {
        if (!robotQuestionOps) return
        setRobotQuestionText(`What is ${robotQuestionOps['operand1']} ${robotQuestionOps['operator'] === 1 ? 'plus' : 'minus'} ${robotQuestionOps['operand2']}?`)
    }, [robotQuestionOps])

    const updateUsername = (ev) => {
        setUsername(ev.target.value)
    }

    const updateSecurityQuestion = (ev) => {
        setSecurityQuestion(ev.target.value)
    }

    const updateSecurityAnswer = (ev) => {
        setSecurityAnswer(ev.target.value)
    }
    
    const isUsernameValid = useCallback(() => {
        return username.toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    }, [username])

    const isUsernameNotTaken = useCallback(async () => {
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/validate_username', {
                params: {
                    username: username
                }
            })
            return true
        }
        catch (err) {
            console.log(err)
            return false
        }
    }, [username])

    const isPasswordValid = () => {
        const password = document.getElementById('password-register-input').value
        return password
    }

    const isRobotValid = useCallback(() => {
        if (!robotQuestionOps) return false
        const answer = Number(document.getElementById('robot-input').value)
        const correct = robotQuestionOps['operand1'] + robotQuestionOps['operator'] * robotQuestionOps['operand2']
        return answer === correct
    }, [robotQuestionOps])

    const isSecurityQuestionValid = useCallback(() => {
        return securityQuestion !== 'default'
    }, [securityQuestion])

    const isSecurityAnswerValid = useCallback(() => {
        return securityAnswer
    }, [securityAnswer])

    const [errorText, setErrorText] = useState('')

    const onContinueClick = useCallback(async () => {
        if (!isUsernameValid()) {
            setErrorText('Please enter a valid email')
            return
        }
        if (!await isUsernameNotTaken()) {
            setErrorText('Please enter a email that is not already taken')
            return
        }
        if (!isPasswordValid()) {
            setErrorText('Please enter a valid password')
            return
        } 
        if (!isRobotValid()) {
            setErrorText('Please enter the correct answer to the equation')
            return
        }
        if (!isSecurityQuestionValid()) {
            setErrorText('Please select a valid security question')
            return
        }
        if (!isSecurityAnswerValid()) {
            setErrorText('Please enter a valid answer to the security question')
            return
        }
        const password = document.getElementById('password-register-input').value
        const passwordEncrypted = await encryptString(password)
        signUpDetails.current = {
            username: username,
            password: passwordEncrypted,
            securityQuestion: securityQuestion,
            securityAnswer: securityAnswer
        }
        setView('verifyEmail')
    }, [username, securityQuestion, securityAnswer, robotQuestionOps])

    return (
        <div id='register-container'>
            <h1>Create an Account (1/8)</h1>
            <h2>Basic Information</h2>
            <div id='register-form'>
                <input id='username-register-input' type='email' autoCapitalize='off' autoCorrect='off' autoComplete='off' placeholder='Email' value={username} onChange={updateUsername}></input>
                <input id='password-register-input' type='password' autoCapitalize='off' autoCorrect='off' autoComplete='off' placeholder='Password'></input>
                <input id='robot-input' type='number' placeholder={robotQuestionText}></input>
                <select id='security-question-select' value={securityQuestion} onChange={updateSecurityQuestion}>
                    <option value='default'>Please select a security question</option>
                    <option value='singer'>Who is your favorite singer</option>
                    <option value='school'>What is the name of your high school</option>
                    <option value='pet'>What is the name of your first pet</option>
                    <option value='movie'>What is your favorite movie</option>
                    <option value='car'>What is the model of your first car</option>
                </select>
                <input id='security-answer-input' type='text' autoCapitalize='off' autoCorrect='off' autoComplete='off' placeholder='Answer' value={securityAnswer} onChange={updateSecurityAnswer}></input>
                <button id='sign-up-button' className='button-1' onClick={onContinueClick}>Continue</button>
            </div>
            <text className='error-text-1'>{errorText}</text>
        </div>
    );
};

export default RegisterView;
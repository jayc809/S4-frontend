import './App.css';
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import LoginView from './views/LoginView';
import DirectoriesView from './views/DirectoriesView';
import HeaderView from './views/HeaderView';
import RegisterView from './views/RegisterView';
import VerifyEmailView from './views/VerifyEmailView';
import TwoFASetupView from './views/TwoFASetupView';
import FCSetupView from './views/FCSetupView';
import CheckBrowserView from './views/CheckBrowserView';
import FCVerifyView from './views/FCVerifyView';
import SecretSetupView from './views/SecretSetupView';
import TwoFALoginView from './views/TwoFALoginView';
import FCLoginView from './views/FCLoginView';


function App() {
  
  const [view, setView] = useState('login')
  const viewStack = useRef(['login'])
  const windowId = useRef('')
  const signUpDetails = useRef({})
  const userDetails = useRef({})

  const generateWindowId = () => {
    let res = ''
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 30; i+= 1) {
        res += charSet.charAt(Math.floor(Math.random() * charSet.length))
    }
    return res
  }
  
  useEffect(() => {
    const id = generateWindowId()
    windowId.current = id
    // console.log('window id: ', id)
  }, [])

  useEffect(() => {
    if (viewStack.current[viewStack.current.length - 1] !== view) {
      viewStack.current.push(view)
    }
    if (view === 'login') {
      signUpDetails.current = {}
      userDetails.current = {}
    }
  }, [view])

  const onReturnClick = () => {
    if (viewStack.current.length === 1) return
    viewStack.current.pop()
    setView(viewStack.current[viewStack.current.length - 1])
  }

  return (
    <div className='App'>
      <CheckBrowserView></CheckBrowserView>
      <HeaderView view={view} setView={setView} viewStack={viewStack} onReturnClick={onReturnClick} windowId={windowId} userDetails={userDetails} generateWindowId={generateWindowId}></HeaderView>
      {{
        login: <LoginView setView={setView} windowId={windowId} userDetails={userDetails}></LoginView>,
        twoFALogin: <TwoFALoginView setView={setView} windowId={windowId} userDetails={userDetails}></TwoFALoginView>,
        fcLogin: <FCLoginView setView={setView} windowId={windowId} userDetails={userDetails}></FCLoginView>,
        register: <RegisterView setView={setView} signUpDetails={signUpDetails}></RegisterView>,
        verifyEmail: <VerifyEmailView setView={setView} signUpDetails={signUpDetails}></VerifyEmailView>,
        twoFASetup: <TwoFASetupView setView={setView} signUpDetails={signUpDetails}></TwoFASetupView>,
        fcSetup: <FCSetupView setView={setView} signUpDetails={signUpDetails}></FCSetupView>,
        fcVerify: <FCVerifyView setView={setView} signUpDetails={signUpDetails}></FCVerifyView>,
        secretSetup: <SecretSetupView setView={setView} signUpDetails={signUpDetails}></SecretSetupView>,
        directories: <DirectoriesView setView={setView} windowId={windowId} userDetails={userDetails}></DirectoriesView>,
      }[view]}
    </div>
  );
}

export default App;

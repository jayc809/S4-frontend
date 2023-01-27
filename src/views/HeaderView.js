import React from 'react';
import '../styles/HeaderView.css'

const HeaderView = ({ view, setView, onReturnClick, userDetails, windowId, generateWindowId }) => {

    const onSignOutClick = () => {
        userDetails.current = {}
        windowId.current = generateWindowId()
        setView('login') 
    }

    return (
        <div id='header-container'>
            <button id='return-button' className='button-1' onClick={onReturnClick}>⇦</button>
            {
                ['directories'].includes(view) ? 
                <button id='sign-out-button' className='button-1' onClick={onSignOutClick}>Sign Out</button> : 
                <></>
            }
        </div>
    );
};

export default HeaderView;
import React, { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';


const FCLoginView = ({ setView, windowId, userDetails }) => {

    const [step, setStep] = useState(1)
    const [pictureData, setPictureData] = useState(null)
    const [showCircle, setShowCircle] = useState(true)
    const mediaStream = useRef(null)

    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
            .getUserMedia({video: true})
            .then(stream => {
                mediaStream.current = stream
                const video = document.getElementById('cam-footage-video')
                video.srcObject = stream
                video.play()

            })
        }
    }, [])

    const onSnapClick = () => {
        const video = document.getElementById('cam-footage-video')
        const canvasInvisible = document.getElementById('cam-footage-canvas-invisible')
        const contextInvisible = canvasInvisible.getContext('2d')
        video.pause()
        contextInvisible.imageSmoothingEnabled = false
        contextInvisible.drawImage(video, 0, 0, canvasInvisible.width, canvasInvisible.height)
        setPictureData(canvasInvisible.toDataURL())
        setShowCircle(false)
        setStep(2)
    }

    const clearCanvas = () => {
        const canvasInvisible = document.getElementById('cam-footage-canvas-invisible')
        const contextInvisible = canvasInvisible.getContext('2d')
        contextInvisible.clearRect(0, 0, canvasInvisible.width, canvasInvisible.height)
    }

    const onRetryClick = () => {
        clearCanvas()
        const video = document.getElementById('cam-footage-video')
        video.play()
        setShowCircle(true)
        setStep(1)
    }

    const onSubmitClick = useCallback(async () => {
        if (!pictureData) return
        try {
            await axios.post(process.env.REACT_APP_SERVER_BASE_URL + '/fc_login', {
                data: {
                    username: userDetails.current['username'],
                    pictureData: pictureData,
                    windowId: windowId.current
                }
            })
            .then(res => {
                const video = document.getElementById('cam-footage-video')
                video.srcObject = null
                if (mediaStream.current) {
                    mediaStream.current.getTracks().forEach(track => {
                        track.stop()
                    })
                }
                clearCanvas()
                setView('directories')
            })
        }
        catch (err) {
            console.log(err)
            return
        }
    }, [pictureData])


    return (
        <div id='login-container'>
            <h1>Face Recognition</h1>
            <div id='login-form'>
                <text>Please confirm your identity via Face Recognition</text>
                <br></br>
                <br></br>
                <div id='cam-footage-container'>
                    {
                        showCircle ?
                        <div id='cam-footage-circle'></div> :
                        <></>
                    }
                    <video id='cam-footage-video' autoPlay></video>
                </div>
                {{
                    1:  <button className='button-1' onClick={onSnapClick}>Snap</button>,
                    2:  <div id='retry-submit-container'>
                            <button className='button-1' onClick={onRetryClick}>Retry</button>
                            <button className='button-1' onClick={onSubmitClick}>Continue</button>
                        </div>
                }[step]}
            </div>
            <canvas id='cam-footage-canvas-invisible' width={400} height={300} hidden></canvas>
        </div>
    );
};

export default FCLoginView;
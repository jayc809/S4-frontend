import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../styles/FCSetupView.css'
import axios from 'axios'

const FCSetupView = ({ setView, signUpDetails }) => {

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
            await axios.post(process.env.REACT_APP_SERVER_BASE_URL + '/face_recognition_setup', {
                data: {
                    username: signUpDetails.current['username'],
                    pictureData: pictureData
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
                setView('fcVerify')
            })
        }
        catch (err) {
            console.log(err)
            return
        }
    }, [pictureData])


    return (
        <div id='register-container'>
            <h1>Create an Account (4/8)</h1>
            <h2>Face Recognition</h2>
            <div id='register-form'>
                <text>Please enable camera access and follow the steps below:</text>
                <br></br>
                <br></br>
                <text>1. Center your face inside the blue circle</text>
                <br></br>
                <br></br>
                <text>2. 'Snap' when ready</text>
                <br></br>
                <br></br>
                <text>3. 'Submit' if satisfied or 'Retry' otherwise</text>
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
                            <button className='button-1' onClick={onSubmitClick}>Submit</button>
                        </div>
                }[step]}
            </div>
            <canvas id='cam-footage-canvas-invisible' width={400} height={300} hidden></canvas>
        </div>
    );
};

export default FCSetupView;
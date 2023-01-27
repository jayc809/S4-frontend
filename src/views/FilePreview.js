import React, { useCallback, useEffect, useState } from 'react';
import '../styles/DirectoriesView.css'
import axios from 'axios';


const FilePreview = ({ userDetails, windowId, onMount, layerOpened, deleteFileByLayers }) => {

    const [show, setShow] = useState(false)
    const [files, setFiles] = useState([{
        name: 'dummyData',
        id: -1,
        s3Name: 'dummyData',
        contentType: 'dummyData'
    }])
    const [currFileIndex, setCurrFileIndex] = useState(0)
    const [content, setContent] = useState(<></>)
    const [showDeleteFileMenu, setShowDeleteFileMenu] = useState(false)

    useEffect(() => {
        onMount(setShow, setFiles, setCurrFileIndex)
    }, [])
    
    useEffect(() => {
        if (show) {
            document.addEventListener('keydown', onKeyDown)
        } 
        return () => {
            document.removeEventListener('keydown', onKeyDown)
        }
    }, [show])

    const downloadFile = async(file) => {
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/get_file', {
                params: {
                    username: userDetails.current['username'],
                    windowId: windowId.current,
                    fileName: file['name'],
                    fileId: file['id'],
                    fileS3Name: file['s3Name']
                },
                responseType: 'blob'
            })
            .then(res => {
                if (!res.data) return
                const url = window.URL.createObjectURL(res.data)
                const a = document.createElement('a')
                a.style.display = 'none'
                a.href = url
                a.download = file['name']
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(url)
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const contentType = files[currFileIndex]['contentType']
        let content = <></>
        if (contentType.includes('image')) {
            content = (
                <img 
                    src={`${process.env.REACT_APP_SERVER_BASE_URL}/get_file?username=${userDetails.current['username']}&windowId=${windowId.current}&fileName=${files[currFileIndex]['name']}&fileId=${files[currFileIndex]['id']}&fileS3Name=${files[currFileIndex]['s3Name']}`} 
                    alt='file_preview'
                ></img>
            )
        } else if (contentType.includes('video')) {
            content = (
                <video controls>
                    <source 
                        src={`${process.env.REACT_APP_SERVER_BASE_URL}/get_file?username=${userDetails.current['username']}&windowId=${windowId.current}&fileName=${files[currFileIndex]['name']}&fileId=${files[currFileIndex]['id']}&fileS3Name=${files[currFileIndex]['s3Name']}`}
                    />
                </video>
            )
        } else if (contentType.includes('audio')) {
            console.log("audio")
            content = (
                <div>
                    <audio controls>
                        <source
                            src={`${process.env.REACT_APP_SERVER_BASE_URL}/get_file?username=${userDetails.current['username']}&windowId=${windowId.current}&fileName=${files[currFileIndex]['name']}&fileId=${files[currFileIndex]['id']}&fileS3Name=${files[currFileIndex]['s3Name']}`}
                        />
                    </audio>
                </div>
            )
        } else {
            content = (
                <div>  
                    <h2 style={{color: 'white'}}>Cannot Preview File</h2>
                    <button className='button-1' style={{color: 'white'}} onClick={() => downloadFile(files[currFileIndex])}>Download</button>
                </div>
            )
        }
        setContent(content)
    }, [files, currFileIndex, show])

    const onCloseClick = () => {
        setShow(false)
    }

    const onLeftClick = useCallback(() => {
        if (currFileIndex > 0) {
            setCurrFileIndex(currFileIndex - 1)
        }
    }, [currFileIndex])

    const onRightClick = useCallback(() => {
        if (currFileIndex < files.length - 1) {
            setCurrFileIndex(currFileIndex + 1)
        }
    }, [currFileIndex, files])

    const onKeyDown = (ev) => {
        if (ev.key === 'ArrowLeft') {
            const leftButton = document.getElementById('file-preview-left-button')
            if (!leftButton) return
            leftButton.click()
        } else if (ev.key === 'ArrowRight') {
            const rightButton = document.getElementById('file-preview-right-button')
            if (!rightButton) return
            rightButton.click()
        }
    }

    const onPreviewContainerClick = useCallback((ev) => {
        if (showDeleteFileMenu) {
            if (ev.target.id === 'file-preview-delete-container') {
                setShowDeleteFileMenu(false)
            }
        } else {
            if (!(['IMG', 'H2', 'BUTTON'].includes(ev.target.tagName) || ev.target.className === 'file-preview-window')) {
                setShow(false)
            }
        }
    }, [showDeleteFileMenu])

    const onDeleteIconClick = useCallback(() => {
        setShowDeleteFileMenu(!showDeleteFileMenu)
    }, [showDeleteFileMenu]) 

    const onDeleteClick = useCallback(() => {
        if (!(deleteFileByLayers.current && layerOpened.current != null && deleteFileByLayers.current.length > layerOpened.current)) return
        const deleteFile = deleteFileByLayers.current[layerOpened.current]
        setShowDeleteFileMenu(false)
        deleteFile(files[currFileIndex])
    }, [files, currFileIndex])

    return (
        <div id='file-preview-container' className='directories-layer' style={{zIndex: 100}} hidden={!show} onClick={onPreviewContainerClick}>
            {
                showDeleteFileMenu ? 
                <div id='file-preview-delete-container' >
                    <div className='directory-add-body'>
                        <text style={{width: '12.5vw'}}>{`Delete ${files[currFileIndex]['name']}?`}</text>
                        <button className='button-1' onClick={onDeleteClick}>Delete</button>
                    </div>
                </div> :
                <></>
            }
            <div>
                <div id='file-preview-header'>
                    <div className='file-preview-header-side'></div>
                    <div className='file-preview-header-center'>
                        <h2 style={{color: 'white'}}>{files[currFileIndex]['name']}</h2>
                    </div>
                    <div className='file-preview-header-side'>
                        <button id='file-preview-close-button' onClick={onCloseClick}>✕</button>
                    </div>
                </div>
                <div id='file-preview-body'>
                    <div className='file-preview-window-side'>
                        {
                            currFileIndex > 0 ?
                            <button id='file-preview-left-button' onClick={onLeftClick}></button> :
                            <></>
                        }
                    </div>
                    <div id='file-preview-window-container'>
                        <div id='file-preview-window' style={{filter: showDeleteFileMenu ? 'brightness(0.2)' : ''}}>
                            {content}
                        </div>
                    </div>
                    <div className='file-preview-window-side'>
                        {
                            currFileIndex < files.length - 1 ?
                            <button id='file-preview-right-button' onClick={onRightClick}></button> :
                            <></>
                        }
                    </div>
                </div>
                <div id='file-preview-footer'>
                    <button id='file-preview-delete-button' onClick={onDeleteIconClick}></button>   
                </div>
            </div>
        </div>
    );
};

export default FilePreview;
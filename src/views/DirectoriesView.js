import React, { useCallback, useEffect, useState, useRef } from 'react';
import '../styles/DirectoriesView.css'
import axios from 'axios';
import DirectoryLayer from './DirectoryLayer';
import FilePreview from './FilePreview';


const DirectoriesView = ({ setView, windowId, userDetails }) => {

    const [directories, setDirectories] = useState([])
    // userDetails = useRef({
    //     username: 'jaychiang0809@berkeley.edu'
    // })
    // windowId = useRef(1)

    useEffect(() => {
        getEntryDirectory()
    }, [])

    const getEntryDirectory = async () => {
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/get_entry_directory', {
                params: {
                    username: userDetails.current['username'],
                    windowId: windowId.current
                }
            })
            .then(res => {
                setDirectories([res.data.entryDirectoryId])
            })
        } 
        catch (err) {
            console.log(err)
        }
    }

    const openNewDirectory = useCallback(async (directoryId, layer) => {
        const newDirectories = directories.slice(0, layer + 1)
        newDirectories.push(directoryId)
        setDirectories(newDirectories)
    }, [directories])

    const setFilePreviewShow = useRef(null)
    const setFilePreviewFiles = useRef(null)
    const setFilePreviewCurrFileIndex = useRef(null)
    const layerOpened = useRef(null)
    const deleteFileByLayers = useRef([])

    const onFilePreviewMount = (setShow, setFiles, setCurrFileIndex) => {
        setFilePreviewShow.current = setShow
        setFilePreviewFiles.current = setFiles
        setFilePreviewCurrFileIndex.current = setCurrFileIndex
    }

    const onDirectoryLayerMount = (deleteFile, layer) => {
        const newDeleteFileByLayers = deleteFileByLayers.current.slice(0, layer)
        newDeleteFileByLayers.push(deleteFile)
        deleteFileByLayers.current = newDeleteFileByLayers
    }

    const openFile = async(files, currFileIndex, layer) => {
        if (!(setFilePreviewShow.current && setFilePreviewFiles.current && setFilePreviewCurrFileIndex.current)) return
        setFilePreviewFiles.current(files)
        setFilePreviewCurrFileIndex.current(currFileIndex)
        setFilePreviewShow.current(true)
        layerOpened.current = layer
    }

    return (
        <div id='directories-container'>
            <FilePreview onMount={onFilePreviewMount} windowId={windowId} userDetails={userDetails} layerOpened={layerOpened} deleteFileByLayers={deleteFileByLayers}></FilePreview>
            <div className='directories-layer' style={{zIndex: 10}}>
                <h1>Directories</h1>
                <div id='directories-list' style={{justifyContent: directories.length < 5 ? 'center' : 'flex-start'}}>
                    {
                        directories.map((directoryId, index) => {
                            return <DirectoryLayer key={`directory-container-${directoryId}`} onMount={onDirectoryLayerMount} directoryId={directoryId} windowId={windowId} userDetails={userDetails} layer={index} openNewDirectory={openNewDirectory} openFile={openFile}></DirectoryLayer>
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default DirectoriesView;
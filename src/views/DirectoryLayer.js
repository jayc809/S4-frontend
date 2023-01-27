import React, { useCallback, useEffect, useState } from 'react';
import '../styles/DirectoriesView.css'
import axios from 'axios';
import folderIcon from '../static/folder-icon.png'
import fileIcon from '../static/file-icon.png'
import imageIcon from '../static/image-icon.png'
import videoIcon from '../static/video-icon.png'
import audioIcon from '../static/audio-icon.png'


const DirectoryLayer = ({ onMount, directoryId, windowId, userDetails, layer, openNewDirectory, openFile }) => {

    const [directoryInfo, setDirectoryInfo] = useState({
        name: '',
        subdirectories: [],
        files: []
    })

    useEffect(() => {
        loadDirectory()
        onMount(onDeleteFileClick, layer)
    }, [])

    const loadDirectory = async () => {
        if (!directoryId) return
        const storedData = JSON.parse(window.sessionStorage.getItem(`directory-${directoryId}`))
        if (storedData && storedData['valid']) {
            setDirectoryInfo(storedData['data'])
            if (layer >= 4) {
                const list = document.getElementById('directories-list')
                const rightMost = document.getElementById(`directory-container-${layer}`)
                list.scrollLeft = rightMost.offsetLeft - 10
            }
            return
        }
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/get_directory', {
                params: {
                    username: userDetails.current['username'],
                    windowId: windowId.current,
                    directoryId: directoryId
                }
            })
            .then(res => {
                if (!res.data) console.log("no data found")
                setDirectoryInfo(res.data)
                if (layer >= 4) {
                    const list = document.getElementById('directories-list')
                    const rightMost = document.getElementById(`directory-container-${layer}`)
                    list.scrollLeft = rightMost.offsetLeft - 10
                }
                const storedData = {
                    valid: true,
                    data: res.data
                }
                window.sessionStorage.setItem(`directory-${directoryId}`, JSON.stringify(storedData))
            })
        } 
        catch (err) {
            console.log(err)
        }
    }

    const [selectedSubdirectory, setSelectedSubdirectory] = useState(null)

    const onSubdirectoryClick = useCallback((subdirectory, index) => {
        if (selectedSubdirectory === index) return
        openNewDirectory(subdirectory['id'], layer)
        setSelectedSubdirectory(index)
    }, [selectedSubdirectory])

    const onFileClick = (file) => {
        try {
            let index = null
            for (let i = 0; i < directoryInfo['files'].length; i += 1) {
                if (directoryInfo['files'][i]['id'] === file['id']) {
                    index = i
                    break
                }
            }
            if (index == null) return
            openFile(directoryInfo['files'], index, layer)
        } 
        catch (err) {
            console.log(err)
        }
    }

    const [showAddFolderMenu, setShowAddFolderMenu] = useState(false)
    const [showAddFileMenu, setShowAddFileMenu] = useState(false)
    const [showDeleteFolderMenu, setShowDeleteFolderMenu] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)

    const closeAllAddMenus = () => {
        setShowAddFileMenu(false)
        setShowAddFolderMenu(false)
        setShowDeleteFolderMenu(false)
    }

    const onAddContainerClick = (ev) => {
        if (ev.target.className === 'directory-add-container') {
            closeAllAddMenus()
        }
    }

    const onAddFolderIconClick = useCallback(() => {
        setShowAddFileMenu(false)
        setShowDeleteFolderMenu(false)
        setShowAddFolderMenu(!showAddFolderMenu)
    }, [showAddFolderMenu])

    const onAddFileIconClick = useCallback(() => {
        setShowAddFolderMenu(false)
        setShowDeleteFolderMenu(false)
        setShowAddFileMenu(!showAddFileMenu)
    }, [showAddFileMenu])

    const onDeleteIconClick = useCallback(() => {
        setShowAddFileMenu(false)
        setShowAddFolderMenu(false)
        setShowDeleteFolderMenu(!showDeleteFolderMenu)
    }, [showDeleteFolderMenu])

    const onAddFolderClick = useCallback(async () => {
        const directoryName = document.getElementById(`add-folder-input-${layer}`).value
        if (!directoryName) return
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/create_directory', {
                params: {
                    username: userDetails.current['username'],
                    windowId: windowId.current,
                    directoryName: directoryName,
                    parentDirectoryId: directoryId
                }
            })
            .then(res => {
                const storedData = JSON.parse(window.sessionStorage.getItem(`directory-${directoryId}`))
                if (storedData && storedData['valid']) {
                    storedData['valid'] = false
                    window.sessionStorage.setItem(`directory-${directoryId}`, JSON.stringify(storedData))
                }
                const newDirectoryInfo = {
                    id: directoryInfo['id'],
                    name: directoryInfo['name'],
                    files: directoryInfo['files'],
                    subdirectories: [...directoryInfo['subdirectories'], res.data]
                }
                setDirectoryInfo(newDirectoryInfo)
            })
        } 
        catch (err) {
            console.log(err)
        }
        finally {
            closeAllAddMenus()
        }
    }, [directoryInfo])

    const onFileChange = (ev) => {
        if (ev.target.files && ev.target.files[0]) {
            setSelectedFile(ev.target.files[0])
        }
    }

    const onAddFileClick = useCallback(async () => {
        if (!selectedFile) return
        const data = {
            username: userDetails.current['username'],
            windowId: windowId.current,
            fileName: selectedFile['name'],
            contentType: selectedFile['type'],
            directoryId: directoryId
        }
        const data_json = JSON.stringify(data);
        const data_blob = new Blob([data_json], {
            type: 'application/json'
        })
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('data', data_blob)
        // for (var [key, value] of formData.entries()) { 
        //     console.log(key, value);
        // }
        try {
            await axios.post(process.env.REACT_APP_SERVER_BASE_URL + '/create_file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                const storedData = JSON.parse(window.sessionStorage.getItem(`directory-${directoryId}`))
                if (storedData && storedData['valid']) {
                    storedData['valid'] = false
                    window.sessionStorage.setItem(`directory-${directoryId}`, JSON.stringify(storedData))
                }
                const newDirectoryInfo = {
                    id: directoryInfo['id'],
                    name: directoryInfo['name'],
                    files: [...directoryInfo['files'], res.data],
                    subdirectories: directoryInfo['subdirectories']
                }
                setDirectoryInfo(newDirectoryInfo)
            })
        } 
        catch (err) {
            console.log(err)
        }
        finally {
            closeAllAddMenus()
        }
    }, [directoryInfo, selectedFile])

    const onDeleteFolderClick = useCallback(async () => {
        const directory = directoryInfo['subdirectories'][selectedSubdirectory]
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/delete_directory', {
                params: {
                    username: userDetails.current['username'],
                    windowId: windowId.current,
                    directoryId: directory['id'],
                    directoryName: directory['name']
                }
            })
            .then(res => {
                const storedData = JSON.parse(window.sessionStorage.getItem(`directory-${directoryId}`))
                if (storedData && storedData['valid']) {
                    storedData['valid'] = false
                    window.sessionStorage.setItem(`directory-${directoryId}`, JSON.stringify(storedData))
                }
                openNewDirectory(directoryId, layer - 1)
                loadDirectory()
            })
        } 
        catch (err) {
            console.log(err)
        }
        finally {
            closeAllAddMenus()
        }
    }, [directoryInfo, selectedSubdirectory])

    const onDeleteFileClick = async(file) => {
        try {
            await axios.get(process.env.REACT_APP_SERVER_BASE_URL + '/delete_file', {
                params: {
                    username: userDetails.current['username'],
                    windowId: windowId.current,
                    fileId: file['id'],
                    fileName: file['name'],
                    fileS3Name: file['s3Name']
                }
            })
            .then(res => {
                const storedData = JSON.parse(window.sessionStorage.getItem(`directory-${directoryId}`))
                if (storedData && storedData['valid']) {
                    storedData['valid'] = false
                    window.sessionStorage.setItem(`directory-${directoryId}`, JSON.stringify(storedData))
                }
                loadDirectory()
            })
        } 
        catch (err) {
            console.log(err)
        }
        finally {
            setTimeout(() => { 
                const toClick = document.getElementById('file-preview-header')
                if (toClick) {
                    toClick.click()
                }
            }, 500)
        }
    }

    const getFileIcon = (file) => {
        let source = null;
        if (file['contentType'].includes('image')) {
            source = imageIcon
        } else if (file['contentType'].includes('video')) {
            source = videoIcon
        } else if (file['contentType'].includes('audio')) {
            source = audioIcon
        } else {
            source = fileIcon
        }
        return source
    }

    return (
        <div className='directory-layer-container' id={`directory-container-${layer}`}>
            <div className='directory-layer-header'>
                <div className='directory-layer-header-side' style={{marginRight: 'auto'}}></div>
                <h3>{layer === 0? '/' : directoryInfo['name']}</h3>
                <div className='directory-layer-header-side' style={{marginLeft: 'auto'}}>
                    <button className='add-folder-button' onClick={onAddFolderIconClick}></button>
                    <button className='add-file-button' onClick={onAddFileIconClick}></button>
                </div>
            </div>
            <div>
                <div className='directory-add-container' style={{display: (showAddFileMenu || showAddFolderMenu || showDeleteFolderMenu) ? 'flex' : 'none'}} onClick={onAddContainerClick}>
                    <div className='directory-add-body' style={{display: showAddFolderMenu ? 'flex' : 'none'}}>
                        <input className='input-1' style={{width: '12.5vw'}} id={`add-folder-input-${layer}`} type='text' autoCapitalize='off' autoCorrect='off' autoComplete='off' placeholder='Folder name'></input>
                        <button className='button-1' onClick={onAddFolderClick}>Add</button>
                    </div>
                    <div className='directory-add-body' style={{display: showAddFileMenu ? 'flex' : 'none'}}>
                        <input style={{width: '12.5vw', height: '30px'}} id={`add-file-input-${layer}`} type='file' autoCapitalize='off' autoCorrect='off' autoComplete='off' placeholder='File name' onChange={onFileChange}></input>
                        <button className='button-1' onClick={onAddFileClick}>Add</button>
                    </div>
                    {
                        showDeleteFolderMenu ?
                        <div className='directory-add-body'>
                            <text style={{width: '12.5vw'}}>{`Delete ${directoryInfo['subdirectories'][selectedSubdirectory]['name']}?`}</text>
                            <button className='button-1' onClick={onDeleteFolderClick}>Delete</button>
                        </div> :
                        <></>
                    }
                </div>
                <div className='directory-layer-list'>
                    {
                        directoryInfo['subdirectories'].map((subdirectory, index) => {
                            return (
                            <div key={`subdirectory-container-${subdirectory['id']}`} style={{display: 'flex'}}>
                                <div
                                    key={`subdirectory-icon-${subdirectory['id']}`}
                                    className='directory-button-side' 
                                    style={{backgroundColor: selectedSubdirectory === index ? 'cyan' : 'transparent', borderRadius: selectedSubdirectory === index ? '5px 0 0 5px' : '0'}} 
                                >
                                    <img src={folderIcon} alt='folder-icon'></img>
                                </div>
                                <button 
                                    key={`subdirectory-button-${subdirectory['id']}`}
                                    className='directory-button' 
                                    style={{backgroundColor: selectedSubdirectory === index ? 'cyan' : 'transparent', width: selectedSubdirectory === index ? '66%' : '78%'}} 
                                    onClick={() => onSubdirectoryClick(subdirectory, index)}
                                >{subdirectory['name']}</button>
                                {
                                    selectedSubdirectory === index ? 
                                    <div 
                                        key={`subdirectory-trash-${subdirectory['id']}`}
                                        className='directory-button-side' 
                                        style={{backgroundColor: selectedSubdirectory === index ? 'cyan' : 'transparent'}}
                                    >
                                        <button onClick={onDeleteIconClick}></button>
                                    </div> :
                                    <></> 
                                }
                                <div 
                                    key={`subdirectory-arrow-${subdirectory['id']}`}
                                    className='directory-button-side' 
                                    style={{
                                        backgroundColor: selectedSubdirectory === index ? 'cyan' : 'transparent', 
                                        borderRadius: selectedSubdirectory === index ? '0 5px 5px 0' : '0',
                                        width: '10%',
                                        paddingRight: '0.3vw'
                                    }}
                                >
                                    {selectedSubdirectory === index ? '▸ ' : ''}
                                </div>
                            </div>
                            ) 
                        })
                    }
                    {
                        directoryInfo['files'].map((file, index) => {
                            return (
                            <div key={`file-container-${file['id']}`} style={{display: 'flex'}}>
                                <div
                                    key={`file-icon-${file['id']}`}
                                    className='directory-button-side' 
                                >
                                    <img src={getFileIcon(file)} alt='file-icon'></img>
                                </div>
                                <button key={`file-button-${file['id']}`} className='directory-button' style={{width: '78%'}} onClick={() => onFileClick(file)}>{file['name']}</button>
                                <div key={`file-arrow-${file['id']}`} className='directory-button-side'></div>
                            </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
};

export default DirectoryLayer;
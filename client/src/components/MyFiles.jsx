import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getMyFiles } from '../service'


const MyFiles = () => {
    const [files, setFiles] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        handleGetFiles()
    }, [])

    const handleGetFiles = useCallback(async () => {
        const { data, error } = await getMyFiles();
        if (error)
            return

        setFiles(data)
    }, [])

    const getFileName = useCallback((filename) => {
        return filename.replace('http://localhost:5000/uploads/', '').slice(0, -28).replaceAll('-', ' ').replaceAll('_', ' ')
    }, [files])

    const getFileCreatedDate = useCallback((filename) => {
        const date = filename.replace('http://localhost:5000/uploads/', '')
            .slice(-28)
            .slice(0, 10)
            .split('-')
            .reverse()
            .join('-')
        const createdAt = new Date(date)
        return createdAt.toDateString()
    }, [files])

    const handleClick = useCallback((file) => {
        const createdAt = getFileCreatedDate(file)
        navigate('/edited', {
            state: {
                file,
                createdAt
            }
        })
    }, [])


    return (
        <div className='container'>
            {
                files.length > 0 ?
                    <ul>
                        {
                            files.reverse().map((file, k) => (
                                <li key={k} className='file-li' onClick={() => handleClick(file)}>
                                    <p>{getFileName(file)}</p>
                                    <p style={{ fontSize: '12px' }}>Created At : {getFileCreatedDate(file)}</p>
                                </li>
                            ))
                        }
                    </ul>
                    :
                    <p className='center'>No Previous Files Found</p>
            }
        </div>
    )
}

export default MyFiles
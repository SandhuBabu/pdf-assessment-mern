import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Page } from 'react-pdf';
import PdfViewer from './PdfViewer';

/**
 * 
 * page for result of pdf operation and 
 * for viewing previously edited files
 * 
 */

const Success = () => {

    const navigate = useNavigate();
    const location = useLocation()
    const file = location.state?.file;
    const createdAt = location?.state?.createdAt
    const [pages, setPages] = useState(null)

    useEffect(() => {
        if (!file) {
            return navigate("/")
        }
    }, [])

    const onDocumentLoadSuccess = ({ numPages }) => {
        setPages(numPages)
    }

    const handleDownload = useCallback(() => {
        console.log(file);
        window.open(file, '_blank')
    }, [])

    return (
        <div className='container'>
            <h1 className='heading'>PDF Edited</h1>
            {
                createdAt &&
                <p>Created At: {createdAt}</p>
            }
            <button
                onClick={handleDownload}
                className='btn btn-primary'
            >Download</button>

            <PdfViewer onDocumentLoadSuccess={onDocumentLoadSuccess} file={file}>
                {
                    Array.from(new Array(pages), (_, index) => (
                        <div key={index} className='page'>
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                height={350}

                            />
                        </div>
                    ))
                }
            </PdfViewer>

            <div style={{ textAlign: 'center' }}>
                <button
                    className='btn btn-sec'
                    onClick={() => navigate('/')}
                >
                    Edit New File
                </button>
            </div>
        </div>
    )
}

export default Success
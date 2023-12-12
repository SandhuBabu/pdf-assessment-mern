import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router';
import { Page } from 'react-pdf';
import PdfViewer from './PdfViewer'
import { uploadFile } from '../service'
import './Form.css'


const Form = () => {

    const navigate = useNavigate();
    const [file, setFile] = useState(null)
    const [pages, setPages] = useState(0)
    const [pagesToRemove, setPagesToRemove] = useState([])

    const handleChange = useCallback((e) => {
        const doc = e.target.files[0];
        setFile(doc)
    }, [file])

    const onDocumentLoadSuccess = ({ numPages }) => {
        setPages(numPages)
    }

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault()

        // api req body
        const body = {
            file,
            pages: pagesToRemove.sort((a, b) => a - b).join(',') // page numbers to remove seperated by comma
        }

        const { data, error } = await uploadFile(body)
        if (error) {
            alert(data?.message)
            return
        }

        navigate('/edited', { state: { file: data?.fileUrl } })

    }, [pagesToRemove])

    const handleCheck = useCallback((index) => {
        // page no is counting from 0 to n
        if (pagesToRemove.indexOf(index) === -1) {
            setPagesToRemove(prev => [...prev, index])
        } else {
            let newValues = pagesToRemove.filter(i => i != index)
            setPagesToRemove([...newValues])
        }
    }, [pagesToRemove])

    return (
        <div className='container'>
            <form onSubmit={handleSubmit} className='upload-form'>
                <h1 className='heading'>Upload File</h1>

                <p>Choose File</p>
                <input onChange={handleChange} type="file" accept=".pdf" required />

                <button
                    className='btn btn-primary'
                    disabled={pagesToRemove.length === 0}
                >Remove Pages</button>
            </form>

            <PdfViewer onDocumentLoadSuccess={onDocumentLoadSuccess} file={file}>
                {
                    Array.from(new Array(pages), (_, index) => (
                        <div key={index} className='page'>
                            <Page
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                height={350}

                            />
                            <p className='remove-checks'>
                                Remove Page
                                <input
                                    type="checkbox"
                                    className='select-page'
                                    onChange={() => handleCheck(index)}
                                />
                            </p>
                        </div>
                    ))
                }
            </PdfViewer>
        </div>
    )
}

export default Form
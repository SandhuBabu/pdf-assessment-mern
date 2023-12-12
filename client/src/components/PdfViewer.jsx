import { Document } from 'react-pdf'

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

const PdfViewer = ({ children, onDocumentLoadSuccess, file }) => {
    // 'file' can File object or url of pdf file 
    return (
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <div className='pages'>
                {children}
            </div>
        </Document>
    )
}

export default PdfViewer
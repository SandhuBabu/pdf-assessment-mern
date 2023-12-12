const fs = require('fs')
const { PDFDocument } = require("pdf-lib");
const UserModal = require('../db/Users')



const handleRemove = async (req, res) => {
    try {
        const { file } = req.files;
        const pdf = await PDFDocument.load(file.data);

        // convert string pages numbers seperated by comma to a Array of type Numbers
        const pagesToRemove = req.body.pages.split(',').map(Number);

        // checks if the request is to remove all files from pdf
        // if yes return error all files can't be removed
        if (pdf.getPages().length === pagesToRemove.length) {
            return res.status(400).json({ message: "Can't delete all pages of a file" })
        }

        // unique date with time to save file name
        const currentDate = new Date().toISOString().replaceAll(/:/g, '-').replaceAll(/\./g, '-');

        const fileNameWithoutExtension = file.name.replace('.pdf', '');

        // path to store pdf file '/public/uploads/filename-date_with_time.pdf'
        const outputPath = `uploads/${fileNameWithoutExtension}-${currentDate}.pdf`.replaceAll(' ', '-');


        /**
         * when removing a page size of pdf decreases
         * so remove pageNo-1 after 1st page and pageNo-2 after second page
         * 
         */
        pagesToRemove.map((page, i) => {
            if (i == 0) {
                pdf.removePage(page)
            } else if (i == 1) {
                pdf.removePage(page - 1)
            } else {
                pdf.removePage(page - 2)
            }
        })

        const newpdf = await pdf.save()

        // save pdf file to fs
        fs.writeFileSync(`public/${outputPath}`, newpdf);

        // url of saved file to send response and save in db
        const fileUrl = `http://localhost:5000/${outputPath}`;

        // saving fileurl to db
        await updateUserFiles(req, fileUrl)

        return res.status(201).json({ fileUrl })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete pages" })
    }
}

// function to save newly created file url to db
const updateUserFiles = async (req, newFileUrl) => {
    let userdata = await UserModal.findOne({ email: req.user.email }).exec()
    userdata.files.push(newFileUrl)
    await UserModal.updateOne({ _id: userdata._id }, { files: userdata.files })
    return userdata.files
}

module.exports = { handleRemove }
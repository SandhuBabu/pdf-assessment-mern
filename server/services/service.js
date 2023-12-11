const fs = require('fs')
const { PDFDocument } = require("pdf-lib");
const UserModal = require('../db/Users')



const handleRemove = async (req, res) => {
    try {
        const { file } = req.files;
        const pdf = await PDFDocument.load(file.data);
        const pagesToRemove = req.body.pages.split(',').map(Number);

        if (pdf.getPages().length === pagesToRemove.length) {
            return res.status(400).json({ message: "Can't delete all pages of a file" })
        }

        const currentDate = new Date().toISOString().replaceAll(/:/g, '-').replaceAll(/\./g, '-');
        const fileNameWithoutExtension = file.name.replace('.pdf', '');
        const outputPath = `uploads/${fileNameWithoutExtension}-${currentDate}.pdf`.replaceAll(' ', '-');


        /**
         * when removing a page
         * size of pdf decreases
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
        fs.writeFileSync(`public/${outputPath}`, newpdf);

        const fileUrl = `http://localhost:5000/${outputPath}`;
        await updateUserFiles(req, fileUrl)
        return res.status(201).json({ fileUrl })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete pages" })
    }
}

const updateUserFiles = async (req, newFileUrl) => {
    let userdata = await UserModal.findOne({ email: req.user.email }).exec()
    userdata.files.push(newFileUrl)
    await UserModal.updateOne({ _id: userdata._id }, { files: userdata.files })
    return userdata.files
}

module.exports = { handleRemove }
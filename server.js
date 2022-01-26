require('dotenv').config()
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const database = require('./database')
const s3 = require('./s3')

const app = express()

const upload = multer({ dest: 'images/'})

app.use(express.static(path.join(__dirname, 'build')))

// app.get("/", (req, res) => {
//     res.send("my app!")
// })

app.use('/images', express.static('images'))


app.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName
    const readStream = s3.getFileStream(imageName)
    readStream.pipe(res)
})

app.get('/api/images', async (req, res) => {
    const images = await database.getImages()
    res.send({images})
} )


app.post('/api/images', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path
    const description = req.body.description
    const filename = req.file.filename 

    await s3.uploadFile(imagePath, filename)
    await unlinkFile(imagePath)

    const image = await database.addImage(imagePath, description)
    res.send({image})
})

const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on port ${port}`))
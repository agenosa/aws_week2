const express = require('express')
const multer = require('multer')
const fs = require('fs')

const app = express()

const upload = multer({ dest: 'images/'})

app.get("/", (req, res) => {
    res.send("my app!")
})

// app.use('/images', express.static('images'))


app.get('/images/:imageName', (req, res) => {
    const imageName = req.params.imageName
  
    const readStream = fs.createReadStream(`images/${imageName}`)
    readStream.pipe(res)
})



app.post('/api/images', upload.single('image'), (req, res) => {
    const imagePath = req.file.path
    const description = req.body.description
    console.log(description, imagePath, req.file);
    res.send({description, imagePath})
})


const port = process.env.PORT || 8080
app.listen(port, () => console.log(`listening on port ${port}`))
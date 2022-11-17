var express = require('express');
var app = express();

//CONFIG SECTION
const PORT = 3000;
const PUBLIC_FOLDER = "public";
const VIEWS_FOLDER = "views";

//define static folder
app.use(express.static(PUBLIC_FOLDER));

//send index
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/${VIEWS_FOLDER}/index.html`)
})

//Start the server
app.listen(PORT, () => {
    console.log(`Listen on ${PORT}`)
})
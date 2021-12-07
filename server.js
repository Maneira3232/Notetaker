const express = require('express');
const path = require('path');
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', function(err, data) {
        res.json(JSON.parse(data))
    })
});

app.post('/api/notes', (req, res) => {
    console.log(req.body)
    var title = req.body.title
    var text = req.body.text
    var newNoteObj = {
        title,
        text,
        id: uuidv4()
    }
    fs.readFile('./db/db.json' , function (err, data) {
        var currentNotes = JSON.parse(data)
        currentNotes.push(newNoteObj)
        fs.writeFile('./db/db.json', JSON.stringify(currentNotes), function (err) {
            console.log('New NoteSsaved')
        })
    })
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
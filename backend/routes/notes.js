const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require("../models/Notes");
const { body, validationResult } = require('express-validator');

//Route 1: fetch all notes
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
// Route 2 : Add a new note
router.post('/addnote', fetchuser, [
    body('title', 'min length is 3').isLength({ min: 3 }),
    body('description', 'min length is 5').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }
        const { title, description, tag } = req.body;
        const note = Notes({
            title, description, tag, user: req.user.id
        });
        const savedNotes = await note.save();
        res.json(savedNotes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// Route 3 : Update an existing notes
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // create a newNote object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Fonud") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})

// Route 4 : Delete an existing notes
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Fonud") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);

        res.json({ "Success": "Note has been Deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }

})

module.exports = router;
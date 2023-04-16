const express = require('express')
const router = express.Router()
const fetchUser = require('../middleware/fetchUser')
const Notes = require('../models/Note')
const { body, validationResult } = require('express-validator');


// Route 1 : Get all the notes /api/notes/getallnotes. Login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Some error occured')
    }
})
// Route 2 : Adding a note using post on /api/notes/addnote. Login required
router.post('/addnote', fetchUser, [
    body('title', 'Enter a vaild title').isLength({ min: 3 }),
    body('desc', 'Enter a valid desc').isLength({ min: 5 }),
], async (req, res) => {
    try {


        const { title, desc, tags } = req.body
        //if there are error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, desc, tags, user: req.id
        })

        const saveNote = await note.save()

        res.json(saveNote)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Some error occured')
    }
})

// Route 3 : update an existing note using put on /api/notes/updatenote. Login required
router.put('/updatenote/:id', fetchUser,
    async (req, res) => {
        const { title, desc, tags } = req.body
        try {


            //create a newNote object
            const newNote = {}

            if (title) { newNote.title = title }
            if (desc) { newNote.desc = desc }
            if (tags) { newNote.tags = tags }

            //find the note to be update and update it

            let note = await Notes.findById(req.params.id)
            if (!note) {
                return res.status(404).send('Not found')
            }
            //Alow updation only if user owns it
            if (note.user.toString() !== req.id) {
                return res.status(401).send('Not allowed')

            }

            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
            res.json({ note })
        } catch (error) {
            console.error(error.message)
            res.status(500).send('Some error occured')
        }

    })

// Route 4 : delete an existing note using delete on /api/notes/deletnote. Login required
router.delete('/deletenote/:id', fetchUser,
    async (req, res) => {
        const { title, desc, tag } = req.body
        try {


            //find the note to be delete and delete it

            let note = await Notes.findById(req.params.id)
            if (!note) {
                return res.status(404).send('Not found')
            }

            //Alow deletion only if user owns it
            if (note.user.toString() !== req.id) {
                return res.status(401).send('Not allowed')

            }

            note = await Notes.findByIdAndDelete(req.params.id)
            res.json({ 'Sucess': 'note has been deleted', note: note })

        } catch (error) {
            console.error(error.message)
            res.status(500).send('Some error occured')
        }
    })







module.exports = router
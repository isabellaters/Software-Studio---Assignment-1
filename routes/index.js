﻿const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const { ensureAuthenticated } = require('../config/auth')

//Add Data for Fines
const chance = require('chance').Chance()
const shuffleArray = require('shuffle-array')

router.get('/', async (req, res) => {
    let books
    try {
        books = await Book.find().sort({ createAt: 'desc' }).limit(10).exec()
    } catch {
        books = []
    }
    res.render('index', { books: books })

})


//Dashboard Page

router.get('/dashboard', ensureAuthenticated,(req, res) => 
res.render('dashboard', {
    name: req.user.name
}))


//Fine Page

const data = {
    headers: ["Name", "Book", "Price"],
    rows: new Array(10).fill(undefined).map(() => {
        return [
            chance.name(),
            chance.profession(),
            chance.age(),
        ]
    })
};

router.get('/finesdata',(req, res) => {
    res.json({
        headers: data.headers,
        rows: shuffleArray(data.rows),
        lastUpdated: new Date().toISOString()
    })
});

router.get('/fines', (req, res) => {
    res.render('fines')
})

module.exports = router 
const express = require('express');

const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcryptjs');

//Register Page
router.get('/register',(req, res) => res.render('users/register'));

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all fields'})
    }

    //Check password match
    if(password !== password2) {
        errors.push({ msg: 'Password do not match'})
    }

    if(errors.length > 0) {
        res.render('users/register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation Passed
        User.findOne( {email: email})
        .then(user => {
            if(user) {
                // User exists
                errors.push({ msg: 'Email is already registered'})
                res.render('users/register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                })

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        // Save User
                        newUser.save()
                            .then(user => {
                                res.redirect('/login')
                            })
                            .catch(err => console.log(err))

                }))
            }
        })    
    }

})

module.exports = router;
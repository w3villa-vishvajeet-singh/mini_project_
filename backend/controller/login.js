const { validationResult } = require('express-validator');
const db = require('../config/dbConnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { queries } = require('../../backend/helper/queries');
require('dotenv').config();

const login = (req, res) => {
    console.log('Received payload:', req.body); // Log received payload

    // Check for validation errors
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     console.error('Validation errors:', errors.array()); // Log validation errors
    //     return res.status(400).json({ errors: errors.array() });
    // }

    const { email, password } = req.body;
    console.log('req:', req.body); 

    // Validate presence of required fields
    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }

    // Query to check if the user exists
    db.query(queries.checkUserExists(email), [email], (err, result) => {
        if (err) {
            console.error('Database query error:', err); // Log database query errors
            return res.status(500).send({ msg: 'Database query error' });
        }

        if (!result.length) {
            return res.status(202).send({ msg: 'You have not created your account' });
        }

        const user = result[0];
        const verification_hash = user.verification_hash;
        console.log("Verification hash is:", verification_hash); // Log verification hash

        if (user.next_action === 'mobile_verify') {
            return res.status(201).send({ msg: 'Please complete the mobile verification process before accessing the dashboard.', verification_hash });
        }

        // Compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err); // Log password comparison errors
                return res.status(500).send({ msg: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(202).send({ msg: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log('Generated token:', token); // Log generated token                                                                      

            return res.status(200).json({ msg: 'Login successful', token });
        });
    });
};

module.exports = { login };

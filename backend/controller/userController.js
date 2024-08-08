const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const otplib = require('otplib');
const sendMail = require("../helper/sendMail");
const sendOtp = require("../helper/sendOtp");
const router = require("../routes/userRoutes");

const register = async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const email = db.escape(req.body.email);

    db.query('SELECT * FROM user_verification_table WHERE LOWER(email) = LOWER(?)', [email], (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ msg: 'Database query error' });
        }
        if (result.length) {
            return res.status(409).json({ msg: 'The Email already exists' });
        } else {
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if (err) {
                    console.error('Error in generating hash password:', err);
                    return res.status(500).json({ msg: 'Hashing error', error: err });
                }

                // Generate unique reference ID
                const uniqueReferenceId = crypto.randomBytes(16).toString('hex');

                // Generate OTP
                otplib.authenticator.options = { digits: 6, step: 600 }; // 10 minutes
                const secret = otplib.authenticator.generateSecret();
                const mobileOtp = otplib.authenticator.generate(secret);

                const verificationToken = crypto.randomBytes(32).toString('hex');
                const verificationHash = crypto.createHash('sha256').update(verificationToken).digest('hex');

                const userData = JSON.stringify({
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    mobileNumber: req.body.mobileNumber
                });

                const query = `
                    INSERT INTO user_verification_table (
                        unique_reference_id, verification_hash, user_data, expire_at, mobile_otp, email
                    ) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 50 MINUTE), ?, ?)`;

                db.query(query, [uniqueReferenceId, verificationHash, userData, mobileOtp, req.body.email], async (err, result) => {
                    if (err) {
                        console.error('Database insert error:', err);
                        return res.status(500).json({ msg: 'Database insert error', error: err });
                    }

                    // Send verification email
                    const mailSubject = 'Mail Verification';
                    const content = `<p>Please click the link below to verify your email:<br/><a href="http://localhost:3000/verfiy/verify_email?token=${verificationHash}">Verify your email</a></p>`;
                    await sendMail(req.body.email, mailSubject, content);

                    // Send OTP via SMS
                    try {
                        await sendOtp(req.body.mobileNumber, mobileOtp);
                        return res.status(201).json({ msg: 'User registered successfully. Please check your email and mobile for verification.' });
                    } catch (error) {
                        console.error('Error sending OTP:', error);
                        return res.status(500).json({ msg: 'User registered, but failed to send OTP', error });
                    }
                });
            });
        }
    });
};

module.exports = { register };

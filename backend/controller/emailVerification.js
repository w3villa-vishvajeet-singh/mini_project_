const db = require('../config/dbConnection')
const userQueries = require('../helper/email_verify_queries');

const verifyEmail = (req, res) => {
    const token = req.query.token;

    if (!token) {
        console.error('No token provided.');
        return res.status(400).json({ msg: 'Invalid verification link' });
    }

    userQueries.getVerificationRecordByToken(token, (err, result) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ msg: 'Database query error' });
        }
        if (!result.length) {
            console.error('Invalid verification link:', token);
            return res.status(400).json({ msg: 'Invalid verification link' });
        }

        const verificationRecord = result[0];
        const currentTime = new Date();

        if (currentTime > new Date(verificationRecord.expire_at)) {
            console.log('Verification time expired:', token);
            return res.status(400).json({ msg: 'Email verification time expired' });
        }

        if (verificationRecord.is_email_verified && verificationRecord.is_processed) {
            return res.status(200).json({ msg: 'Email has already been verified. Please verify your mobile number.', redirectToLogin: true });
        }

        if (!verificationRecord.is_email_verified) {
            userQueries.updateVerificationStatus(token, (err) => {
                if (err) {
                    console.error('Database update error:', err);
                    return res.status(500).json({ msg: 'Database update error' });
                }

                userQueries.getUserByEmail(verificationRecord.email, (err, userResult) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return res.status(500).json({ msg: 'Database query error' });
                    }

                    if (userResult.length > 0) {
                        console.log('User already exists:', verificationRecord.email);
                        return res.status(200).json({ msg: 'Email verified successfully. User already exists. Please verify your mobile number.' });
                    }

                    if (verificationRecord.is_mobile_verified) {
                        const userData = JSON.parse(verificationRecord.user_data);
                        userQueries.insertUser(userData, (err) => {
                            if (err) {
                                console.error('Database insert error:', err);
                                return res.status(500).json({ msg: 'Database insert error' });
                            }
                            
                            return res.status(200).json({ msg: 'Email verified and user created successfully', redirectToLogin: true });
                        });
                    } else {
                        return res.status(200).json({ msg: 'Email verified successfully. Please verify your mobile number.', redirectToOTP: true });
                    }
                });
            });
        } else {
            return res.status(200).json({ msg: 'Email verification status updated. Please verify your mobile number.' });
        }
    });
};

module.exports = { verifyEmail };


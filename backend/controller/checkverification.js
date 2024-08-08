const sendOtp = require('../helper/sendOtp');
const checkVerifyQueries = require('../helper/check_verification_queries');

const checkVerification = (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the user table
    checkVerifyQueries.checkEmailInUserTable(email, (err, userResult) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ msg: 'Database query error' });
        }

        if (userResult && userResult.length) {
            // Email exists in user table, redirect to login
            return res.json({ redirectToLogin: true });
        }

        // Check if the email exists in the verification table
        checkVerificationTable(email, res);
    });
};

const checkVerificationTable = (email, res) => {
    checkVerifyQueries.checkEmailInVerificationTable(email, (err, verificationResult) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ msg: 'Database query error' });
        }

        if (verificationResult && verificationResult.length) {
            const { is_email_verified, is_mobile_verified, is_processed, mobileNumber } = verificationResult[0];
            console.log('Verification result:', verificationResult[0]);

            if (is_email_verified && is_mobile_verified) {
                if (is_processed) {
                    return res.json({ redirectToLogin: true });
                }
                sendOtp(mobileNumber, res);
            } else if (is_email_verified) {
                sendOtp(mobileNumber, res);
            } else {
                return res.json({ redirectToOTP: false });
            }
        } else {
            return res.json({ redirectToOTP: false });
        }
    });
};

module.exports = { checkVerification };

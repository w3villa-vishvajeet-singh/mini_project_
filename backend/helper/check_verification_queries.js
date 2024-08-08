const conn = require('../config/dbConnection');

// Function to check if the email exists in the user table
const checkEmailInUserTable = (email, callback) => {
    conn.query('SELECT email FROM user_table WHERE email = ?', [email], callback);
};

// Function to check the verification table
const checkEmailInVerificationTable = (email, callback) => {
    conn.query('SELECT is_email_verified, is_mobile_verified, is_processed, mobileNumber FROM user_verification_table WHERE email = ?', [email], callback);
};

// Function to update OTP in the verification table
const updateOTP = (email, otp, callback) => {
    const query = 'UPDATE user_verification_table SET mobile_otp = ? WHERE email = ?';
    conn.query(query, [otp, email], callback);
};

module.exports = {
    checkEmailInUserTable,
    checkEmailInVerificationTable,
    updateOTP
};

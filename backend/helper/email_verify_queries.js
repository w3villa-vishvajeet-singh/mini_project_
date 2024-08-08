const db = require('../config/dbConnection');

// Function to get verification record by token
const getVerificationRecordByToken = (token, callback) => {
    db.query('SELECT * FROM user_verification_table WHERE verification_hash = ?', [token], callback);
};

// Function to update verification status
const updateVerificationStatus = (token, callback) => {
    db.query('UPDATE user_verification_table SET is_email_verified = true, email_verified_at = NOW(), is_processed = true WHERE verification_hash = ?', [token], callback);
};

// Function to check if a user exists by email
const getUserByEmail = (email, callback) => {
    db.query('SELECT * FROM user_table WHERE email = ?', [email], callback);
};

// Function to insert a new user
const insertUser = (userData, callback) => {
    db.query('INSERT INTO user_table (username, email, password, mobile_number) VALUES (?, ?, ?, ?)', 
        [userData.username, userData.email, userData.password, userData.mobileNumber], 
        callback
    );
};

module.exports = {
    getVerificationRecordByToken,
    updateVerificationStatus,
    getUserByEmail,
    insertUser
};

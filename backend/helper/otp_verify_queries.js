// verifyOtpQueries.js
const getVerificationRecordByToken = 'SELECT * FROM user_verification_table WHERE verification_hash = ?';
const checkUserExistence = 'SELECT * FROM user_table WHERE email = ? OR mobile_number = ?';
const updateMobileVerificationStatus = 'UPDATE user_verification_table SET is_mobile_verified = true, mobile_verified_at = NOW() WHERE verification_hash = ?';
const insertUser = 'INSERT INTO user_table (username, email, password, mobile_number) VALUES (?, ?, ?, ?)';

module.exports = {
  getVerificationRecordByToken,
  checkUserExistence,
  updateMobileVerificationStatus,
  insertUser
};

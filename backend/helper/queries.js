const queries = {
    // Check if the user exists in the user_table by email
    checkUserExists: (email) => `
        SELECT * FROM user_table WHERE LOWER(email) = LOWER(?);
    `,
    // Check if the verification record exists by verification_hash
    getVerificationRecord: (verificationHash) => `
        SELECT * FROM user_verification_table WHERE verification_hash = ?;
    `
};

module.exports = {
    queries
};
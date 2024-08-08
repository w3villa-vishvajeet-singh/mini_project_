const db = require('../config/dbConnection');
const queries = require('../helper/otp_verify_queries');

const verifyOtp = (req, res) => {
  const { otp: userOtp } = req.body;

  if (!userOtp) {
    console.error('Missing OTP in request body:', { userOtp });
    return res.status(400).json({ msg: 'OTP is required' });
  }

  console.log('Received OTP:', userOtp);

  db.query(queries.getVerificationRecordByOtp, [userOtp], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ msg: 'Database query error' });
    }

    if (!result || result.length === 0) {
      console.log('Invalid OTP:', userOtp);
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    const verificationRecord = result[0];
    const userData = JSON.parse(verificationRecord.user_data);
    const mobileNumber = userData.mobileNumber;

    db.beginTransaction((err) => {
      if (err) {
        console.error('Database transaction error:', err);
        return res.status(500).json({ msg: 'Database transaction error' });
      }

      db.query(queries.checkUserExistence, [userData.email, mobileNumber], (err, userCheckResult) => {
        if (err) {
          return db.rollback(() => {
            console.error('Database user check error:', err);
            return res.status(500).json({ msg: 'Database user check error' });
          });
        }

        if (userCheckResult.length > 0) {
          console.log('User already exists:', userData.email);
          return db.rollback(() => {
            res.status(400).json({ msg: 'User already exists' });
          });
        }

        db.query(queries.updateMobileVerificationStatus, [userData.email], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Database update error:', err);
              return res.status(500).json({ msg: 'Database update error' });
            });
          }

          db.query(queries.insertUser, 
            [userData.username, userData.email, userData.password, mobileNumber], 
            (err) => {
              if (err) {
                return db.rollback(() => {
                  console.error('Database insert error:', err);
                  return res.status(500).json({ msg: 'Database insert error' });
                });
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Database commit error:', err);
                    return res.status(500).json({ msg: 'Database commit error' });
                  });
                }

                console.log('OTP verified and user created successfully');
                return res.status(200).json({ msg: 'OTP verified and user created successfully' });
              });
            }
          );
        });
      });
    });
  });
};

module.exports = { verifyOtp };

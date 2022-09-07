const bcrypt = require('bcrypt');


async function verifyPassword() {
  const myPassword = 'admin123';
  const hash = '$2b$10$x3a0aBTMXDz68Qq6f6TRd.MZzTTSmbkJfbRf/.j9YticKYQeLs1y.';
  const isMatch = await bcrypt.compare(myPassword, hash);
  console.log(isMatch);
}

verifyPassword();


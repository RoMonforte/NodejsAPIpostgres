const jwt = require('jsonwebtoken');

const secret = 'myCat';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiIiLCJpYXQiOjE2NjI3NDg5MDN9.QUGFwSmUQ3FFUFft-BGzk8vZa2Ieq5skOv1jwXUFe-A';


function verifyToken (token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);
console.log(payload);

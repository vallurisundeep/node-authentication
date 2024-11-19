const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
// Replace with your actual token
const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzMxOTg4NTI2LCJleHAiOjE3MzI1OTMzMjZ9.UXx8O1QEj9fYFuU2rBHZneNV3HcTvDflcDLVO4HLnV0";
const JWT_REFRESH_SECRET = "d66f9d19f7cea7ce822fb23f8c7c740953fe4e3ba11ae211668d1a7c09b97ea2c52e850cae976ff1271011bc761c7ff2d8f0c7aeedbfd5bde52691c958c8119f"; // Replace with your secret

try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    console.log("Decoded Refresh Token:", decoded);}
     catch (err) {
    console.error('Token verification error:', err.message);
}

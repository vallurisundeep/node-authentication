const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
// Replace with your actual token
const refreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ2YWxsdXJpc3VuZGVlcEBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzMwODEyNzUsImV4cCI6MTczMzA4NDg3NX0.KRnbLxa_ry_E2EAKbYcG09BATKREgVzYsSOKXHIgWTk";
const JWT_REFRESH_SECRET = "b1485b0dd6d3d417ddffc914f53de391da8430171669fe950c5901e0ec8a6adb0721afbc69d897cae0bff36f20e39d867dedde42bee24810a5f8ff50719033f0"; // Replace with your secret

try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    console.log("Decoded Refresh Token:", decoded);}
     catch (err) {
    console.error('Token verification error:', err.message);
}

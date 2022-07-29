import jwt from 'jsonwebtoken';

const generateAccessToken = (data, exitsTime = '1h') =>
   jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: exitsTime });

const generateRefreshToken = (data, exitsTime = '30d') =>
   jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, { expiresIn: exitsTime });

const verifyRefreshToken = (refreshToken, callbackHanlder) => {
   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, callbackHanlder);
};

export { generateAccessToken, generateRefreshToken, verifyRefreshToken };

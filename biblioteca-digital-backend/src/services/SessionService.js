import { ForbiddenError, UnauthorizedError } from "../errors/baseErrors.js";
import UserModel from "../models/UserModel.js";
import UserSessionTokenModel from "../models/UserSessionTokenModel.js";
import formatExpiresAt from "../utils/general/formatExpiresAt.js";
import { comparePasswords } from "../utils/libs/bcrypt.js";
import { decodeRefreshToken, signSessionJwts } from "../utils/libs/jwt.js";

export async function processLogin({ email, password, token }) {
  console.log('Login attempt:', { email, hasPassword: !!password });

  const foundUser = await UserModel.findOne({ email })
    .select("+password")
    .lean()
    .exec();
  
  console.log('Found user:', { 
    found: !!foundUser, 
    hasStoredPassword: foundUser ? !!foundUser.password : false 
  });
  
  if (!foundUser) throw new UnauthorizedError("Email ou senha incorretos");
  
  // Evaluate password
  console.log('Comparing passwords:', {
    inputPasswordLength: password?.length,
    storedPasswordLength: foundUser.password?.length
  });
  
  const isMatch = await comparePasswords(password, foundUser.password);
  console.log('Password comparison:', { isMatch });
  
  if (!isMatch) throw new UnauthorizedError("Email ou senha incorretos");

  // Evaluate token reuse
  if (token) {
    const foundToken = await UserSessionTokenModel.findOne({
      token,
    }).exec();

    // Detected refresh token reuse! Clear all existing refreshTokens
    if (!foundToken)
      await UserSessionTokenModel.deleteMany({ user: foundUser._id });
  }

  // Takes off only the necessary info about the user

  const { createdAt, updatedAt, password: pass, ...tokenUserData } = foundUser;

  // Create JWTs
  const { accessToken, refreshToken } = signSessionJwts(tokenUserData);

  // Saving refreshToken in the DB
  const expiresAt = formatExpiresAt(process.env.REFRESH_TOKEN_EXPIRE); // in seconds
  await UserSessionTokenModel.create({
    user: foundUser._id,
    token: refreshToken,
    expiresAt,
  });
  return { accessToken, refreshToken };
}

export async function processRefreshToken(token) {
  if (!token) throw new UnauthorizedError("Unauthorized");

  const decoded = await decodeRefreshToken(token);
  const foundToken = await UserSessionTokenModel.findOne({ token }).exec();

  if (!foundToken) {
    const hackedUser = await UserModel.findOne({
      _id: decoded.userId,
    }).exec();

    await UserSessionTokenModel.deleteMany({ user: hackedUser._id }).exec();
    throw new ForbiddenError("Token reuse");
  }

  const userId = foundToken.user._id.toString();
  if (userId !== decoded.userId) throw new ForbiddenError("Tampered token");

  // Refresh token still valid
  await foundToken.deleteOne(); // Invalidate actual refresh token

  const {
    createdAt,
    updatedAt,
    password: pass,
    ...tokenUserData
  } = foundToken.user.toObject({ virtuals: true }); // It is necessary to use "toObject" because foundToken is a mongoose document

  // Create JWTs
  const { accessToken, refreshToken } = signSessionJwts(tokenUserData);

  // Creating a instance of the refresh token in the db
  const expiresAt = formatExpiresAt(process.env.REFRESH_TOKEN_EXPIRE); // in miliseconds
  await UserSessionTokenModel.create({
    user: userId,
    token: refreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken };
}

export async function deleteUserToken(token) {
  return UserSessionTokenModel.findOneAndDelete({ token }).exec();
}

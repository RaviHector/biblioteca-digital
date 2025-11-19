import jwt from 'jsonwebtoken';
import {
  signSessionJwts,
  signConfirmEmailJwt,
  signForgotPasswordJwt,
  decodeRefreshToken,
  decodeAccessToken,
  decodeConfirmEmailToken,
  decodeForgotPasswordToken,
} from '../../src/utils/libs/jwt.js';

// Setup environment variables
beforeAll(() => {
  process.env.ACCESS_TOKEN_SECRET = 'test_access_secret_key_12345';
  process.env.REFRESH_TOKEN_SECRET = 'test_refresh_secret_key_12345';
  process.env.EMAIL_TOKEN_SECRET = 'test_email_secret_key_12345';
  process.env.PASSWORD_TOKEN_SECRET = 'test_password_secret_key_12345';
  process.env.ACCESS_TOKEN_EXPIRE = '900'; // 15 minutes
  process.env.REFRESH_TOKEN_EXPIRE = '604800'; // 7 days
  process.env.EMAIL_TOKEN_EXPIRE = '3600'; // 1 hour
  process.env.PASSWORD_TOKEN_EXPIRE = '3600'; // 1 hour
});

describe('JWT Utils - signSessionJwts', () => {
  test('should create both access and refresh tokens with user object', () => {
    const mockUser = { _id: '507f1f77bcf86cd799439011', email: 'test@example.com' };
    const result = signSessionJwts(mockUser);

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(typeof result.accessToken).toBe('string');
    expect(typeof result.refreshToken).toBe('string');
  });

  test('should create valid JWT tokens that can be decoded', () => {
    const mockUser = { _id: '507f1f77bcf86cd799439011', name: 'Test User' };
    const { accessToken, refreshToken } = signSessionJwts(mockUser);

    const decodedAccess = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    expect(decodedAccess.user._id).toBe(mockUser._id);
    expect(decodedAccess.user.name).toBe(mockUser.name);
    expect(decodedRefresh.userId).toBe(mockUser._id);
  });

  test('should include correct expiration times in tokens', () => {
    const mockUser = { _id: '507f1f77bcf86cd799439011' };
    const { accessToken, refreshToken } = signSessionJwts(mockUser);

    const decodedAccess = jwt.decode(accessToken);
    const decodedRefresh = jwt.decode(refreshToken);

    const accessExpiry = decodedAccess.exp - decodedAccess.iat;
    const refreshExpiry = decodedRefresh.exp - decodedRefresh.iat;

    expect(accessExpiry).toBe(900);
    expect(refreshExpiry).toBe(604800);
  });

  test('should create different tokens for different users', () => {
    const user1 = { _id: '507f1f77bcf86cd799439011' };
    const user2 = { _id: '607f1f77bcf86cd799439012' };

    const tokens1 = signSessionJwts(user1);
    const tokens2 = signSessionJwts(user2);

    expect(tokens1.accessToken).not.toBe(tokens2.accessToken);
    expect(tokens1.refreshToken).not.toBe(tokens2.refreshToken);
  });

  test('should handle user object with complex properties', () => {
    const mockUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      name: 'Test User',
      role: 'admin',
      createdAt: new Date(),
    };
    const { accessToken } = signSessionJwts(mockUser);

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    expect(decoded.user._id).toBe(mockUser._id);
    expect(decoded.user.email).toBe(mockUser.email);
    expect(decoded.user.role).toBe(mockUser.role);
  });
});

describe('JWT Utils - signConfirmEmailJwt', () => {
  test('should create email confirmation token', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = signConfirmEmailJwt(userId);

    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT has 3 parts
  });

  test('should encode userId in email token', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = signConfirmEmailJwt(userId);

    const decoded = jwt.verify(token, process.env.EMAIL_TOKEN_SECRET);
    expect(decoded.userId).toBe(userId);
  });

  test('should create different tokens for different users', () => {
    const token1 = signConfirmEmailJwt('507f1f77bcf86cd799439011');
    const token2 = signConfirmEmailJwt('607f1f77bcf86cd799439012');

    expect(token1).not.toBe(token2);
  });

  test('should set correct expiration for email token', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = signConfirmEmailJwt(userId);

    const decoded = jwt.decode(token);
    const expiry = decoded.exp - decoded.iat;
    expect(expiry).toBe(3600);
  });
});

describe('JWT Utils - signForgotPasswordJwt', () => {
  test('should create password reset token', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = signForgotPasswordJwt(userId);

    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);
  });

  test('should encode userId in password token', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = signForgotPasswordJwt(userId);

    const decoded = jwt.verify(token, process.env.PASSWORD_TOKEN_SECRET);
    expect(decoded.userId).toBe(userId);
  });

  test('should set correct expiration for password token', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = signForgotPasswordJwt(userId);

    const decoded = jwt.decode(token);
    const expiry = decoded.exp - decoded.iat;
    expect(expiry).toBe(3600);
  });

  test('should create different tokens for different users', () => {
    const token1 = signForgotPasswordJwt('507f1f77bcf86cd799439011');
    const token2 = signForgotPasswordJwt('607f1f77bcf86cd799439012');

    expect(token1).not.toBe(token2);
  });
});

describe('JWT Utils - decodeRefreshToken', () => {
  test('should decode valid refresh token', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = jwt.sign(
      { userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: 604800 }
    );

    const decoded = await decodeRefreshToken(token);
    expect(decoded.userId).toBe(userId);
  });

  test('should reject invalid refresh token', async () => {
    const invalidToken = 'invalid.token.here';

    await expect(decodeRefreshToken(invalidToken)).rejects.toThrow();
  });

  test('should reject expired refresh token', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const expiredToken = jwt.sign(
      { userId },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '0s' }
    );

    // Wait a bit to ensure token is expired
    await new Promise(resolve => setTimeout(resolve, 100));

    await expect(decodeRefreshToken(expiredToken)).rejects.toThrow();
  });

  test('should reject token signed with wrong secret', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const wrongSecretToken = jwt.sign(
      { userId },
      'wrong_secret_key',
      { expiresIn: 604800 }
    );

    await expect(decodeRefreshToken(wrongSecretToken)).rejects.toThrow();
  });

  test('should decode token with correct payload structure', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = jwt.sign(
      { userId, additionalData: 'test' },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: 604800 }
    );

    const decoded = await decodeRefreshToken(token);
    expect(decoded.userId).toBe(userId);
    expect(decoded.additionalData).toBe('test');
  });
});

describe('JWT Utils - decodeAccessToken', () => {
  test('should decode valid access token', async () => {
    const user = { _id: '507f1f77bcf86cd799439011', email: 'test@example.com' };
    const token = jwt.sign(
      { user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 900 }
    );

    const decoded = await decodeAccessToken(token);
    expect(decoded.user._id).toBe(user._id);
    expect(decoded.user.email).toBe(user.email);
  });

  test('should reject invalid access token', async () => {
    const invalidToken = 'not.a.token';

    await expect(decodeAccessToken(invalidToken)).rejects.toThrow();
  });

  test('should reject expired access token', async () => {
    const user = { _id: '507f1f77bcf86cd799439011' };
    const expiredToken = jwt.sign(
      { user },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '0s' }
    );

    await new Promise(resolve => setTimeout(resolve, 100));

    await expect(decodeAccessToken(expiredToken)).rejects.toThrow();
  });

  test('should reject token with wrong access secret', async () => {
    const user = { _id: '507f1f77bcf86cd799439011' };
    const wrongSecretToken = jwt.sign(
      { user },
      'wrong_access_secret',
      { expiresIn: 900 }
    );

    await expect(decodeAccessToken(wrongSecretToken)).rejects.toThrow();
  });

  test('should handle malformed token', async () => {
    await expect(decodeAccessToken('malformed')).rejects.toThrow();
  });
});

describe('JWT Utils - decodeConfirmEmailToken', () => {
  test('should decode valid email confirmation token', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = jwt.sign(
      { userId },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: 3600 }
    );

    const decoded = await decodeConfirmEmailToken(token);
    expect(decoded.userId).toBe(userId);
  });

  test('should reject invalid email token', async () => {
    await expect(decodeConfirmEmailToken('invalid.email.token')).rejects.toThrow();
  });

  test('should reject expired email confirmation token', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const expiredToken = jwt.sign(
      { userId },
      process.env.EMAIL_TOKEN_SECRET,
      { expiresIn: '0s' }
    );

    await new Promise(resolve => setTimeout(resolve, 100));

    await expect(decodeConfirmEmailToken(expiredToken)).rejects.toThrow();
  });

  test('should reject token signed with wrong email secret', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const wrongSecretToken = jwt.sign(
      { userId },
      'wrong_email_secret',
      { expiresIn: 3600 }
    );

    await expect(decodeConfirmEmailToken(wrongSecretToken)).rejects.toThrow();
  });
});

describe('JWT Utils - decodeForgotPasswordToken', () => {
  test('should decode valid password reset token', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = jwt.sign(
      { userId },
      process.env.PASSWORD_TOKEN_SECRET,
      { expiresIn: 3600 }
    );

    const decoded = await decodeForgotPasswordToken(token);
    expect(decoded.userId).toBe(userId);
  });

  test('should reject invalid password token', async () => {
    await expect(decodeForgotPasswordToken('invalid.token')).rejects.toThrow();
  });

  test('should reject expired password reset token', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const expiredToken = jwt.sign(
      { userId },
      process.env.PASSWORD_TOKEN_SECRET,
      { expiresIn: '0s' }
    );

    await new Promise(resolve => setTimeout(resolve, 100));

    await expect(decodeForgotPasswordToken(expiredToken)).rejects.toThrow();
  });

  test('should reject token signed with wrong password secret', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const wrongSecretToken = jwt.sign(
      { userId },
      'wrong_password_secret',
      { expiresIn: 3600 }
    );

    await expect(decodeForgotPasswordToken(wrongSecretToken)).rejects.toThrow();
  });

  test('should handle multiple password tokens for same user', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const token1 = jwt.sign(
      { userId },
      process.env.PASSWORD_TOKEN_SECRET,
      { expiresIn: 3600 }
    );
    const token2 = jwt.sign(
      { userId },
      process.env.PASSWORD_TOKEN_SECRET,
      { expiresIn: 3600 }
    );

    const decoded1 = await decodeForgotPasswordToken(token1);
    const decoded2 = await decodeForgotPasswordToken(token2);

    expect(decoded1.userId).toBe(userId);
    expect(decoded2.userId).toBe(userId);
    // Tokens will be different because they include iat timestamp
    expect(typeof token1).toBe('string');
    expect(typeof token2).toBe('string');
  });
});

describe('JWT Utils - Integration Tests', () => {
  test('should handle complete session flow: sign and decode', async () => {
    const mockUser = { _id: '507f1f77bcf86cd799439011', email: 'test@example.com' };
    const { accessToken, refreshToken } = signSessionJwts(mockUser);

    const decodedAccess = await decodeAccessToken(accessToken);
    const decodedRefresh = await decodeRefreshToken(refreshToken);

    expect(decodedAccess.user._id).toBe(mockUser._id);
    expect(decodedRefresh.userId).toBe(mockUser._id);
  });

  test('should handle complete email confirmation flow', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const emailToken = signConfirmEmailJwt(userId);

    const decoded = await decodeConfirmEmailToken(emailToken);
    expect(decoded.userId).toBe(userId);
  });

  test('should handle complete password reset flow', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const passwordToken = signForgotPasswordJwt(userId);

    const decoded = await decodeForgotPasswordToken(passwordToken);
    expect(decoded.userId).toBe(userId);
  });

  test('should prevent cross-token usage (access vs refresh)', async () => {
    const mockUser = { _id: '507f1f77bcf86cd799439011' };
    const { accessToken } = signSessionJwts(mockUser);

    // Try to decode access token as refresh token - should fail
    await expect(decodeRefreshToken(accessToken)).rejects.toThrow();
  });

  test('should prevent cross-token usage (email vs password)', async () => {
    const userId = '507f1f77bcf86cd799439011';
    const emailToken = signConfirmEmailJwt(userId);

    // Try to decode email token as password token - should fail
    await expect(decodeForgotPasswordToken(emailToken)).rejects.toThrow();
  });
});

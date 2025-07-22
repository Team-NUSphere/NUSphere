import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockVerifyIdToken, mockFindOne } = vi.hoisted(() => ({
    mockVerifyIdToken: vi.fn(),
    mockFindOne: vi.fn(),
  }));
  
  vi.mock('#firebase-admin.js', () => ({
    firebaseAuth: { verifyIdToken: mockVerifyIdToken },
  }));
  
  vi.mock('#db/models/User.js', () => ({
    default: { findOne: mockFindOne },
  }));
  

import handleAuthentication from '../controllers/authController.js';

const createMockReq = (authHeader?: string) => ({
  headers: { authorization: authHeader },
  user: undefined,
} as any);

const createMockRes = () => {
  const res: any = {};
  res.sendStatus = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

const next = vi.fn();

describe('handleAuthentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if no authorization header', async () => {
    const req = createMockReq();
    const res = createMockRes();
    
    await handleAuthentication(req, res, next);
    
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
  });
//
  it('should return 401 if authorization header does not start with Bearer', async () => {
    const req = createMockReq('Basic invalidtoken');
    const res = createMockRes();
    
    await handleAuthentication(req, res, next);
    
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
    expect(mockVerifyIdToken).not.toHaveBeenCalled();
  });

  it('should return 500 if user not found in database', async () => {
    const req = createMockReq('Bearer validtoken');
    const res = createMockRes();
    
    mockVerifyIdToken.mockResolvedValue({ uid: '123' });
    mockFindOne.mockResolvedValue(null);
    
    await handleAuthentication(req, res, next);
    
    expect(mockVerifyIdToken).toHaveBeenCalledWith('validtoken');
    expect(mockFindOne).toHaveBeenCalledWith({ where: { uid: '123' } });
    expect(res.sendStatus).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });

  it('should attach user to request and call next if authentication succeeds', async () => {
    const req = createMockReq('Bearer validtoken');
    const res = createMockRes();
    const mockUser = { uid: '123', username: 'testuser' };
    
    mockVerifyIdToken.mockResolvedValue({ uid: '123' });
    mockFindOne.mockResolvedValue(mockUser);
    
    await handleAuthentication(req, res, next);
    
    expect(mockVerifyIdToken).toHaveBeenCalledWith('validtoken');
    expect(mockFindOne).toHaveBeenCalledWith({ where: { uid: '123' } });
    expect(req.user).toBe(mockUser);
    expect(next).toHaveBeenCalledWith();
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it('should call next with error if Firebase token verification fails', async () => {
    const req = createMockReq('Bearer invalidtoken');
    const res = createMockRes();
    const firebaseError = new Error('Invalid token');
    
    mockVerifyIdToken.mockRejectedValue(firebaseError);
    
    await handleAuthentication(req, res, next);
    
    expect(mockVerifyIdToken).toHaveBeenCalledWith('invalidtoken');
    expect(next).toHaveBeenCalledWith(firebaseError);
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it('should call next with error if database query fails', async () => {
    const req = createMockReq('Bearer validtoken');
    const res = createMockRes();
    const dbError = new Error('Database connection failed');
    
    mockVerifyIdToken.mockResolvedValue({ uid: '123' });
    mockFindOne.mockRejectedValue(dbError);
    
    await handleAuthentication(req, res, next);
    
    expect(mockVerifyIdToken).toHaveBeenCalledWith('validtoken');
    expect(mockFindOne).toHaveBeenCalledWith({ where: { uid: '123' } });
    expect(next).toHaveBeenCalledWith(dbError);
    expect(res.sendStatus).not.toHaveBeenCalled();
  });

  it('should handle malformed Bearer token', async () => {
    const req = createMockReq('Bearer');
    const res = createMockRes();
    
    await handleAuthentication(req, res, next);
    
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('should extract token correctly from Bearer authorization header', async () => {
    const req = createMockReq('Bearer some-complex-jwt-token-123');
    const res = createMockRes();
    const mockUser = { uid: 'user123', username: 'testuser' };
    
    mockVerifyIdToken.mockResolvedValue({ uid: 'user123' });
    mockFindOne.mockResolvedValue(mockUser);
    
    await handleAuthentication(req, res, next);
    
    expect(mockVerifyIdToken).toHaveBeenCalledWith('some-complex-jwt-token-123');
    expect(req.user).toBe(mockUser);
    expect(next).toHaveBeenCalledWith();
  });
});

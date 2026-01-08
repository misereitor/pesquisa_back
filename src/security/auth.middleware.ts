import { Request, Response, NextFunction } from 'express';
import { openTokenUserAdmin } from './token-user-admin.security';
import { valideTokenUserVoteService } from './token-user-vote.security';

export const authenticateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: 'No token provided' });
    }

    console.log('[AUTH-MIDDLEWARE] calling openTokenUserAdmin');
    const decoded = openTokenUserAdmin(authHeader);
    if (!decoded) {
      return res
        .status(403)
        .json({ success: false, message: 'Invalid admin token' });
    }

    // Optionally attach user to request if needed
    // req.user = decoded;

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

export const authenticateVoter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: 'No token provided' });
    }

    const decoded = valideTokenUserVoteService(authHeader);
    if (!decoded) {
      return res
        .status(403)
        .json({ success: false, message: 'Invalid voter token' });
    }

    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message || 'Authentication failed'
    });
  }
};

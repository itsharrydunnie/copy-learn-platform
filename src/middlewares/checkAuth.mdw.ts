import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/error.util';
import userRepository from '../modules/users/user/user.repository';
import asyncHandler from './async.mdw';
import { IUserDoc } from '@/modules/users/user/user.interface';
import tokenService from '@/modules/internals/token.service';
import authService from '../modules/authentication/auth/auth.service';

/**
 * @description Middleware to verify user authentication and token validity
 * @param {Request} req - Express request object containing authenticated user
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function
 * @returns {Promise<void>}
 * @throws {ErrorResponse}
 *  - 401 if no token provided
 *  - 401 if invalid token
 *  - 403 if token expired
 *  - 401 if user not found or token revoked
 *  - 403 if account is deactivated
 *  - 403 if account is suspended
 *  - 403 if account is not activated
 *  - 423 if account is locked
 *  - 403 if account is not active
 */
const Protect: RequestHandler = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const token = req.header('authorization')?.split(' ')[1];
        if (!token) {
            return next(new ErrorResponse('No token provided', 401, ['']));
        }

        let decoded: jwt.JwtPayload;
        try {
            decoded = jwt.verify(
                token,
                process.env.JWT_SECRET!,
            ) as jwt.JwtPayload;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                return next(new ErrorResponse('Token has expired', 403, ['']));
            }
            return next(new ErrorResponse('Invalid token', 401, ['']));
        }

        const userResult = await userRepository.findById(decoded.id);
        if (userResult.error || !userResult.data) {
            return next(new ErrorResponse('Invalid or expired token', 401, []));
        }

        const user = userResult.data as IUserDoc;

        // Check token version match
        if (user.tokenVersion !== decoded.tokenVersion) {
            return next(new ErrorResponse('Token revoked', 401, []));
        }

        // Check if account is deactivated
        if (user.isDeactivated) {
            return next(
                new ErrorResponse('Account has been deactivated', 403, []),
            );
        }

        // Check if account is suspended
        if (user.isSuspended) {
            return next(
                new ErrorResponse('Account has been suspended', 403, []),
            );
        }

        // Check if account is activated
        if (!user.isActivated) {
            return next(
                new ErrorResponse(
                    'Account not activated. Please verify your email',
                    403,
                    [],
                ),
            );
        }

        // Check if account is locked
        if (await authService.checkLockedStatus(user)) {
            return next(
                new ErrorResponse(
                    'Account is locked. Please try again later',
                    423,
                    [],
                ),
            );
        }

        // Check if account is active
        if (!user.isActive) {
            return next(new ErrorResponse('Account is not active', 403, []));
        }

        // Check if token needs refresh
        if (!tokenService.checkTokenValidity(token)) {
            const refreshResult = await tokenService.refreshToken(token);
            if (refreshResult.error) {
                return next(
                    new ErrorResponse(
                        refreshResult.message,
                        refreshResult.code,
                        [],
                    ),
                );
            }
            // Set new token in response header
            res.setHeader('X-New-Token', refreshResult.data.token);
        }

        req.user = user;
        next();
    },
);

export default Protect;

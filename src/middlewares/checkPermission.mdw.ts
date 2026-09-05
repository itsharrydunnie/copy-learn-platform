import { Request, Response, NextFunction, RequestHandler } from 'express';
import asyncHandler from './async.mdw';
import { hasPermission } from '../modules/authentication/permission/permission.service';

type PermInput = string | { entity: string; action: string };

interface ICheckPermissionOptions {
    ownerParam?: string;
    ownerResolver?: (req: Request) => Promise<string | null> | string | null;
    checkOwnership?: boolean;
}

/**
 * Middleware factory to check user permissions
 * @param perm - Permission(s) to check (string format: "entity:action" or object: {entity, action})
 * @param options - Configuration options
 * @param options.ownerParam - Parameter name to extract resource owner ID from (params, body, or query)
 * @param options.ownerResolver - Custom async function to resolve resource owner ID
 * @param options.checkOwnership - Whether to allow access if user owns the resource (default: true)
 * @returns Express middleware function
 */
const checkPermission = (
    perm: PermInput | PermInput[],
    options?: ICheckPermissionOptions,
): RequestHandler => {
    return asyncHandler(
        async (req: Request, res: Response, next: NextFunction) => {
            const user = req.user;
            if (!user) {
                return res
                    .status(401)
                    .json({ error: true, message: 'Unauthorized' });
            }

            const checkOwnership = options?.checkOwnership ?? true;

            // Determine resource owner id if provided
            let resourceOwnerId: string | null = null;
            if (options?.ownerResolver) {
                resourceOwnerId = await options.ownerResolver(req);
            } else if (options?.ownerParam) {
                // look in params, body, or query
                resourceOwnerId =
                    (req.params && req.params[options.ownerParam]) ||
                    (req.body && req.body[options.ownerParam]) ||
                    (req.query && (req.query as any)[options.ownerParam]) ||
                    null;
            }

            const permsToCheck = Array.isArray(perm) ? perm : [perm];

            // Check each permission - if any passes, allow access
            for (const p of permsToCheck) {
                const ok = await hasPermission(user, p, {
                    resourceOwnerId,
                    checkOwnership,
                });
                if (ok) {
                    return next();
                }
            }

            // All permissions failed
            return res.status(403).json({ error: true, message: 'Forbidden' });
        },
    );
};

export default checkPermission;

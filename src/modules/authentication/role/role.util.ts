import { Types } from "mongoose";
import {
  WorkspaceMemberRole,
  IWorkspaceDoc,
  IWorkspaceMember,
} from "../../core/workspace/workspace.interface";

import { IUserDoc } from "../../users/user/user.interface";

type ObjectId = Types.ObjectId;

/**
 * Workspace-level permission mapping
 
export const workspaceMemberPermissionMap: Record<
    WorkspaceMemberRole,
    string[]
> = {
    [WorkspaceMemberRole.OWNER]: ['*:*'], // Full access (BUSINESS userType)
    [WorkspaceMemberRole.MANAGER]: [
        'workspace:read',
        'workspace:update',
        'workspace:manage-members',
        'project:create',
        'project:read',
        'project:update',
        'project:delete',
        'project:manage-members',
        'hackathon:create',
        'hackathon:read',
        'hackathon:update',
        'hackathon:manage',
        'team:*',
    ],
};


/**
 * Extract user ID from various user input types (string, ObjectId, or IUserDoc)
 * @param user - User identifier (string ID, ObjectId, or user document)
 * @returns Normalized user ID as string
 */
function extractUserId(user: IUserDoc | ObjectId | string): string {
  if (typeof user === "string") {
    return user;
  }
  return (user as any)._id?.toString() || (user as any).toString();
}

/**
 * Extract user ID from a member/user field (handles ObjectId, string, or populated user object)
 * @param userField - User field from a member object
 * @returns Normalized user ID as string, or null if invalid
 */
function extractUserIdFromField(userField: any): string | null {
  if (!userField) return null;
  return (
    (userField as any)?._id?.toString() ||
    (userField as any)?.toString() ||
    userField?.toString() ||
    null
  );
}

/**
 * Find a member in an array by matching user ID
 * @param members - Array of member objects with user field
 * @param userId - User ID to search for
 * @returns Member object if found, undefined otherwise
 */
function findMemberInArray<T extends { user: any }>(
  members: T[],
  userId: string,
): T | undefined {
  return members.find((member) => {
    const memberUserId = extractUserIdFromField(member.user);
    return memberUserId === userId;
  });
}

/**
 * Get member role from a workspace resource
 */
export function getWorkspaceMemberRole(
  user: IUserDoc | ObjectId | string,
  workspace: IWorkspaceDoc | any,
): WorkspaceMemberRole | null {
  if (!workspace?.members || !Array.isArray(workspace.members)) return null;

  const userId = extractUserId(user);
  const member = findMemberInArray<IWorkspaceMember>(workspace.members, userId);

  return member?.role || null;
}

/**
 * Get contextual permissions for a resource member role
 * This is the main function that routes to appropriate permission maps
 */
export function getContextualPermissions(
  resourceType: "workspace" | "project" | "hackathon",
  memberRole: WorkspaceMemberRole | null,
): string[] {
  if (!memberRole) return [];

  switch (resourceType) {
    case "workspace":

    case "project":

    case "hackathon":

    default:
      return [];
  }
}

/**
 * Check if a permission matches any of the permissions in the set
 * Supports wildcard matching (entity:* or *:action)
 */
export function matchPermission(
  requested: string,
  perms: Set<string> | string[],
): boolean {
  const permSet =
    perms instanceof Set ? perms : new Set(perms.map((p) => p.toLowerCase()));
  requested = requested.toLowerCase();

  if (permSet.has("*:*")) return true; // global wildcard
  if (permSet.has(requested)) return true;

  // wildcard checks: entity:* or *:action
  const [entity, action] = requested.split(":");
  if (entity && permSet.has(`${entity}:*`)) return true;
  if (action && permSet.has(`*:${action}`)) return true;

  return false;
}

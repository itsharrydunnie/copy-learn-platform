import { Random } from "@btffamily/pacitude";
import { UserType } from "../modules/users/user/user.interface";

/**
 * @name genUserCode
 * @description Generates a unique, standardized identification code for a user based on their type.
 * @param {UserType} userType - The classification of the user (e.g., TALENT, BUSINESS, ADMIN).
 * @returns {string} A formatted string in the format: {abbr}-{year}-{random_6_digits}.
 * * @example
 * // Returns "tl-2025-123456"
 * const code = genUserCode(UserType.TALENT);
 */
export const genUserCode = (userType: UserType): string => {
  const name: Record<string, string> = {
    [UserType.SUPERADMIN]: "sa",
    [UserType.TALENT]: "tl",
    [UserType.ADMIN]: "ad",
    [UserType.USER]: "ppl",
  };

  const baseName = name[userType] || "ppl";
  const now = new Date();
  const year = now.getFullYear();
  const code = Random.randomNum(6);

  return `${baseName}-${year}-${code}`;
};

/**
 * @name genWorkspaceCode
 * @description Generates a unique, standardized identification code for a workspace.
 * @returns {string} A formatted string in the format: ws-{year}-{random_6_digits}.
 * @example
 * // Returns "ws-2025-123456"
 * const code = genWorkspaceCode();
 */
export const genWorkspaceCode = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const code = Random.randomNum(6);

  return `ws-${year}-${code}`;
};

/**
 * @name genProjectCode
 * @description Generates a unique, standardized identification code for a project.
 * @returns {string} A formatted string in format: prj-{year}-{random_6_digits}.
 * @example
 * // Returns "prj-2025-123456"
 * const code = genProjectCode();
 */
export const genProjectCode = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const code = Random.randomNum(6);

  return `prj-${year}-${code}`;
};

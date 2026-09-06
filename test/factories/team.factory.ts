import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import {
    ITeamDoc,
    TeamMemberRole,
} from '../../src/modules/team/team.interface';
import Team from '../../src/modules/team/team.model';
import { IUserDoc } from '../../src/modules/user/user.interface';
import { IWorkspaceDoc } from '../../src/modules/workspace/workspace.interface';
import { IBusinessDoc } from '../../src/modules/business/business.interface';
import { IProjectDoc } from '../../src/modules/project/project.interface';
import { genTeamCode } from '../../src/utils/code.util';

/**
 * Factory for creating test team data
 */

/**
 * Helper to normalize an ID to ObjectId
 */
const toObjectId = (
    id: string | Types.ObjectId | undefined | null,
): Types.ObjectId | undefined => {
    if (!id) return undefined;
    if (id instanceof Types.ObjectId) return id;
    if (typeof id === 'string') return new Types.ObjectId(id);
    return undefined;
};

/**
 * Helper to extract ObjectId from a document
 */
const extractObjectId = (doc: any): Types.ObjectId | undefined => {
    if (!doc) return undefined;
    const id = doc._id || doc.id;
    return toObjectId(id);
};

export interface TeamFactoryOptions {
    name?: string;
    description?: string;
    workspace?: IWorkspaceDoc | string;
    business?: IBusinessDoc | string;
    project?: IProjectDoc | string;
    createdBy?: IUserDoc | string;
    members?: Array<{ user: IUserDoc | string; role: TeamMemberRole }>;
}

/**
 * Creates a team factory data object
 */
export const createTeamData = (
    options: TeamFactoryOptions = {},
): Partial<ITeamDoc> => {
    const {
        name = faker.company.name(),
        description = faker.company.catchPhrase(),
        workspace,
        business,
        project,
        createdBy,
        members = [],
    } = options;

    // For workspace, business, project - they can be documents or IDs
    // The interface accepts documents or any, so we can pass them as-is or convert IDs
    const workspaceValue =
        typeof workspace === 'string'
            ? new Types.ObjectId(workspace)
            : workspace;
    const businessValue =
        typeof business === 'string' ? new Types.ObjectId(business) : business;
    const projectValue =
        typeof project === 'string' ? new Types.ObjectId(project) : project;

    // For createdBy, it must be ObjectId or IUserDoc
    let createdByValue: Types.ObjectId | IUserDoc;
    if (typeof createdBy === 'string') {
        createdByValue = new Types.ObjectId(createdBy);
    } else if (createdBy instanceof Types.ObjectId) {
        createdByValue = createdBy;
    } else if (createdBy) {
        // It's an IUserDoc
        createdByValue = createdBy;
    } else {
        throw new Error('createdBy is required for team creation');
    }

    if (!workspaceValue || !businessValue || !projectValue) {
        throw new Error(
            'Workspace, Business, and Project are required for team creation',
        );
    }

    return {
        code: genTeamCode(),
        name,
        description,
        createdBy: createdByValue,
        workspace: workspaceValue as any,
        business: businessValue as any,
        project: projectValue as any,
        members: members.map((m) => {
            let userId: Types.ObjectId | IUserDoc;
            if (typeof m.user === 'string') {
                userId = new Types.ObjectId(m.user);
            } else if (m.user instanceof Types.ObjectId) {
                userId = m.user;
            } else {
                // It's an IUserDoc
                userId = m.user;
            }
            return {
                user: userId,
                role: m.role,
                joinedAt: new Date(),
            };
        }),
        tasks: [],
    };
};

/**
 * Creates and saves a test team
 */
export const createTeam = async (
    options: TeamFactoryOptions = {},
): Promise<ITeamDoc> => {
    const teamData = createTeamData(options);
    const team = await Team.create(teamData);
    return team;
};

/**
 * Creates multiple test teams
 */
export const createTeams = async (
    count: number,
    options: TeamFactoryOptions = {},
): Promise<ITeamDoc[]> => {
    const teams: ITeamDoc[] = [];
    for (let i = 0; i < count; i++) {
        teams.push(await createTeam(options));
    }
    return teams;
};

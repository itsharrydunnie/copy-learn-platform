import { faker } from '@faker-js/faker';
import { IWorkspaceDoc } from '../../src/modules/workspace/workspace.interface';
import Workspace from '../../src/modules/workspace/workspace.model';
import { IUserDoc } from '../../src/modules/user/user.interface';
import { genWorkspaceCode } from '../../src/utils/code.util';

/**
 * Factory for creating test workspace data
 */

export interface WorkspaceFactoryOptions {
    name?: string;
    description?: string;
    createdBy?: IUserDoc | string;
    members?: (IUserDoc | string)[];
    index?: number;
}

/**
 * Creates a workspace factory data object
 */
export const createWorkspaceData = (
    options: WorkspaceFactoryOptions = {},
): Partial<IWorkspaceDoc> => {
    const {
        name = faker.company.name(),
        description = faker.company.catchPhrase(),
        createdBy,
        members = [],
        index = 0,
    } = options;

    const createdById =
        typeof createdBy === 'string'
            ? createdBy
            : createdBy?._id || createdBy?.id;

    return {
        code: genWorkspaceCode(),
        name,
        description,
        index,
        createdBy: createdById,
        members: members.map((m) =>
            typeof m === 'string' ? m : m._id || m.id,
        ),
        invites: [],
        hackathons: [],
        projects: [],
        mentors: [],
        judges: [],
    };
};

/**
 * Creates and saves a test workspace
 */
export const createWorkspace = async (
    options: WorkspaceFactoryOptions = {},
): Promise<IWorkspaceDoc> => {
    const workspaceData = createWorkspaceData(options);
    const workspace = await Workspace.create(workspaceData);
    return workspace;
};

/**
 * Creates multiple test workspaces
 */
export const createWorkspaces = async (
    count: number,
    options: WorkspaceFactoryOptions = {},
): Promise<IWorkspaceDoc[]> => {
    const workspaces: IWorkspaceDoc[] = [];
    for (let i = 0; i < count; i++) {
        workspaces.push(await createWorkspace({ ...options, index: i }));
    }
    return workspaces;
};

import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import {
    IProjectDoc,
    ProjectType,
    ProjectStatus,
    ProjectMemberRole,
} from '../../src/modules/project/project.interface';
import Project from '../../src/modules/project/project.model';
import { IUserDoc } from '../../src/modules/user/user.interface';
import { IWorkspaceDoc } from '../../src/modules/workspace/workspace.interface';
import { IBusinessDoc } from '../../src/modules/business/business.interface';
import { genProjectCode } from '../../src/utils/code.util';
import { genSlug } from '../../src/utils/helpers.util';

/**
 * Factory for creating test project data
 */

export interface ProjectFactoryOptions {
    title?: string;
    description?: string;
    type?: ProjectType;
    status?: ProjectStatus;
    workspace?: IWorkspaceDoc | string;
    business?: IBusinessDoc | string;
    createdBy?: IUserDoc | string;
    isOpen?: boolean;
    isPublic?: boolean;
    isChallenge?: boolean;
    members?: Array<{ user: IUserDoc | string; role: ProjectMemberRole }>;
}

/**
 * Creates a project factory data object
 */
export const createProjectData = (
    options: ProjectFactoryOptions = {},
): Partial<IProjectDoc> => {
    const {
        title = faker.lorem.words(3),
        description = faker.lorem.paragraph(),
        type = ProjectType.PROJECT,
        status = ProjectStatus.DRAFT,
        workspace,
        business,
        createdBy,
        isOpen = false,
        isPublic = false,
        isChallenge = false,
        members = [],
    } = options;

    const workspaceId =
        typeof workspace === 'string'
            ? Types.ObjectId.isValid(workspace)
                ? new Types.ObjectId(workspace)
                : workspace
            : workspace?._id || workspace?.id;
    const businessId =
        typeof business === 'string'
            ? Types.ObjectId.isValid(business)
                ? new Types.ObjectId(business)
                : business
            : business?._id || business?.id;
    const createdById: Types.ObjectId =
        typeof createdBy === 'string'
            ? Types.ObjectId.isValid(createdBy)
                ? new Types.ObjectId(createdBy)
                : new Types.ObjectId(createdBy)
            : createdBy?._id || createdBy?.id || (createdBy as any);

    if (!workspaceId) {
        throw new Error('Workspace is required for project creation');
    }
    if (!businessId) {
        throw new Error('Business is required for project creation');
    }
    if (!createdById) {
        throw new Error('createdBy is required for project creation');
    }

    const slug = genSlug(title);

    return {
        code: genProjectCode(),
        title,
        slug,
        tagline: faker.company.catchPhrase(),
        description,
        items: [],
        documentation: '',
        category: faker.helpers.arrayElement([
            'web',
            'mobile',
            'ai',
            'blockchain',
            'iot',
        ]),
        tags: faker.helpers.arrayElements(
            ['react', 'node', 'typescript', 'python'],
            { min: 1, max: 3 },
        ),
        type,
        status,
        image: faker.image.url(),
        isOpen,
        isClosed: status === ProjectStatus.CLOSED,
        isPublic,
        isChallenge,
        createdBy: createdById as any, // Type assertion: model stores ObjectId but interface allows IUserDoc | ObjectId
        workspace: workspaceId,
        business: businessId,
        members: members.map((m) => {
            const userId =
                typeof m.user === 'string'
                    ? Types.ObjectId.isValid(m.user)
                        ? new Types.ObjectId(m.user)
                        : new Types.ObjectId(m.user)
                    : m.user._id || m.user.id;
            return {
                user: userId as any, // Type assertion: model stores ObjectId but interface expects IUserDoc
                role: m.role,
                joinedAt: new Date(),
            };
        }) as any, // Type assertion needed because interface expects IUserDoc but model stores ObjectId
        tasks: [],
        publishedAt:
            status === ProjectStatus.PUBLISHED ? new Date() : undefined,
    };
};

/**
 * Creates and saves a test project
 */
export const createProject = async (
    options: ProjectFactoryOptions = {},
): Promise<IProjectDoc> => {
    const projectData = createProjectData(options);
    const project = await Project.create(projectData);
    return project;
};

/**
 * Creates multiple test projects
 */
export const createProjects = async (
    count: number,
    options: ProjectFactoryOptions = {},
): Promise<IProjectDoc[]> => {
    const projects: IProjectDoc[] = [];
    for (let i = 0; i < count; i++) {
        projects.push(await createProject(options));
    }
    return projects;
};

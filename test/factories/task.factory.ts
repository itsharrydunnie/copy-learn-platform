import { faker } from '@faker-js/faker';
import { Types } from 'mongoose';
import {
    ITaskDoc,
    TaskStatusType,
    TaskPriorityType,
} from '../../src/modules/task/task.interface';
import Task from '../../src/modules/task/task.model';
import { IUserDoc } from '../../src/modules/user/user.interface';
import { IWorkspaceDoc } from '../../src/modules/workspace/workspace.interface';
import { IBusinessDoc } from '../../src/modules/business/business.interface';
import { IProjectDoc } from '../../src/modules/project/project.interface';
import { ITeamDoc } from '../../src/modules/team/team.interface';
import { genTaskCode } from '../../src/utils/code.util';

/**
 * Factory for creating test task data
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

export interface TaskFactoryOptions {
    title?: string;
    description?: string;
    status?: TaskStatusType;
    priority?: TaskPriorityType;
    workspaceId?: IWorkspaceDoc | string;
    businessId?: IBusinessDoc | string;
    projectId?: IProjectDoc | string;
    teamId?: ITeamDoc | string;
    createdBy?: IUserDoc | string;
    assignedTo?: (IUserDoc | string)[];
    points?: number;
    dueDate?: Date;
}

/**
 * Creates a task factory data object
 */
export const createTaskData = (
    options: TaskFactoryOptions = {},
): Partial<ITaskDoc> => {
    const {
        title = faker.lorem.words(4),
        description = faker.lorem.sentence(),
        status = TaskStatusType.TODO,
        priority = TaskPriorityType.MEDIUM,
        workspaceId,
        businessId,
        projectId,
        teamId,
        createdBy,
        assignedTo = [],
        points = faker.number.int({ min: 1, max: 100 }),
        dueDate,
    } = options;

    const workspaceIdValue =
        typeof workspaceId === 'string'
            ? new Types.ObjectId(workspaceId)
            : extractObjectId(workspaceId);
    const businessIdValue =
        typeof businessId === 'string'
            ? new Types.ObjectId(businessId)
            : extractObjectId(businessId);
    const projectIdValue =
        typeof projectId === 'string'
            ? new Types.ObjectId(projectId)
            : extractObjectId(projectId);
    const teamIdValue =
        typeof teamId === 'string'
            ? new Types.ObjectId(teamId)
            : extractObjectId(teamId);
    const createdById =
        typeof createdBy === 'string'
            ? new Types.ObjectId(createdBy)
            : extractObjectId(createdBy);

    if (
        !workspaceIdValue ||
        !businessIdValue ||
        !projectIdValue ||
        !teamIdValue
    ) {
        throw new Error(
            'Workspace, Business, Project, and Team are required for task creation',
        );
    }
    if (!createdById) {
        throw new Error('createdBy is required for task creation');
    }

    return {
        code: genTaskCode(),
        title,
        description,
        workspaceId: workspaceIdValue,
        businessId: businessIdValue,
        projectId: projectIdValue,
        teamId: teamIdValue,
        status,
        priority,
        points,
        assignedTo: assignedTo.map((u) => {
            if (typeof u === 'string') {
                return new Types.ObjectId(u);
            }
            // If it's already an ObjectId, return as is
            if (u instanceof Types.ObjectId) {
                return u;
            }
            // If it's an IUserDoc, return as is
            if (u && typeof u === 'object' && ('_id' in u || 'id' in u)) {
                return u as IUserDoc;
            }
            // Otherwise, try to extract ObjectId
            const extractedId = extractObjectId(u);
            return extractedId || (u as IUserDoc);
        }) as Array<Types.ObjectId | IUserDoc>,
        createdBy: createdById,
        tags: faker.helpers.arrayElements(
            ['bug', 'feature', 'refactor', 'documentation'],
            { min: 0, max: 2 },
        ),
        dueDate: dueDate || faker.date.future(),
        completedAt: status === TaskStatusType.DONE ? new Date() : undefined,
    };
};

/**
 * Creates and saves a test task
 */
export const createTask = async (
    options: TaskFactoryOptions = {},
): Promise<ITaskDoc> => {
    const taskData = createTaskData(options);
    const task = await Task.create(taskData);
    return task;
};

/**
 * Creates multiple test tasks
 */
export const createTasks = async (
    count: number,
    options: TaskFactoryOptions = {},
): Promise<ITaskDoc[]> => {
    const tasks: ITaskDoc[] = [];
    for (let i = 0; i < count; i++) {
        tasks.push(await createTask(options));
    }
    return tasks;
};

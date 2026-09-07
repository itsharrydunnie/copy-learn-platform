import { jest } from "@jest/globals";
const queueMock={createQueue:jest.fn().mockResolvedValue({add:jest.fn().mockResolvedValue({id:"mock-job-id"})}),addJobs:jest.fn().mockResolvedValue(undefined),addProcessor:jest.fn().mockResolvedValue(undefined),getQueue:jest.fn(),closeQueue:jest.fn().mockResolvedValue(undefined)};
export default queueMock;
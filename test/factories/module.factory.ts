import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Module from "../../src/modules/core/modules/module.model";
import { ModuleStatus } from "../../src/modules/core/modules/module.interface";
export const buildModule=(overrides:Record<string,unknown>={})=>{const startsAt=faker.date.soon({days:7});return {courseId:new Types.ObjectId(),title:faker.company.catchPhrase(),description:faker.lorem.paragraph(),order:1,startsAt,endsAt:new Date(startsAt.getTime()+7200000),status:ModuleStatus.SCHEDULED,instructor:{name:faker.person.fullName(),title:"Instructor"},resources:[],...overrides};};
export const createModule=async(overrides:Record<string,unknown>={})=>Module.create(buildModule(overrides));
import { faker } from "@faker-js/faker";
import Program from "../../src/modules/core/programs/program.model";
import { ProgramStatus } from "../../src/modules/core/programs/program.dto";
export const buildProgram=(overrides:Record<string,unknown>={})=>({slug:faker.helpers.slugify(faker.company.name()).toLowerCase(),title:faker.company.name(),description:faker.lorem.paragraph(),shortDescription:faker.lorem.sentence(),thumbnail:faker.image.url(),coverImage:faker.image.url(),status:ProgramStatus.DRAFT,enrollmentEnabled:true,...overrides});
export const createProgram=async(overrides:Record<string,unknown>={})=>Program.create(buildProgram(overrides));
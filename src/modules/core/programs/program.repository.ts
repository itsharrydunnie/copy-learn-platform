import RepositoryService from "@/modules/internals/repository.service";
import { IProgram } from "./program.dto";
import Program from "./program.model";
import { IResult } from "@/utils/interfaces.util";

class ProgramRepository extends RepositoryService<IProgram> {
  constructor() {
    super(Program, "Program");
  }

  /**
   * @name createProgram
   * @description Persists a program using the shared repository create operation.
   * @param programData - Program fields to persist, including the generated slug.
   * @returns A promise resolving to an IResult for the created program.
   */
  async createProgram(programData: Partial<IProgram>) {
    return this.create(programData);
  }

  /**
   * @name getProgramById
   * @description Finds a program by MongoDB ID with optional population.
   * @param id - The program ID.
   * @param populate - Whether to populate related data or provide populate paths.
   * @returns A promise resolving to an IResult containing the matching program.
   */
  async getProgramById(
    id: string,
    populate: boolean | Array<{ path: string }> = false,
  ): Promise<IResult> {
    return this.findById(id, populate);
  }

  /**
   * @name getProgramByIdOrSlug
   * @description Finds a program by MongoDB ID or slug with optional population.
   * @param input - The program ID or slug.
   * @param populate - Whether to populate related data or provide populate paths.
   * @returns A promise resolving to an IResult containing the matching program.
   */
  async getProgramByIdOrSlug(
    input: string | number,
    populate: boolean | Array<{ path: string }> = false,
  ): Promise<IResult> {
    return this.findByIdOrSlug(input, populate);
  }

  /**
   * @name getPrograms
   * @description Finds programs matching a filter and applies optional query options.
   * @param filter - Repository filter for program fields.
   * @param options - Optional selection, sorting, pagination, and population settings.
   * @returns A promise resolving to an IResult containing matching programs and pagination metadata.
   */
  async getPrograms(
    filter?: any,
    options?: {
      select?: string;
      sort?: string;
      page?: number;
      limit?: number;
      populate?: string | any;
    },
  ): Promise<IResult> {
    if (options) {
      return this.findAll(filter || {}, options);
    }
    return this.findAll(filter);
  }

  /**
   * @name updateProgram
   * @description Updates a program by ID using the shared repository update operation.
   * @param programId - The program ID to update.
   * @param updateData - Program fields to change.
   * @returns A promise resolving to an IResult for the updated program.
   */
  async updateProgram(
    programId: string,
    updateData: Partial<IProgram>,
  ): Promise<IResult> {
    return this.update(programId, updateData);
  }

  /**
   * @name slugExists
   * @description Checks whether a program already uses the supplied slug.
   * @param slug - The slug to search for.
   * @returns A promise resolving to true when the slug is already in use; otherwise false.
   */
  async slugExists(slug: string): Promise<boolean> {
    const existingProgram = await this.getProgramByIdOrSlug(slug);
    return Object.keys(existingProgram.data).length > 0;
  }
}

export default new ProgramRepository();

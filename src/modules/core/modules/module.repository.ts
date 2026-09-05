import RepositoryService from "@/modules/internals/repository.service";
import { IModule } from "./module.interface";
import Module from "./module.model";
import { IResult } from "@/utils/interfaces.util";

class ModuleRepository extends RepositoryService<IModule> {
  constructor() {
    super(Module, "Module");
  }

  /** Creates a module document. */
  async createModule(moduleData: Partial<IModule>): Promise<IResult> {
    return this.create(moduleData);
  }

  /** Finds a module by MongoDB ID, optionally populating related data. */
  async getModuleById(
    moduleId: string,
    populate: boolean | Array<{ path: string }> = false,
  ): Promise<IResult> {
    return this.findById(moduleId, populate);
  }

  /** Retrieves modules matching a filter, ordered by module order by default. */
  async getModules(
    filter?: any,
    options?: {
      select?: string;
      sort?: string;
      page?: number;
      limit?: number;
      populate?: string | any;
    },
  ): Promise<IResult> {
    return this.findAll(filter || {}, {
      sort: "order",
      ...options,
    });
  }

  /** Finds the last ordered module belonging to a course. */
  async getLastModule(courseId: string): Promise<IResult> {
    return this.findOne(
      { courseId },
      {
        sort: "-order",
      },
    );
  }

  /** Applies a partial update to a module by ID. */
  async updateModule(
    moduleId: string,
    updateData: Partial<IModule>,
  ): Promise<IResult> {
    return this.update(moduleId, updateData);
  }

  /** Updates a module only when it belongs to the supplied course. */
  async updateModuleByCourse(
    courseId: string,
    moduleId: string,
    updateData: Partial<IModule>,
  ): Promise<IResult> {
    try {
      const updatedModule = await Module.findOneAndUpdate(
        {
          _id: moduleId,
          courseId,
        },
        updateData,
        { returnDocument: "after", runValidators: true },
      );

      if (!updatedModule) {
        return {
          error: true,
          message: "Module not found",
          code: 404,
          data: {},
        };
      }

      return {
        error: false,
        message: "Module updated successfully",
        code: 200,
        data: updatedModule,
      };
    } catch (error: any) {
      return {
        error: true,
        message: error.message,
        code: 500,
        data: {},
      };
    }
  }

  /** Finds a module by ID while restricting the lookup to a course. */
  async getModuleByCourse(
    courseId: string,
    moduleId: string,
  ): Promise<IResult> {
    return this.findOne({
      _id: moduleId,
      courseId,
    });
  }
}

export default new ModuleRepository();

import "../../setup";
import { createProgram } from "../../factories";
describe("Program model",()=>{it("creates a program with thumbnail and coverImage",async()=>{const program=await createProgram();expect(program._id).toBeDefined();expect(program.thumbnail).toBeDefined();expect(program.coverImage).toBeDefined();});});
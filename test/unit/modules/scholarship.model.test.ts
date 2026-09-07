import "../../setup";
import { createScholarship } from "../../factories";
describe("Scholarship model",()=>{it("persists canPayEnrollmentFee",async()=>{const scholarship=await createScholarship({canPayEnrollmentFee:true});expect(scholarship.canPayEnrollmentFee).toBe(true);});});
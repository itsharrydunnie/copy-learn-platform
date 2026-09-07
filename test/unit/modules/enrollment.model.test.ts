import "../../setup";
import { createEnrollment } from "../../factories";
describe("Enrollment model",()=>{it("creates a pending enrollment",async()=>{const enrollment=await createEnrollment();expect(enrollment.status).toBe("pending");});});
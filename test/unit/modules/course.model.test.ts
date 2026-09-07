import "../../setup";
import { createCourse } from "../../factories";
describe("Course model",()=>{it("stores course prices in minor units",async()=>{const course=await createCourse({price:65000000,scholarshipPrice:6500000});expect(course.price).toBe(65000000);expect(course.scholarshipPrice).toBe(6500000);});});
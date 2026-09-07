import "../../setup";
import { createModule } from "../../factories";
describe("Module model",()=>{it("allows creation without a recording URL",async()=>{const module=await createModule({recording:undefined});expect(module._id).toBeDefined();expect(module.recording?.url).toBeUndefined();});});
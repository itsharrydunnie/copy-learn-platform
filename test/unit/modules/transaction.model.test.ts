import "../../setup";
import { createTransaction } from "../../factories";
describe("Transaction model",()=>{it("creates a pending course payment transaction",async()=>{const transaction=await createTransaction();expect(transaction.status).toBe("PENDING");expect(transaction.amount).toBe(6500000);expect(transaction.unitAmount).toBe(65000);});});
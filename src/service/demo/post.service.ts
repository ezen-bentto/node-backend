import { DemoCreate } from "@/schemas/demo.schema";
import { DemoModel } from "@/models/demo.model";

export const post = async (data: DemoCreate) => {
  return await DemoModel.create();
};

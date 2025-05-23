import { DemoModel } from "@/models/demo.model";

export const get = async () => {
  return await DemoModel.findAll();
};

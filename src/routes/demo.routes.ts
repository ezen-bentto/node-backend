import { Router } from "express";
import DemoController from "@/controllers/demo.ctl";

const router = Router();

router.get("/", DemoController.get);
router.post("/", DemoController.post);

export default router;

import { Router, type IRouter } from "express";
import healthRouter from "./health";
import mergeAudioRouter from "./merge-audio";

const router: IRouter = Router();

router.use(healthRouter);
router.use(mergeAudioRouter);

export default router;

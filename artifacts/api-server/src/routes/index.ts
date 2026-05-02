import { Router, type IRouter } from "express";
import healthRouter from "./health";
import vendorsRouter from "./vendors";
import ordersRouter from "./orders";
import summaryRouter from "./summary";

const router: IRouter = Router();

router.use(healthRouter);
router.use(vendorsRouter);
router.use(ordersRouter);
router.use(summaryRouter);

export default router;

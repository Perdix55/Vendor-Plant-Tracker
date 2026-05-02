import { Router, type IRouter } from "express";
import healthRouter from "./health";
import vendorsRouter from "./vendors";
import ordersRouter from "./orders";
import summaryRouter from "./summary";
import vendorConfirmRouter from "./vendor-confirm";

const router: IRouter = Router();

router.use(healthRouter);
router.use(vendorsRouter);
router.use(ordersRouter);
router.use(summaryRouter);
router.use(vendorConfirmRouter);

export default router;

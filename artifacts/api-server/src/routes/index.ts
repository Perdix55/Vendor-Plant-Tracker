import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import priceImportRouter from "./price-import";
import vendorsRouter from "./vendors";
import ordersRouter from "./orders";
import summaryRouter from "./summary";
import vendorConfirmRouter from "./vendor-confirm";
import inventoryRouter from "./inventory";
import settingsRouter from "./settings";
import salesOrdersRouter from "./sales-orders";
import reportsRouter from "./reports";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(priceImportRouter);
router.use(vendorsRouter);
router.use(ordersRouter);
router.use(summaryRouter);
router.use(vendorConfirmRouter);
router.use(inventoryRouter);
router.use(settingsRouter);
router.use(salesOrdersRouter);
router.use(reportsRouter);

export default router;

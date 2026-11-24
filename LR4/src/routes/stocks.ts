import {Router} from "express";
import * as stocksController from "../controllers/stocksController";

const router = Router();

router.get("/", stocksController.getAllStocks);
router.get("/:id", stocksController.getStockById);
router.post("/", stocksController.createStock);
router.patch("/:id", stocksController.updateStock);
router.delete("/:id", stocksController.deleteStock);

export default router;

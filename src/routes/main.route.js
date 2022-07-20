import express from "express";
const router = express.Router();
import homeController from "../controllers/mainController";

router.get("/", homeController.getHomePage);

export default router;

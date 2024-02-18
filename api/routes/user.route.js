import express from "express";
import { hello, test } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/test", test);
router.get("/hello", hello);

export default router;

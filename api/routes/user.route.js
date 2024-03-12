import express from "express";
import {  test, updateUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();


router.post("/update/:id", verifyToken, updateUser)
router.get("/test", test);


export default router;

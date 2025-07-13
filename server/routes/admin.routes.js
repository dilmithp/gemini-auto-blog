import express from 'express';
import {
    adminLogin, approveComment,
    deleteCommentById,
    getAllBlogsAdmin,
    getAllCommentsAdmin, getDashboard
} from "../controllers/admin.controller.js";
import auth from "../middleware/auth.middleware.js";

const adminRoutes = express.Router();

adminRoutes.post("/login", adminLogin);
adminRoutes.get("/comments",auth, getAllCommentsAdmin);
adminRoutes.get("/blogs",auth, getAllBlogsAdmin);
adminRoutes.post("/delete-comment",auth, deleteCommentById);
adminRoutes.post("/approve-comment",auth, approveComment);
adminRoutes.get("/dashboard",auth, getDashboard);


export default adminRoutes;
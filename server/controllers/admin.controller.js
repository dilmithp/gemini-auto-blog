import jwt from "jsonwebtoken";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";


export const adminLogin = async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (email !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password" });
        }
        const token = jwt.sign({email}, process.env.JWT_SECRET);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token
        });
    }catch(err){
        console.error("Admin login error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
export const getAllBlogsAdmin = async (req, res) => {
    try{
        const blogs = await Blog.find({}).sort({createdAt: -1});
        res.status(200).json({
            success: true,
            blogs
        });
    }catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
export const getAllCommentsAdmin = async (req, res) => {
    try{
        const comments = await Comment.find({}).sort({createdAt: -1}).populate('blog');
        res.status(200).json({
            success: true,
            comments
        });
    }catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
export const getDashboard = async (req, res) => {
    try{
        const recentBlogs = await Blog.find({}).sort({createdAt: -1}).limit(5);
        const totalBlogs = await Blog.countDocuments();
        const totalComments = await Comment.countDocuments();
        const drafts = await Blog.countDocuments({ isPublished: false });

        const dashboardData = {
            totalBlogs,
            totalComments,
            drafts,
            recentBlogs
        };
        res.status(200).json({
            success: true,
            dashboardData
        });
    }catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
export const deleteCommentById = async (req, res) => {
    try {
        const { commentId } = req.body;
        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required" });
        }
        await Comment.findByIdAndDelete(commentId);
        res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
export const approveComment = async (req, res) => {
    try {
        const { commentId } = req.body;
        if (!commentId) {
            return res.status(400).json({ message: "Comment ID is required" });
        }
        const comment = await Comment.findByIdAndUpdate(commentId, { isApproved: true });
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        comment.isApproved = true;
        await comment.save();
        res.status(200).json({
            success: true,
            message: "Comment approved successfully"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}
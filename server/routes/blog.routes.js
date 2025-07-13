import express from 'express';
import {
    addBlog,
    addComment,
    deleteBlogById, generateBlog,
    getAllBlogs,
    getBlogById,
    getComments,
    togglePublish
} from "../controllers/blog.controller.js";
import upload from "../middleware/multer.middleware.js";
import auth from "../middleware/auth.middleware.js";

const blogRoutes = express.Router();


blogRoutes.post('/add-comment', addComment);
blogRoutes.get('/comments', getComments);

// --- Blog routes ---
blogRoutes.post('/add', upload.single('image'), auth, addBlog);    // POST /api/blog/add
blogRoutes.get('/all', getAllBlogs);                               // GET /api/blog/all
blogRoutes.post('/delete', auth, deleteBlogById);                  // POST /api/blog/delete
blogRoutes.post('/toggle-publish', auth, togglePublish);           // POST /api/blog/toggle-publish
blogRoutes.get('/:blogId', getBlogById);                           // GET /api/blog/:blogId

blogRoutes.post('/generate',auth, generateBlog);

export default blogRoutes;

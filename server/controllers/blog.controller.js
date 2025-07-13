import fs from "fs";
import imagekit from "../configs/imagekit.js";
import Blog from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import main from "../configs/gemini.js";

// Add a new blog post
export const addBlog = async (req, res) => {
    try {
        // Parse blog data from form-data field "blog"
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        if (!title || !subTitle || !description || !category || typeof isPublished === "undefined" || !imageFile) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);

        // Upload image to ImageKit
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        });

        // Optimize and transform the image
        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: 1280 }
            ]
        });

        const image = optimizedImageUrl;

        await Blog.create({ title, subTitle, description, category, image, isPublished });

        res.status(201).json({
            success: true,
            message: "Blog added successfully"
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

// Get all published blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true });
        res.status(200).json({
            success: true,
            blogs
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

// Get a single blog by ID
export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        res.status(200).json({
            success: true,
            blog
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

// Delete a blog by ID
export const deleteBlogById = async (req, res) => {
    try {
        const { blogId } = req.body;
        // Find and delete the blog
        const blog = await Blog.findByIdAndDelete(blogId);
        // Delete all comments for this blog
        await Comment.deleteMany({ blog: blogId });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

// Toggle publish state of a blog
export const togglePublish = async (req, res) => {
    try {
        const { blogId } = req.body;
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.status(200).json({
            success: true,
            message: blog.isPublished ? "Blog published successfully" : "Blog unpublished successfully"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

// Add a comment to a blog
export const addComment = async (req, res) => {
    try {
        const { blogId, name, content } = req.body;
        if (!blogId || !name || !content) {
            return res.status(400).json({
                success: false,
                message: "Blog ID, name, and content are required"
            });
        }
        await Comment.create({ blog: blogId, name, content });
        res.status(201).json({
            success: true,
            message: "Comment added for review"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};

// Get approved comments for a blog
export const getComments = async (req, res) => {
    try {
        // Use query parameters for GET requests
        const blogId = req.query.blogId;
        if (!blogId) {
            return res.status(400).json({
                success: false,
                message: "Blog ID is required"
            });
        }
        const comments = await Comment.find({ blog: blogId, isApproved: true }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            comments
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
};
export const generateBlog = async (req, res) => {
    try{
        const {prompt} = req.body;
        const content = await main(prompt + 'Generate a blog post with this topic. The blog should be at least 1000 words long and include a title, ' +
            'subtitle, and description. The blog should be well-structured and engaging.Use simple text formatting like headings, paragraphs, and lists. ');
        res.status(200).json({
            success: true,
            content
        })
    }catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: e.message
        });
    }
}

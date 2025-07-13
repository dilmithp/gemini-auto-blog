import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subTitle: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    image:{
        type: String,
        required: true,
    },
    isPublished:{
        type: Boolean,
        required:true
    }
},{timestamps: true});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
import React from 'react';
import { assets } from "../../assets/assets.js";
import { useAppContext } from "../../context/App.context.jsx";
import { toast } from "react-hot-toast";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
    const { title, createdAt } = blog;
    const BlogDate = new Date(createdAt);
    const { axios } = useAppContext();

    const deleteBlog = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (!confirmDelete) return;
        try {
            const { data } = await axios.post('/api/blog/delete', { blogId: blog._id });
            if (data.success) {
                toast.success(data.message);
                await fetchBlogs();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const togglePublish = async () => {
        try {
            const { data } = await axios.post('/api/blog/toggle-publish', { blogId: blog._id });
            if (data.success) {
                toast.success(data.message);
                await fetchBlogs();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    return (
        <tr className={'border-y border-gray-300'}>
            <td className={'px-2 py-4'}>{index}</td>
            <td className={'px-2 py-4 max-sm:hidden'}>{title}</td>
            <td className={'px-2 py-4 max-sm:hidden'}>{BlogDate.toDateString()}</td>
            <td className={'px-2 py-4 max-sm:hidden'}>
                <p className={blog.isPublished ? 'text-green-600' : 'text-orange-700'}>
                    {blog.isPublished ? 'Published' : 'Unpublished'}
                </p>
            </td>
            <td className={'px-2 py-4 flex text-xs gap-3'}>
                <button onClick={togglePublish}
                        className={'border px-2 py-0.5 mt-1 rounded cursor-pointer'}>
                    {blog.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <img onClick={deleteBlog}
                     src={assets.cross_icon} alt={'cross'} className={'w-8 hover:scale-110 cursor-pointer transition-all'} />
            </td>
        </tr>
    );
};

export default BlogTableItem;

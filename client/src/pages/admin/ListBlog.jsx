import React, { useEffect, useState } from 'react';
import BlogTableItem from "../../components/admin/BlogTableitem.jsx";
import { useAppContext } from "../../context/App.context.jsx";
import { toast } from "react-hot-toast";

const ListBlog = () => {
    const { axios } = useAppContext();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/admin/blogs');
            if (data.success) {
                setBlogs(data.blogs);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    return (
        <div className={'flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50'}>
            <h1>All Blogs</h1>
            <div className={'relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg bg-white scrollbar-hide'}>
                {loading ? (
                    <div className="py-10 text-center text-gray-400">Loading blogs...</div>
                ) : (
                    <table className={'w-full text-sm text-gray-500'}>
                        <thead className={'text-xs text-gray-600 text-left uppercase'}>
                        <tr>
                            <th scope={'col'} className={'px-2 py-4'}>#</th>
                            <th scope={'col'} className={'px-2 py-4'}>Blog Title</th>
                            <th scope={'col'} className={'px-2 py-4 max-sm:hidden'}>Date</th>
                            <th scope={'col'} className={'px-2 py-4 max-sm:hidden'}>Status</th>
                            <th scope={'col'} className={'px-2 py-4'}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {blogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-400">
                                    No blogs found.
                                </td>
                            </tr>
                        ) : (
                            blogs.map((blog, index) => (
                                <BlogTableItem
                                    key={blog._id}
                                    blog={blog}
                                    fetchBlogs={fetchBlogs}
                                    index={index + 1}
                                />
                            ))
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ListBlog;

import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets.js";
import Moment from 'moment';
import Loader from "../components/Loader.jsx";
import { useAppContext } from "../context/App.context.jsx";
import { toast } from "react-hot-toast";

const Blog = () => {
    const { id } = useParams();
    const { axios } = useAppContext();
    const [data, setData] = useState(null);
    const [comments, setComments] = useState([]);
    const [name, setName] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch blog data
    const fetchBlogData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/blog/${id}`);
            if (response.data.success) {
                setData(response.data.blog);
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch comments for this blog
    const fetchComments = async () => {
        try {
            // blogId must be sent as a query param for GET (per controller)
            const response = await axios.get('/api/blog/comments', { params: { blogId: id } });
            if (response.data.success) {
                setComments(response.data.comments);
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            toast.error(e.response?.data?.message || e.message);
        }
    };

    // Add a comment
    const addComment = async (e) => {
        e.preventDefault();
        if (!name.trim() || !content.trim()) {
            toast.error("Name and comment cannot be empty");
            return;
        }
        try {
            const response = await axios.post('/api/blog/add-comment', { blogId: id, name, content });
            if (response.data.success) {
                toast.success(response.data.message);
                setName("");
                setContent("");
                fetchComments(); // Refresh comments after adding
            } else {
                toast.error(response.data.message);
            }
        } catch (e) {
            toast.error(e.response?.data?.message || e.message);
        }
    };

    useEffect(() => {
        fetchBlogData();
        fetchComments();
        // eslint-disable-next-line
    }, [id]);

    if (loading || !data) return <Loader />;

    return (
        <div className="relative">
            <img src={assets.gradientBackground} alt="background" className="absolute -top-50 -z-1 opacity-50" />
            <Navbar />
            <div className="text-center mt-20 text-gray-600">
                <p className="text-primary py-4 font-medium">
                    Published On {Moment(data.createdAt).format('MMMM Do YYYY')}
                </p>
                <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">{data.title}</h1>
                <h2
                    className="my-5 mx-w-lg truncate mx-auto"
                    dangerouslySetInnerHTML={{ __html: data.subTitle }}
                ></h2>
                <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
                    STCC
                </p>
            </div>
            <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
                <img src={data.image} alt="blog" className="rounded-3xl mb-5" />
                <div className="rich-text max-w-3xl mx-auto" dangerouslySetInnerHTML={{ __html: data.description }} />

                {/* Comments Section */}
                <div className="mt-14 mb-10 max-w-3xl mx-auto">
                    <p className="font-semibold mb-4">Comments ({comments.length})</p>
                    <div className="flex flex-col gap-4">
                        {comments.length === 0 && (
                            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
                        )}
                        {comments.map((item, index) => (
                            <div
                                key={item._id || index}
                                className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <img src={assets.user_icon} alt="user_icon" className="w-6" />
                                    <p className="font-medium">{item.name}</p>
                                </div>
                                <p className="text-sm max-w-md ml-8">{item.content}</p>
                                <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                                    {Moment(item.createdAt).fromNow()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Add Comment Section */}
                <div className="max-w-3xl mx-auto">
                    <p className="font-semibold mb-4">Add comments</p>
                    <form onSubmit={addComment} className="flex flex-col gap-4 items-start max-w-lg">
                        <input
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            type="text"
                            placeholder="Name"
                            required
                            className="w-full p-2 border border-gray-300 rounded outline-none"
                        />
                        <textarea
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                            placeholder="Comment"
                            required
                            className="w-full p-2 border border-gray-300 rounded outline-none h-48"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer"
                        >
                            Submit
                        </button>
                    </form>
                </div>
                {/* Social Links */}
                <div className="my-24 max-w-3xl mx-auto">
                    <p className="font-semibold my-4">Share this Article on social media</p>
                    <div className="flex">
                        <img src={assets.facebook_icon} width={50} alt="facebook" />
                        <img src={assets.twitter_icon} width={50} alt="twitter" />
                        <img src={assets.googleplus_icon} width={50} alt="googlePlus" />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Blog;

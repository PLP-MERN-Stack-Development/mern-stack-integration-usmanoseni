// (imports already at top)
import Button from "./Button";
import CreatePost from "./CreatePost";
import { categoryService, postService } from "../client/src/services/api";
import { useState, useEffect } from "react";

const PostList = () => {
  const [add, setAdd] = useState(false);
    const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);

  const handleAddPost = (post = null) => {
    setEditingPost(post);
    setAdd(true);
  };

  const handleDeletePost = async () => {
    if (!deletingPost) return;
    
    try {
      await postService.deletePost(deletingPost._id);
      setDeletingPost(null);
      fetchPosts(); // Refresh the posts list
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setAdd(false);
    setEditingPost(null);
    // refresh posts after modal closes
    fetchPosts();
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);
  
    // Fetch posts (with optional category and search)
    const fetchPosts = async () => {
        try {
            const data = await postService.getAllPosts(1, 20, selectedCategory || null, search || null);
            setPosts(data || []);
        } catch (err) {
            console.error('Error fetching posts:', err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // refetch when category changes
    useEffect(() => {
      fetchPosts();
    }, [selectedCategory]);
    
    return (
        <div className="relative top-16 h-100vh m-4 rounded-xl bg-slate-50/90 flex flex-col gap-4 justify-center items-center">
            <div className="flex justify-center items-center flex-col p-6 w-5/6 md:w-4/5">
                <div className="flex flex-col gap-4 justify-center items-center w-full">
                    <h2 className="font-semibold text-2xl md:text-3xl text-indigo-500 text-center  ">Welcome To MyBlog Page</h2>
                <p className="text-gray-800/80 md:text-center md:w-5/6  text-sm">Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem officia eum nemo earum distinctio ad. Eaque esse nesciunt natus officia hic? Explicabo cum similique iure velit temporibus debitis accusantium placeat? Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>       </div>
                <div className="flex justify-around flex-col md:flex-row items-center w-full gap-2 mt-6">
          <div className="flex gap-3 w-full">
                <input
                    type="text"
                    placeholder="Search blog title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-grow px-4 py-1 md:py-1 border rounded-lg 
                    bg-gray-50 text-gray-800
                    focus:outline-none focus:border-none  focus:ring-2 focus:ring-indigo-500  placeholder:text-sm
                    dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-300 dark:border-gray-600"
                />
            <Button variant="primary_one" size="sm" onClick={fetchPosts}>Search</Button>
          </div>
          <Button variant="primary_two" size="xs" onClick={handleAddPost}>
            Add Post
          </Button>
        </div>
      <hr className="w-full h-0.5 bg-red-200/80 my-4" />

        <div className="flex justify-end w-full ">
            <div>
            <select
                    name="category"
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); }}
                    className="flex-grow w-full px-4 py-1 text-xs md:py-1 border rounded-md bg-gray-50/80 text-gray-800/80
                    focus:outline-none focus:border-none focus:ring-2 focus:ring-indigo-500 placeholder:text-sm
                    dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-300 dark:border-gray-600 mb-2">
                    <option value="">
                        All Categories
                    </option>
                    {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                </select>
            </div>
        </div>
                <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
                    {posts.length === 0 && (
                        <div className="col-span-full text-center text-gray-500">No posts found.</div>
                    )}
                    {posts.map((post) => {
                        const imageUrl = post.featuredImage
                            ? `${import.meta.env.VITE_API_URI?.replace(/\/$/, '') || ''}${post.featuredImage}`
                            : 'https://via.placeholder.com/800x450?text=No+Image';
                        return (
                            <div key={post._id} className="w-full bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden border border-gray-200">
                                <div className="w-full h-48 md:h-56 overflow-hidden rounded-t-xl">
                                    <img src={imageUrl} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                </div>

                                <div className="p-4 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                            {post.category?.name || 'Uncategorized'}
                                        </span>
                                        <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <h3 className="font-semibold text-lg text-gray-800 mt-1">{post.title}</h3>

                                    <p className="text-gray-600 text-sm leading-snug">{post.excerpt || post.content?.slice(0, 160) + '...'}</p>

                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-xs text-gray-500 italic">By {post.author?.name || post.author?.email || 'Author'}</span>
                                        <div className="flex gap-3">
                                            <Button variant="secondary" size="xs" onClick={() => handleAddPost(post)}>Edit</Button>
                                            <Button variant="danger" size="xs" onClick={() => setDeletingPost(post)}>Delete</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
      </div>

      {add && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
            <CreatePost onClose={handleCloseModal} post={editingPost} onSaved={() => fetchPosts()} />
        </div>
      )}

      {deletingPost && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{deletingPost.title}"? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" size="sm" onClick={() => setDeletingPost(null)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={handleDeletePost}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </div>
    ) 
}
export default PostList;
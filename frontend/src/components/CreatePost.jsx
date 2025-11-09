import {useState, useEffect} from "react";
import Button from "./Button"; // optional if you already have a Button component
import { categoryService, postService, authService } from "../client/src/services/api"

const CreatePost = ({ onClose, post = null, onSaved }) => { 
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ title: "", content: "", category: "", excerpt: "", featuredImage: null, tags: [] });
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the current user from localStorage
      const currentUser = authService.getCurrentUser();
      console.debug('CreatePost: currentUser ->', currentUser);

      // If user isn't logged in, show UI message and stop (don't throw)
      if (!currentUser || !(currentUser._id || currentUser.id)) {
        alert('You must be logged in to create a post. Please log in and try again.');
        return;
      }
      const authorId = currentUser._id || currentUser.id;

      // Build form data for create or update
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('excerpt', formData.excerpt);
      data.append('category', formData.category);
      data.append('author', authorId);
      if (formData.tags && formData.tags.length > 0) {
        data.append('tags', JSON.stringify(formData.tags));
      }
      if (formData.featuredImage) {
        data.append('featuredImage', formData.featuredImage);
      }

      let response;
      if (isEditing && formData._id) {
        // Update existing post
        response = await postService.updatePost(formData._id, data);
        console.log('Post updated successfully:', response);
        alert('Post updated successfully.');
      } else {
        // Create new post
        response = await postService.createPost(data);
        console.log('Post created successfully:', response);
        alert('Post created successfully.');
      }

      // Clear form and notify parent
      setFormData({ title: '', content: '', category: '', excerpt: '', featuredImage: null, tags: [] });
      setIsEditing(false);
      if (typeof onSaved === 'function') onSaved(response);
      if (typeof onClose === 'function') onClose();
    } catch (err) {
      console.error('Error creating/updating post:', err);
      const errorMessage = err?.response?.data?.errors?.[0]?.msg
        || err?.response?.data?.message
        || err?.message
        || 'Failed to create/update post';
      alert(`❌ Error: ${errorMessage}. Please try again.`);
    }
  }
    
  useEffect(() => {
    const fetchCategories = async ()  => {
      try {
        const category = await categoryService.getAllCategories();
      setCategories(category || [])
      }
      catch (err) {
        console.error("it dispaly these error".err)
      }
    }
    fetchCategories()
  },[])

  // Prefill form when editing
  useEffect(() => {
    if (post) {
      setIsEditing(true);
      setFormData({
        _id: post._id,
        title: post.title || '',
        content: post.content || '',
        category: post.category?._id || post.category || '',
        excerpt: post.excerpt || '',
        featuredImage: null,
        tags: post.tags || [],
      });
    }
  }, [post]);

  return (
       <div className="flex flex-col gap-4 p-6 w-5/6 md:w-4/5 ">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow">
            <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="flex-grow">
                    <label className="block font-medium text-sm mb-1 text-gray-700">Title</label>
                    <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    type="text"
                    maxLength="100"
                    required
                    placeholder="Enter post title"
                    className="flex-grow w-full px-4 py-1 md:py-1 text-sm border rounded-md bg-gray-50 text-gray-800
                    focus:outline-none focus:border-none focus:ring-2 focus:ring-indigo-500 placeholder:text-sm
                    dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-300 dark:border-gray-600"
                    />
                </div> 
                <div>
                    <label className="block font-medium text-sm mb-1 text-gray-700">Category </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="flex-grow w-full px-4 py-1 text-xs md:py-1 border rounded-md bg-gray-50/80 text-gray-800/80
            focus:outline-none focus:border-none focus:ring-2 focus:ring-indigo-500 placeholder:text-sm
            dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-300 dark:border-gray-600">
                        <option value="" disabled>
                        -- Select a Category --
                        </option>
                        {categories.map((cat) => (
                           <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>
          <div>
         <label className="block font-medium text-sm mb-1 text-gray-700">Content</label>
              <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="4"
              required
              placeholder="Write your content here..."
                className="flex-grow w-full px-4 py-1 text-sm md:py-1 border rounded-md bg-gray-50 text-gray-800
                focus:outline-none focus:border-none  focus:ring-2 focus:ring-indigo-500  placeholder:text-sm
                dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-300 dark:border-gray-600"
            ></textarea>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">Excerpt </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              rows="2"
              required
              placeholder="Write your content here..."
                className="flex-grow w-full px-4 py-1 text-sm md:py-1 border rounded-md bg-gray-50 text-gray-800
                focus:outline-none focus:border-none  focus:ring-2 focus:ring-indigo-500  placeholder:text-sm
                dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-300 dark:border-gray-600"
            ></textarea>
          </div>

          {/* Featured Image */}
          <div>
            <label className="block font-medium text-sm mb-1 text-gray-700">Featured Image </label>
            <input
              type="file"
              name="featuredImage"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-xs text-gray-700 hover:cursor-pointer border rounded-md border-gray-300 h-10 p-2 text-center" 
            />
          </div>
         <div className="flex justify-end gap-3">
            <Button variant="secondary" size="xs" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary_one" size="xs" type="submit">
              Submit Post
            </Button>
          </div>
        </form>
      </div>
  );
};

export default CreatePost;

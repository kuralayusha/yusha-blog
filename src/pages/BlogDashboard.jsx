import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import BlogList from './BlogList';
import TagInput from './TagInput';

const fetchBlogs = async () => {
  const response = await fetch('/blogs.json');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

const BlogDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!data || !data.blogs) return;

    let filtered = data.blogs;

    if (selectedTags.length > 0) {
      filtered = filtered.filter(blog =>
        selectedTags.some(tag => blog.tags.includes(tag))
      );
    }

    if (selectedBlog) {
      filtered = filtered.filter(blog => blog.id === selectedBlog.id);
    }

    setFilteredBlogs(filtered);
  }, [data, selectedTags, selectedBlog]);

  const handleInputChange = (value) => {
    setSearchTerm(value);
  };

  const handleBlogSelect = (blog) => {
    setSelectedBlog(blog);
    setSelectedTags(blog.tags);
  };

  const handleTagSelect = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedBlog(null);
    setSearchTerm('');
    setFilteredBlogs(data.blogs);
  };

  const handleTagClick = (tag) => {
    handleTagSelect(tag);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <TagInput
        allTags={data.tags}
        allBlogs={data.blogs}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        onInputChange={handleInputChange}
        onBlogSelect={handleBlogSelect}
        onTagSelect={handleTagSelect}
        clearFilters={clearFilters}
        searchTerm={searchTerm}
      />
      <BlogList
        filteredBlogs={filteredBlogs}
        allBlogs={data.blogs}
        selectedTags={selectedTags}
        selectedBlog={selectedBlog}
        searchTerm={searchTerm}
        onTagClick={handleTagClick}
      />
    </div>
  );
};

export default BlogDashboard;
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (data && data.blogs) {
      filterBlogs();
    }
  }, [data, selectedTags, selectedBlog]);

  const filterBlogs = () => {
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
  };

  const handleInputChange = () => {
    // Do nothing, as we don't want to filter live
  };

  const handleBlogSelect = (blog) => {
    setSelectedBlog(blog);
  };

  const handleTagSelect = (tag) => {
    setSelectedTags([...selectedTags, tag]);
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
      />
      <BlogList
        filteredBlogs={filteredBlogs}
        selectedTags={selectedTags}
        selectedBlog={selectedBlog}
      />
    </div>
  );
};

export default BlogDashboard;
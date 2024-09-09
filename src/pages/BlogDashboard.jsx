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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (data && data.blogs) {
      filterBlogs();
    }
  }, [data, selectedTags, searchTerm]);

  const filterBlogs = () => {
    if (!data || !data.blogs) return;

    let filtered = data.blogs;

    if (selectedTags.length > 0) {
      filtered = filtered.filter(blog =>
        selectedTags.some(tag => blog.tags.includes(tag))
      );
    }

    if (searchTerm) {
      const lowercaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title.toLowerCase().includes(lowercaseSearchTerm)
      );
    }

    setFilteredBlogs(filtered);
  };

  const handleInputChange = (value) => {
    if (!value.startsWith('#')) {
      setSearchTerm(value);
    }
  };

  const handleBlogSelect = (blog) => {
    setSearchTerm(blog.title);
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
      />
      <BlogList
        filteredBlogs={filteredBlogs}
        selectedTags={selectedTags}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default BlogDashboard;
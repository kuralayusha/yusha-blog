import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { CalendarIcon, ArrowRightIcon, XCircleIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

  useEffect(() => {
    if (data && data.blogs) {
      filterBlogs();
    }
  }, [data, selectedTags]);

  const filterBlogs = () => {
    if (selectedTags.length === 0) {
      setFilteredBlogs(data.blogs);
    } else {
      const exactMatches = data.blogs.filter(blog =>
        selectedTags.every(tag => blog.tags.includes(tag))
      );
      const partialMatches = data.blogs.filter(blog =>
        !exactMatches.includes(blog) && selectedTags.some(tag => blog.tags.includes(tag))
      );
      const otherBlogs = data.blogs.filter(blog =>
        !exactMatches.includes(blog) && !partialMatches.includes(blog)
      );
      setFilteredBlogs([...exactMatches, ...partialMatches, ...otherBlogs]);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <TagInput
        allTags={data.tags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
      <BlogList
        filteredBlogs={filteredBlogs}
        selectedTags={selectedTags}
      />
    </div>
  );
};

export default BlogDashboard;
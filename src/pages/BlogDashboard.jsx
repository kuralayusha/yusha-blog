import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { CalendarIcon, ArrowRightIcon, XCircleIcon } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const fetchBlogs = async () => {
  const response = await fetch('/blogs.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const BlogDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (data && data.blogs) {
      filterBlogs();
    }
  }, [data, selectedTags]);

  useEffect(() => {
    if (data && data.tags) {
      const matchedTags = data.tags.filter(tag => 
        tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag)
      );
      setSuggestions(matchedTags);
    }
  }, [tagInput, data, selectedTags]);

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

  const handleTagClick = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTagInput = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagSelection = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput('');
    setSuggestions([]);
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 relative">
        <Input
          type="text"
          placeholder="Enter tags (e.g., #react #javascript)"
          value={tagInput}
          onChange={handleTagInput}
          className="mb-2"
        />
        {suggestions.length > 0 && (
          <div className="absolute z-10 bg-white border border-gray-300 w-full mt-1">
            {suggestions.map(tag => (
              <div
                key={tag}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleTagSelection(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map(tag => (
            <Button
              key={tag}
              variant="outline"
              size="sm"
              onClick={() => removeTag(tag)}
              className="flex items-center"
            >
              {tag}
              <XCircleIcon className="ml-2 h-4 w-4" />
            </Button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <p className="text-sm text-gray-600">
            Filtering by: {selectedTags.join(', ')}
          </p>
        )}
      </div>

      <div className="space-y-6">
        {filteredBlogs.map((blog, index) => (
          <React.Fragment key={blog.id}>
            {index === 0 && selectedTags.length > 0 && (
              <h2 className="text-xl font-semibold mb-4">
                Blogs matching all selected tags:
              </h2>
            )}
            {index === filteredBlogs.filter(b => 
              selectedTags.every(tag => b.tags.includes(tag))
            ).length && selectedTags.length > 0 && (
              <h2 className="text-xl font-semibold mb-4">
                Blogs matching some selected tags:
              </h2>
            )}
            {index === filteredBlogs.filter(b => 
              selectedTags.some(tag => b.tags.includes(tag))
            ).length && selectedTags.length > 0 && (
              <h2 className="text-xl font-semibold mb-4">
                Other blogs:
              </h2>
            )}
            <Link to={`/${blog.slug}`}>
              <Card className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="flex">
                    <div className="w-1/4 relative">
                      <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="w-3/4 p-4">
                      <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                      <p className="text-sm text-gray-600 mb-2">{blog.author}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        <span>{new Date(blog.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {blog.tags.map(tag => (
                          <Button
                            key={tag}
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              handleTagClick(tag);
                            }}
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                      <ArrowRightIcon className="w-4 h-4 ml-auto" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BlogDashboard;
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

const BlogList = ({ filteredBlogs, allBlogs, selectedTags, searchTerm, onTagClick }) => {
  const exactMatches = filteredBlogs.filter(blog => 
    selectedTags.every(tag => blog.tags.includes(tag))
  );
  const partialMatches = filteredBlogs.filter(blog => 
    !exactMatches.includes(blog) && selectedTags.some(tag => blog.tags.includes(tag))
  );
  const otherBlogs = allBlogs.filter(blog => 
    !exactMatches.includes(blog) && !partialMatches.includes(blog)
  );

  const renderBlogSection = (blogs, title) => {
    if (blogs.length === 0) return null;

    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="flex flex-wrap gap-4">
          {blogs.map(blog => (
            <Card key={blog.id} className="w-64 hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <Link to={`/${blog.slug}`} className="block">
                  <img src={blog.image} alt={blog.title} className="w-full h-32 object-cover mb-2 rounded" />
                  <h2 className="text-lg font-semibold mb-1 line-clamp-2">{blog.title}</h2>
                  <p className="text-sm text-gray-600 mb-1">{blog.author}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <CalendarIcon className="w-4 h-4 mr-1" />
                    <span>{new Date(blog.date).toLocaleDateString()}</span>
                  </div>
                </Link>
                <div className="flex flex-wrap gap-1 mt-2" onClick={(e) => e.preventDefault()}>
                  {blog.tags.map(tag => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onTagClick(tag);
                      }}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (filteredBlogs.length === 0 && (searchTerm || selectedTags.length > 0)) {
    return (
      <p className="text-gray-600 text-center text-lg my-8">
        No blogs found matching your criteria. Try adjusting your search or filters.
      </p>
    );
  }

  if (filteredBlogs.length === 0 && !searchTerm && selectedTags.length === 0) {
    return renderBlogSection(allBlogs, "All Blogs:");
  }

  return (
    <div>
      {selectedTags.length > 0 ? (
        <>
          {renderBlogSection(exactMatches, "Blogs matching all selected tags:")}
          {renderBlogSection(partialMatches, "Blogs matching some selected tags:")}
          {renderBlogSection(otherBlogs, "Other blogs:")}
        </>
      ) : searchTerm ? (
        <>
          {renderBlogSection(filteredBlogs, `Search results for "${searchTerm}"`)}
          {renderBlogSection(otherBlogs, "Other blogs:")}
        </>
      ) : (
        renderBlogSection(allBlogs, "All Blogs:")
      )}
    </div>
  );
};

export default BlogList;
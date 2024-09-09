import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

const BlogList = ({ filteredBlogs, selectedTags, searchTerm }) => {
  const exactMatches = filteredBlogs.filter(blog => 
    selectedTags.every(tag => blog.tags.includes(tag))
  );
  const partialMatches = filteredBlogs.filter(blog => 
    !exactMatches.includes(blog) && selectedTags.some(tag => blog.tags.includes(tag))
  );
  const otherBlogs = filteredBlogs.filter(blog => 
    !exactMatches.includes(blog) && !partialMatches.includes(blog)
  );

  const renderBlogSection = (blogs, title) => {
    if (blogs.length === 0) {
      return (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <p className="text-gray-600">
            No blogs found matching {selectedTags.length > 0 ? selectedTags.join(', ') : searchTerm}
          </p>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="space-y-6">
          {blogs.map(blog => (
            <Link to={`/${blog.slug}`} key={blog.id}>
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
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {selectedTags.length > 0 ? (
        <>
          {renderBlogSection(exactMatches, "Blogs matching all selected tags:")}
          {renderBlogSection(partialMatches, "Blogs matching some selected tags:")}
          {renderBlogSection(otherBlogs, "Other blogs:")}
        </>
      ) : searchTerm ? (
        renderBlogSection(filteredBlogs, `Search results for "${searchTerm}":`)
      ) : (
        renderBlogSection(filteredBlogs, "All Blogs:")
      )}
    </div>
  );
};

export default BlogList;
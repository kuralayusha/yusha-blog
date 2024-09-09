import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

const BlogList = ({ filteredBlogs, selectedTags }) => {
  return (
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
  );
};

export default BlogList;
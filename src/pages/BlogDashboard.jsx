import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { CalendarIcon, ArrowRightIcon } from 'lucide-react';

const fetchBlogs = async () => {
  const response = await fetch('/blogs.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const BlogDashboard = () => {
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Yayın Akışı</h1>
        <div className="flex items-center">
          <span className="mr-2">Filtrele:</span>
          <select className="border rounded p-1">
            <option>TÜMÜ</option>
          </select>
        </div>
      </div>
      <div className="space-y-6">
        {blogs.map((blog) => (
          <Link to={`/${blog.slug}`} key={blog.id}>
            <Card className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex">
                  <div className="w-1/4 relative">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                    <div className="absolute top-0 left-0 bg-orange-500 text-white px-2 py-1 text-xs uppercase">
                      {blog.category || 'Uncategorized'}
                    </div>
                  </div>
                  <div className="w-3/4 p-4">
                    <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                    <p className="text-sm text-gray-600 mb-2">{blog.author}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                      <ArrowRightIcon className="w-4 h-4 ml-auto" />
                    </div>
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

export default BlogDashboard;
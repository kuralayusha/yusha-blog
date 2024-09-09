import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';

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
      <h1 className="text-3xl font-bold mb-6">Blog Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link to={`/${blog.slug}`} key={blog.id}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded-t-lg" />
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2">{blog.title}</CardTitle>
                <p className="text-sm text-gray-600 mb-2">By {blog.author}</p>
                <p className="text-sm text-gray-500">{new Date(blog.date).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogDashboard;
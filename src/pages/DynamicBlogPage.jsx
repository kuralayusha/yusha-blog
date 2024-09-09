import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const fetchBlogs = async () => {
  const response = await fetch('/blogs.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const DynamicBlogPage = () => {
  const { blogName } = useParams();
  const [tableOfContents, setTableOfContents] = useState([]);
  const { data: blogs, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  const blog = blogs?.find(blog => blog.slug === blogName);

  useEffect(() => {
    if (blog) {
      const toc = blog.content
        .filter(item => item.type === 'heading')
        .map(heading => ({
          id: `heading-${heading.text.toLowerCase().replace(/\s+/g, '-')}`,
          text: heading.text,
          level: heading.level,
        }));
      setTableOfContents(toc);
    }
  }, [blog]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!blog) return <div>Blog not found</div>;

  const currentIndex = blogs.findIndex(b => b.slug === blogName);
  const prevBlog = blogs[currentIndex - 1];
  const nextBlog = blogs[currentIndex + 1];

  const renderContent = (content) => {
    return content.map((item, index) => {
      switch (item.type) {
        case 'heading':
          const HeadingTag = `h${item.level}`;
          const id = `heading-${item.text.toLowerCase().replace(/\s+/g, '-')}`;
          return <HeadingTag key={index} id={id}>{item.text}</HeadingTag>;
        case 'paragraph':
          return <p key={index}>{item.text}</p>;
        case 'image':
          return (
            <Dialog key={index}>
              <DialogTrigger>
                <img src={item.src} alt={item.alt} className="my-4 cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <img src={item.src} alt={item.alt} className="w-full" />
              </DialogContent>
            </Dialog>
          );
        case 'code':
          return (
            <SyntaxHighlighter key={index} language={item.language} style={tomorrow}>
              {item.code}
            </SyntaxHighlighter>
          );
        default:
          return null;
      }
    });
  };

  return (
    <div className="flex">
      <div className="w-1/4 p-4 fixed h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">All Blogs</h2>
        <ul>
          {blogs.map((blog) => (
            <li key={blog.id} className="mb-2">
              <Link to={`/${blog.slug}`} className="text-blue-500 hover:underline">
                {blog.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/2 p-4 mx-auto">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <p className="text-gray-600 mb-4">By {blog.author} | {new Date(blog.date).toLocaleDateString()}</p>
        {renderContent(blog.content)}
        <div className="flex justify-between mt-8">
          {prevBlog && (
            <Link to={`/${prevBlog.slug}`}>
              <Button>&larr; {prevBlog.title}</Button>
            </Link>
          )}
          {nextBlog && (
            <Link to={`/${nextBlog.slug}`}>
              <Button>{nextBlog.title} &rarr;</Button>
            </Link>
          )}
        </div>
      </div>
      <div className="w-1/4 p-4 fixed right-0 h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Table of Contents</h2>
        <ul>
          {tableOfContents.map((item, index) => (
            <li key={index} className={`ml-${(item.level - 1) * 4}`}>
              <a href={`#${item.id}`} className="text-blue-500 hover:underline">{item.text}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DynamicBlogPage;
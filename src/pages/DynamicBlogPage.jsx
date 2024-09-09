import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { CalendarIcon } from 'lucide-react';

const fetchBlogs = async () => {
  const response = await fetch('/blogs.json');
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

const BlogContent = ({ blog, tableOfContents }) => (
  <div className="lg:w-3/4">
    <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
    <p className="text-gray-600 mb-4">By {blog.author} | {new Date(blog.date).toLocaleDateString()}</p>

    <div className="lg:hidden mb-6">
      <h2 className="text-xl font-bold mb-2">Table of Contents</h2>
      <ul>
        {tableOfContents.map((item, index) => (
          <li key={index} className={`ml-${(item.level - 1) * 4}`}>
            <a href={`#${item.id}`} className="text-blue-500 hover:underline">{item.text}</a>
          </li>
        ))}
      </ul>
    </div>

    {renderContent(blog.content)}
  </div>
);

const SimilarBlogs = ({ similarBlogs }) => (
  <div className="mt-8">
    <h2 className="text-xl font-bold mb-4">Similar Blogs</h2>
    <div className="flex overflow-x-auto space-x-4 pb-4">
      {similarBlogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  </div>
);

const BlogCard = ({ blog }) => (
  <Card className="w-64 flex-shrink-0 hover:shadow-md transition-shadow duration-300">
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
      <div className="flex flex-wrap gap-1 mt-2">
        {blog.tags.map(tag => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add tag filtering logic here
            }}
          >
            {tag}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

const AllBlogs = ({ allBlogs, currentBlogId }) => (
  <div className="lg:w-1/4 hidden lg:block">
    <div className="sticky top-4">
      <h2 className="text-xl font-bold mb-4">All Blogs</h2>
      <ul>
        {allBlogs.filter(blog => blog.id !== currentBlogId).map((blog) => (
          <li key={blog.id} className="mb-2">
            <Link to={`/${blog.slug}`} className="text-blue-500 hover:underline">
              {blog.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const renderContent = (content) => {
  if (!content || !Array.isArray(content.content)) {
    return <div>No content available</div>;
  }

  return content.content.map((item, index) => {
    switch (item.type) {
      case 'heading':
        if (!item.content || !item.content[0] || !item.content[0].text) return null;
        const HeadingTag = `h${item.attrs.level || 1}`;
        const id = `heading-${item.content[0].text.toLowerCase().replace(/\s+/g, '-')}`;
        return <HeadingTag key={index} id={id}>{item.content[0].text}</HeadingTag>;
      case 'paragraph':
        return <p key={index}>{item.content ? item.content.map(c => c.text).join('') : ''}</p>;
      case 'image':
        return (
          <Dialog key={index}>
            <DialogTrigger>
              <img src={item.attrs.src} alt={item.attrs.alt} className="my-4 cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <img src={item.attrs.src} alt={item.attrs.alt} className="w-full" />
            </DialogContent>
          </Dialog>
        );
      case 'codeBlock':
        return (
          <SyntaxHighlighter key={index} language={item.attrs.language} style={tomorrow}>
            {item.content ? item.content.map(c => c.text).join('') : ''}
          </SyntaxHighlighter>
        );
      default:
        return null;
    }
  });
};

const DynamicBlogPage = () => {
  const { blogName } = useParams();
  const [tableOfContents, setTableOfContents] = useState([]);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
  });

  const blog = data?.blogs ? data.blogs.find(blog => blog.slug === blogName) : null;

  useEffect(() => {
    if (blog && blog.content && Array.isArray(blog.content.content)) {
      const toc = blog.content.content
        .filter(item => item.type === 'heading' && item.content && item.content[0] && item.content[0].text)
        .map(heading => ({
          id: `heading-${heading.content[0].text.toLowerCase().replace(/\s+/g, '-')}`,
          text: heading.content[0].text,
          level: heading.attrs.level,
        }));
      setTableOfContents(toc);
    }

    if (blog && data?.blogs) {
      const otherBlogs = data.blogs.filter(b => b.id !== blog.id);
      const similarBlogs = otherBlogs
        .map(b => ({
          ...b,
          matchScore: b.tags.filter(tag => blog.tags.includes(tag)).length,
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 3);
      setSimilarBlogs(similarBlogs);
    }
  }, [blog, data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/blog" className="inline-block mb-4">
        <Button variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Return to Dashboard
        </Button>
      </Link>

      <div className="lg:flex lg:space-x-8">
        <BlogContent blog={blog} tableOfContents={tableOfContents} />
        <AllBlogs allBlogs={data.blogs} currentBlogId={blog.id} />
      </div>

      <SimilarBlogs similarBlogs={similarBlogs} />
    </div>
  );
};

export default DynamicBlogPage;
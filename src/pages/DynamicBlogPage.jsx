import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ChevronLeft, CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const fetchBlogs = async () => {
  const response = await fetch("/blogs.json");
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

const TableOfContents = ({ items }) => (
  <div className="lg:w-1/4 lg:sticky lg:top-4 lg:self-start mb-6 lg:mb-0">
    <h2 className="text-xl font-bold mb-2">Table of Contents</h2>
    <ul>
      {items.map((item, index) => (
        <li key={index} className={`ml-${(item.level - 1) * 4}`}>
          <a href={`#${item.id}`} className="text-blue-500 hover:underline">
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const BlogContent = ({ blog, tableOfContents }) => (
  <div className="lg:w-3/4">
    <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
    <p className="text-gray-600 mb-4">
      By {blog.author} | {new Date(blog.date).toLocaleDateString()}
    </p>
    <div className="lg:hidden mb-6">
      <TableOfContents items={tableOfContents} />
    </div>
    {renderContent(blog.content)}
  </div>
);

const SimilarBlogs = ({ similarBlogs }) => (
  <div className="mt-8">
    <h2 className="text-xl font-bold mb-4">Similar Blogs</h2>
    <div className="flex flex-wrap justify-center gap-4">
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
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-32 object-cover mb-2 rounded"
        />
        <h2 className="text-lg font-semibold mb-1 line-clamp-2">
          {blog.title}
        </h2>
        <p className="text-sm text-gray-600 mb-1">{blog.author}</p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <CalendarIcon className="w-4 h-4 mr-1" />
          <span>{new Date(blog.date).toLocaleDateString()}</span>
        </div>
      </Link>
      <div className="flex flex-wrap gap-1 mt-2">
        {blog.tags.map((tag) => (
          <Button key={tag} variant="outline" size="sm">
            {tag}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

const renderContent = (content) => {
  if (!content || !Array.isArray(content.content)) {
    return <div>No content available</div>;
  }

  return content.content.map((item, index) => {
    switch (item.type) {
      case "heading":
        const HeadingTag = `h${item.attrs.level || 1}`;
        const id = `heading-${item.content[0]?.text
          ?.toLowerCase()
          .replace(/\s+/g, "-")}`;
        const headingStyle = item.attrs.level === 1 ? "text-3xl font-bold mb-4" : "text-2xl font-semibold mb-3";
        return (
          <HeadingTag key={index} id={id} className={headingStyle}>
            {item.content[0]?.text}
          </HeadingTag>
        );
      case "paragraph":
        return <p key={index} className="text-base mb-4">{item.content?.map((c) => c.text).join("")}</p>;
      case "image":
        return (
          <Dialog key={index}>
            <DialogTrigger>
              <img
                src={item.attrs.src}
                alt={item.attrs.alt}
                className="my-4 cursor-pointer"
              />
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <img
                src={item.attrs.src}
                alt={item.attrs.alt}
                className="w-full"
              />
            </DialogContent>
          </Dialog>
        );
      case "codeBlock":
        return (
          <SyntaxHighlighter
            key={index}
            language={item.attrs.language}
            style={tomorrow}
            className="my-4"
          >
            {item.content?.map((c) => c.text).join("")}
          </SyntaxHighlighter>
        );
      case "bullet_list":
        return (
          <ul key={index} className="list-disc pl-6 mb-4">
            {item.content.map((listItem, listIndex) => (
              <li key={listIndex}>{renderContent({ content: listItem.content })}</li>
            ))}
          </ul>
        );
      case "ordered_list":
        return (
          <ol key={index} className="list-decimal pl-6 mb-4">
            {item.content.map((listItem, listIndex) => (
              <li key={listIndex}>{renderContent({ content: listItem.content })}</li>
            ))}
          </ol>
        );
      case "blockquote":
        return (
          <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-4">
            {renderContent({ content: item.content })}
          </blockquote>
        );
      case "horizontal_rule":
        return <hr key={index} className="my-4" />;
      case "table":
        return (
          <table key={index} className="w-full border-collapse border border-gray-300 my-4">
            {item.content.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.content.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-gray-300 p-2">
                    {renderContent({ content: cell.content })}
                  </td>
                ))}
              </tr>
            ))}
          </table>
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
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
  });

  const blog = data?.blogs?.find((blog) => blog.slug === blogName);

  useEffect(() => {
    if (blog && blog.content?.content) {
      const toc = blog.content.content
        .filter((item) => item.type === "heading" && item.content?.[0]?.text)
        .map((heading) => ({
          id: `heading-${heading.content[0].text
            .toLowerCase()
            .replace(/\s+/g, "-")}`,
          text: heading.content[0].text,
          level: heading.attrs.level,
        }));
      setTableOfContents(toc);

      if (data?.blogs) {
        const otherBlogs = data.blogs.filter((b) => b.id !== blog.id);
        const similar = otherBlogs
          .map((b) => ({
            ...b,
            matchScore: b.tags.filter((tag) => blog.tags.includes(tag)).length,
          }))
          .sort((a, b) => b.matchScore - a.matchScore)
          .slice(0, 3);
        setSimilarBlogs(similar);
      }
    }
  }, [blog, data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-block mb-4">
        <Button variant="outline">
          <ChevronLeft className="mr-2 h-4 w-4" /> Return to Dashboard
        </Button>
      </Link>
      <div className="lg:flex lg:space-x-8">
        <BlogContent blog={blog} tableOfContents={tableOfContents} />
        <div className="hidden lg:block">
          <TableOfContents items={tableOfContents} />
        </div>
      </div>
      <SimilarBlogs similarBlogs={similarBlogs} />
    </div>
  );
};

export default DynamicBlogPage;
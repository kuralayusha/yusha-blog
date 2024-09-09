import { HomeIcon, BookOpenIcon, EditIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import BlogDashboard from "./pages/BlogDashboard.jsx";
import DynamicBlogPage from "./pages/DynamicBlogPage.jsx";
import EditorPage from "./pages/EditorPage.jsx";

export const navItems = [
  // {
  //   title: "Home",
  //   to: "/",
  //   icon: <HomeIcon className="h-4 w-4" />,
  //   page: <Index />,
  // },
  {
    title: "Blog Dashboard",
    to: "/",
    icon: <BookOpenIcon className="h-4 w-4" />,
    page: <BlogDashboard />,
  },
  {
    title: "Editor",
    to: "/editor",
    icon: <EditIcon className="h-4 w-4" />,
    page: <EditorPage />,
  },
];

export const dynamicRoutes = [
  {
    path: "/:blogName",
    element: <DynamicBlogPage />,
  },
];

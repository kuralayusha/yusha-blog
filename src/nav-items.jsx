import BlogDashboard from "./pages/BlogDashboard.jsx";
import DynamicBlogPage from "./pages/DynamicBlogPage.jsx";
import EditorPage from "./pages/EditorPage.jsx";

export const navItems = [
  {
    to: "/",
    page: <BlogDashboard />,
  },
  {
    to: "/editor",
    page: <EditorPage />,
  },
];

export const dynamicRoutes = [
  {
    path: "/:blogName",
    element: <DynamicBlogPage />,
  },
];

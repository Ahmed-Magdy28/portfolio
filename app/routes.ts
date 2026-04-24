import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

const adminRoutePath = process.env.ADMIN_ROUTE_PATH;

export default [
  layout("routes/root-layout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("projects", "routes/projects.tsx"),
    route("projects/:id", "routes/project-detail.tsx"),
    route("languages", "routes/languages.tsx"),
    route("languages/:slug", "routes/language-detail.tsx", [
      index("routes/language-about.tsx"),
      route("insights", "routes/language-insights.tsx"),
      route("interview", "routes/language-interview.tsx"),
    ]),
    route("frameworks", "routes/frameworks.tsx"),
    route("frameworks/:slug", "routes/framework-detail.tsx", [
      index("routes/framework-about.tsx"),
      route("insights", "routes/framework-insights.tsx"),
      route("interview", "routes/framework-interview.tsx"),
    ]),
    route("contact", "routes/contact.tsx"),
    route(adminRoutePath, "routes/admin.tsx"),
    route("__admin/save", "routes/admin-save.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;

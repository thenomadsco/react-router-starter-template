import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("contactus", "routes/contactus.tsx"),
] satisfies RouteConfig;

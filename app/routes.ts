import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("contactus", "routes/contactus.tsx"),
  route("london", "routes/london.tsx"), // <--- Added this line
  route("switzerland", "routes/switzerland.tsx"),
  route("france", "routes/france.tsx"),
] satisfies RouteConfig;

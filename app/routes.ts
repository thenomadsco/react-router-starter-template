import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("contactus", "routes/contactus.tsx"),
  route("london", "routes/london.tsx"), // <--- Added this line
  route("switzerland", "routes/switzerland.tsx"),
  route("france", "routes/france.tsx"),
  route("italy", "routes/italy.tsx"),
  route("maldives", "routes/maldives.tsx"),
  route("indonesia", "routes/indonesia.tsx"),
  route("thailand", "routes/thailand.tsx"),
  route("vietnam", "routes/vietnam.tsx"),
  route("uae", "routes/uae.tsx"),
] satisfies RouteConfig;

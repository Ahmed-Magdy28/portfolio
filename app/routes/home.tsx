import type { LinksFunction, MetaFunction } from "react-router";
import { Home } from "../pages/Home";

const seoTitle = "Ahmed Magdy | Frontend Web Developer in Egypt";
const seoDescription =
  "Ahmed Magdy is a Frontend Web Developer and Software Engineer in Egypt building modern, high-performance web applications with React, TypeScript, and Next.js.";

export const meta: MetaFunction = () => [
  { title: seoTitle },
  { name: "description", content: seoDescription },
  {
    name: "keywords",
    content:
      "Ahmed Magdy, frontend web developer in Egypt, software engineer in Egypt, React developer Egypt, TypeScript developer, web developer portfolio",
  },
  { name: "robots", content: "index, follow" },
  { property: "og:type", content: "website" },
  { property: "og:title", content: seoTitle },
  { property: "og:description", content: seoDescription },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: seoTitle },
  { name: "twitter:description", content: seoDescription },
];

export const links: LinksFunction = () => [{ rel: "canonical", href: "/" }];

export default Home;

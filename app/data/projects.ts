import type { Project } from "./types";

export const projects: Project[] = [
  {
    id: "ecommerce-platform",
    title: "E-Commerce Platform",
    featured: true,
    description:
      "Full-featured online shopping platform with cart, payments, and admin dashboard",
    techStack: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
    liveUrl: "https://example.com",
    sourceUrl: "https://github.com",
    fullDescription:
      "A comprehensive e-commerce solution built with the MERN stack. Features include user authentication, product catalog with search and filters, shopping cart, secure payment processing via Stripe, order management, and an admin dashboard for inventory and sales tracking.",
    challenges:
      "The main challenge was implementing real-time inventory updates across multiple user sessions. Solved this using WebSockets and optimistic UI updates with Redux. Also implemented efficient caching strategies to improve page load times by 60%.",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "task-management",
    title: "Task Management App",
    featured: true,
    description: "Collaborative project management tool with real-time updates",
    techStack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Socket.io"],
    liveUrl: "https://example.com",
    sourceUrl: "https://github.com",
    fullDescription:
      "A Trello-like task management application with drag-and-drop functionality, real-time collaboration, and team workspaces. Built with Next.js for server-side rendering and optimal performance.",
    challenges:
      "Implementing real-time collaboration without conflicts required careful consideration of race conditions. Used operational transformation techniques and optimistic updates to ensure smooth user experience.",
    video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    featured: true,
    description:
      "Beautiful weather app with forecasts and location-based recommendations",
    techStack: ["React", "TypeScript", "OpenWeather API", "Chart.js"],
    liveUrl: "https://example.com",
    fullDescription:
      "An elegant weather dashboard that displays current conditions, hourly and weekly forecasts, interactive weather maps, and personalized recommendations based on weather conditions.",
    challenges:
      "Handling API rate limits efficiently while providing real-time updates. Implemented smart caching with localStorage and background refresh strategies.",
  },
];

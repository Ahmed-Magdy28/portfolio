import type { Framework } from './types';

export const frameworks: Framework[] = [
  {
    slug: 'react',
    title: 'React',
    description: 'A JavaScript library for building user interfaces',
    icon: '⚛️',
    insights: [
      {
        id: 'react-1',
        title: 'Understanding React Hooks',
        content:
          'Hooks allow you to use state and other React features in functional components. useState and useEffect are the most commonly used hooks.',
        code: `import { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;

    return () => {
      // Cleanup
      document.title = 'React App';
    };
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
        language: 'typescript',
        video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        id: 'react-2',
        title: 'Performance Optimization',
        content:
          'Use React.memo for component memoization, useMemo for expensive calculations, and useCallback for function references to prevent unnecessary re-renders.',
        code: `import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(({ data, onUpdate }) => {
  const processed = useMemo(() => {
    return data.map(item => heavyCalculation(item));
  }, [data]);

  const handleClick = useCallback(() => {
    onUpdate(processed);
  }, [onUpdate, processed]);

  return <div onClick={handleClick}>{processed}</div>;
});`,
        language: 'typescript',
      },
    ],
    interviewQuestions: [
      {
        id: 'react-q1',
        title: 'What is the Virtual DOM?',
        content:
          'The Virtual DOM is a lightweight copy of the actual DOM. React uses it to minimize direct DOM manipulation by calculating the most efficient way to update the browser DOM.',
        difficulty: 'medium',
        video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        id: 'react-q2',
        title: 'Explain useEffect cleanup function',
        content:
          'The cleanup function in useEffect runs before the component unmounts or before the effect runs again. It is used to clean up subscriptions, timers, or event listeners to prevent memory leaks.',
        code: `useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);`,
        language: 'typescript',
        difficulty: 'medium',
      },
    ],
  },
  {
    slug: 'nextjs',
    title: 'Next.js',
    description: 'The React Framework for Production',
    icon: '▲',
    insights: [
      {
        id: 'next-1',
        title: 'Server Components vs Client Components',
        content:
          'Next.js 13+ introduces Server Components by default. Use "use client" directive only when you need interactivity, browser APIs, or React hooks.',
        code: `// Server Component (default)
async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}

// Client Component
'use client';
import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`,
        language: 'typescript',
        video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    ],
    interviewQuestions: [
      {
        id: 'next-q1',
        title: 'What are the different rendering methods in Next.js?',
        content:
          'Next.js supports Static Site Generation (SSG), Server-Side Rendering (SSR), Incremental Static Regeneration (ISR), and Client-Side Rendering (CSR). Choose based on your data freshness and performance requirements.',
        difficulty: 'hard',
      },
    ],
  },
  {
    slug: 'django',
    title: 'Django',
    description: 'High-level Python web framework',
    icon: '🎸',
    insights: [
      {
        id: 'django-1',
        title: 'ORM Best Practices',
        content:
          'Django ORM provides powerful querying capabilities. Use select_related and prefetch_related to optimize database queries and avoid N+1 problems.',
        code: `# Bad: N+1 query problem
posts = Post.objects.all()
for post in posts:
    print(post.author.name)  # Separate query for each author

# Good: Single query with join
posts = Post.objects.select_related('author').all()
for post in posts:
    print(post.author.name)`,
        language: 'python',
      },
    ],
    interviewQuestions: [
      {
        id: 'django-q1',
        title: 'Explain Django middleware',
        content:
          'Middleware is a framework of hooks into Django request/response processing. It is used for authentication, CORS headers, session management, and more. Middleware executes in order during request and in reverse during response.',
        difficulty: 'medium',
      },
    ],
  },
];

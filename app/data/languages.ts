import type { Language } from './types';

export const languages: Language[] = [
  {
    slug: 'javascript',
    title: 'JavaScript',
    description: 'Modern JavaScript ES6+ and beyond',
    icon: '📜',
    insights: [
      {
        id: 'js-1',
        title: 'Understanding Closures',
        content:
          'Closures are functions that have access to variables from an outer function scope even after the outer function has returned. This is a fundamental concept in JavaScript that enables data privacy and function factories.',
        code: `function createCounter() {
  let count = 0;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2`,
        language: 'javascript',
        video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        id: 'js-2',
        title: 'Async/Await Best Practices',
        content:
          'Async/await provides a cleaner way to work with promises. Always handle errors with try/catch, avoid blocking operations in loops, and use Promise.all for parallel operations.',
        code: `// Bad: Sequential execution
async function getBadData() {
  const user = await fetchUser();
  const posts = await fetchPosts();
  return { user, posts };
}

// Good: Parallel execution
async function getGoodData() {
  const [user, posts] = await Promise.all([
    fetchUser(),
    fetchPosts()
  ]);
  return { user, posts };
}`,
        language: 'javascript',
      },
      {
        id: 'js-3',
        title: 'Event Loop and Microtasks',
        content:
          'Understanding the event loop is crucial for writing performant JavaScript. Promises (microtasks) are executed before setTimeout callbacks (macrotasks), which can lead to unexpected behavior if not understood properly.',
        code: `console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve().then(() => console.log('3'));

console.log('4');

// Output: 1, 4, 3, 2`,
        language: 'javascript',
        video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    ],
    interviewQuestions: [
      {
        id: 'js-q1',
        title: 'What is the difference between == and ===?',
        content:
          '== performs type coercion before comparison, while === compares both value and type without coercion. Always use === to avoid unexpected behavior.\n\nExample:\n"5" == 5 returns true (type coercion)\n"5" === 5 returns false (different types)',
        difficulty: 'easy',
        video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      {
        id: 'js-q2',
        title: 'Explain event delegation in JavaScript',
        content:
          'Event delegation is a pattern that uses event bubbling to handle events at a higher level in the DOM rather than on individual elements. This improves performance when dealing with many elements and works with dynamically added elements.',
        code: `// Instead of adding listeners to each button
document.getElementById('parent').addEventListener('click', (e) => {
  if (e.target.matches('button')) {
    console.log('Button clicked:', e.target.textContent);
  }
});`,
        language: 'javascript',
        difficulty: 'medium',
      },
      {
        id: 'js-q3',
        title: 'What are JavaScript prototypes?',
        content:
          'Every JavaScript object has a prototype, which is another object from which it inherits properties and methods. This forms the prototype chain, which is the basis of inheritance in JavaScript.',
        difficulty: 'hard',
      },
    ],
  },
  {
    slug: 'python',
    title: 'Python',
    description: 'Python for web development and data science',
    icon: '🐍',
    insights: [
      {
        id: 'py-1',
        title: 'List Comprehensions',
        content:
          'List comprehensions provide a concise way to create lists. They are more readable and often faster than traditional loops.',
        code: `# Traditional approach
squares = []
for x in range(10):
    squares.append(x**2)

# List comprehension
squares = [x**2 for x in range(10)]

# With condition
even_squares = [x**2 for x in range(10) if x % 2 == 0]`,
        language: 'python',
      },
      {
        id: 'py-2',
        title: 'Decorators',
        content:
          'Decorators are a powerful feature that allows you to modify or enhance functions without changing their code. Commonly used for logging, authentication, and caching.',
        code: `def timing_decorator(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f} seconds")
        return result
    return wrapper

@timing_decorator
def slow_function():
    time.sleep(1)
    return "Done"`,
        language: 'python',
        video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    ],
    interviewQuestions: [
      {
        id: 'py-q1',
        title: 'What is the difference between a list and a tuple?',
        content:
          'Lists are mutable (can be changed after creation) while tuples are immutable. Tuples are generally faster and can be used as dictionary keys, while lists cannot.',
        difficulty: 'easy',
      },
      {
        id: 'py-q2',
        title: 'Explain generators in Python',
        content:
          'Generators are functions that use yield instead of return. They produce values lazily, one at a time, making them memory-efficient for large datasets.',
        code: `def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

for num in fibonacci(10):
    print(num)`,
        language: 'python',
        difficulty: 'medium',
        video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    ],
  },
  {
    slug: 'typescript',
    title: 'TypeScript',
    description: 'Type-safe JavaScript development',
    icon: '📘',
    insights: [
      {
        id: 'ts-1',
        title: 'Utility Types',
        content:
          'TypeScript provides powerful utility types like Partial, Required, Pick, and Omit to transform existing types.',
        code: `interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

// Make all properties optional
type PartialUser = Partial<User>;

// Pick specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit specific properties
type UserWithoutAge = Omit<User, 'age'>;`,
        language: 'typescript',
      },
    ],
    interviewQuestions: [
      {
        id: 'ts-q1',
        title: 'What are generics in TypeScript?',
        content:
          'Generics allow you to write reusable code that works with multiple types while maintaining type safety. They are like parameters for types.',
        code: `function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity<string>("hello");`,
        language: 'typescript',
        difficulty: 'medium',
      },
    ],
  },
];

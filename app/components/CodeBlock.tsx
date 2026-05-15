import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useAppSelector } from '../store/hooks';
import { useState } from 'react';
import { Play, Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const getRunnerUrl = (language: string, code: string) => {
  const encoded = encodeURIComponent(code);
  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
    case 'typescript':
    case 'ts':
    case 'html':
    case 'css':
      return `https://codepen.io/pen/?template=modern&editors=0012&code=${encoded}`;
    case 'python':
    case 'py':
      return `https://pythontutor.com/visualize.html#code=${encoded}&cumulative=false&heapPrimitives=nevernest&mode=edit&origin=opt-frontend.js&py=3&rawInputLstJSON=%5B%5D&textReferences=false`;
    case 'dart':
      return `https://dartpad.dev/?id=${encoded}`;
    case 'c':
    case 'cpp':
      return `https://godbolt.org/#g:!((g:!((g:!((h:code,i:(j:1,lang:c%2B%2B,source:'${encoded}'),l:'5',n:'0',o:'C%2B%2B+source+1',t:'0')),k:50,l:'4',n:'0',o:'',s:0,t:'0')),l:'2',n:'0',o:'',t:'0')),version:3}`;
    default:
      return null;
  }
};

export const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const theme = useAppSelector((state) => state.theme.mode);
  const [copied, setCopied] = useState(false);
  const runnerUrl = getRunnerUrl(language, code);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <span className="text-xs font-black uppercase tracking-widest opacity-50">{language}</span>
        <div className="flex items-center gap-2">
           {runnerUrl && (
              <a 
                href={runnerUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
              >
                <Play className="w-3 h-3" /> Run Online
              </a>
           )}
           <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
          >
            {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
          </button>
        </div>
      </div>
      <SyntaxHighlighter
        language={language}
        style={theme === 'dark' ? vscDarkPlus : vs}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          padding: '1.25rem',
          fontSize: '0.8125rem',
          lineHeight: '1.6',
          backgroundColor: 'transparent',
        }}
        showLineNumbers
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

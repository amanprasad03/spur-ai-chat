import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const CustomCodeBlock = ({ children }: { children: React.ReactNode }) => {
  const raw = String(children);

  const parsedHTML = raw
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
  return (
    <div
      className='bg-slate-900 border border-slate-700 rounded-md p-3 my-2 overflow-x-auto'
      style={{
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
      }}
      dangerouslySetInnerHTML={{ __html: parsedHTML }}
    />
  );
};

type MarkdownRendererProps = {
  content: string;
};

const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, children }) {
          const isInline = !node?.data?.meta;
          if (isInline) {
            return (
              <code className='bg-slate-700 text-slate-100 px-1.5 py-0.5 rounded text-sm font-mono'>
                {children}
              </code>
            );
          }
          return <CustomCodeBlock>{children}</CustomCodeBlock>;
        },
        ul: ({ children }) => (
          <ul className='list-disc pl-4 my-2 space-y-1'>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className='list-decimal pl-4 my-2 space-y-1'>{children}</ol>
        ),
        p: ({ children }) => <p className='mb-2 last:mb-0'>{children}</p>,
        a: ({ children, href }) => (
          <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className='text-indigo-300 hover:text-indigo-200 underline'
          >
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className='font-semibold'>{children}</strong>
        ),
        em: ({ children }) => <em className='italic'>{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const MarkdownRenderer = ({ children }) => {
  return (
    <ReactMarkdown
      className="prose prose-sm prose-sky max-w-none px-2"
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ ...props }) => (
          <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-800"
          />
        ),
        p: ({ ...props }) => <p {...props} className="mb-4" />,
        ul: ({ ...props }) => (
          <ul {...props} className="list-disc list-outside" />
        ),
        ol: ({ ...props }) => (
          <ol {...props} className="list-decimal list-outside" />
        ),
        code: ({ inline, className, children, ...props }) => {
          return !inline ? (
            <pre className="p-4 rounded-lg bg-gray-800 text-white overflow-x-auto">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code
              className="px-1.5 py-0.5 bg-gray-200 rounded text-sm"
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

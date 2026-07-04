import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import ReactMarkdown, { defaultUrlTransform, type Components, type UrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { cn } from './cn';

export interface ChatMarkdownProps {
  content: string;
  className?: string;
}

const components = {
  a({ className, href, children, ...props }) {
    const isExternal = typeof href === 'string' && /^(https?:)?\/\//i.test(href);

    return (
      <a
        {...props}
        className={cn('chatterkit-markdown-link', className)}
        href={href}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        target={isExternal ? '_blank' : undefined}
      >
        {children}
      </a>
    );
  },
} satisfies Components;

const safeUrlTransform: UrlTransform = (url, key, node) => {
  const transformedUrl = defaultUrlTransform(url);

  if (transformedUrl === '') {
    return transformedUrl;
  }

  if (key !== 'href') {
    return transformedUrl;
  }

  const tagName = 'tagName' in node ? node.tagName : undefined;
  if (tagName === 'a' && /^[^:@/?#]+@[^:@/?#]+\.[^:@/?#]+$/i.test(transformedUrl)) {
    return `mailto:${transformedUrl}`;
  }

  return transformedUrl;
};

export function ChatMarkdown({ content, className }: ChatMarkdownProps) {
  return (
    <div className={cn('chatterkit-markdown', className)}>
      <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} urlTransform={safeUrlTransform}>
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function markdownNode(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === 'string') {
      return <ChatMarkdown content={child} />;
    }

    if (!isValidElement(child)) {
      return child;
    }

    const childProps = child.props as { children?: ReactNode };

    if (!('children' in childProps)) {
      return child;
    }

    return cloneElement(child, {
      children: childProps.children,
    });
  });
}
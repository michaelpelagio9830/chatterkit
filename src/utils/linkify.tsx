import { Children, cloneElement, isValidElement, type ReactNode } from 'react';

/**
 * Converts URLs and email addresses in a string into clickable <a> links.
 * @param {string} text - The input string that may contain URLs or email addresses.
 * @returns {JSX.Element[]} - An array of JSX elements with links.
 */
export function linkify(text: string) {
  if (typeof text !== "string") return text;

  // Regex to match URLs (http, https, www) and email addresses.
  const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/i;
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const linkRegex = new RegExp(`(${urlRegex.source}|${emailRegex.source})`, "gi");

  return text.split(linkRegex).map((part, index) => {
    if (urlRegex.test(part)) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {part}
        </a>
      );
    }

    if (emailRegex.test(part)) {
      return (
        <a
          key={index}
          href={`mailto:${part}`}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {part}
        </a>
      );
    }

    return part;
  });
}

export function linkifyNode(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === 'string') {
      return linkify(child);
    }

    if (!isValidElement(child)) {
      return child;
    }

    const childProps = child.props as { children?: ReactNode };

    if (!('children' in childProps)) {
      return child;
    }

    return cloneElement(child, {
      children: linkifyNode(childProps.children),
    });
  });
}

// export default function App() {
//   const sampleText =
//     "Check out https://react.dev and also visit www.example.com for more info.";

//   return (
//     <div style={{ fontFamily: "Arial", fontSize: "16px" }}>
//       <p>{linkify(sampleText)}</p>
//     </div>
//   );
// }
// How it works:
// Regex detects URLs starting with http://, https://, or www..
// split() breaks the string into parts (URLs and non-URLs).
// URLs are wrapped in <a> tags with:
// target="_blank" → opens in a new tab.
// rel="noopener noreferrer" → security best practice.
// Non-URL text is returned as plain text.
// ✅ Advantages of this approach

// No external dependencies.
// Works with both http(s) and www links.
// Safe against XSS by not using dangerouslySetInnerHTML.
// If you want automatic link detection with more features (like email detection), you can use the linkify-react package:

// Bash

// Copy code
// npm install linkify-react
// Jsx

// Copy code
// import React from "react";
// import Linkify from "linkify-react";

// export default function App() {
//   const text = "Visit https://react.dev or email me@example.com";

//   return <Linkify options={{ target: "_blank" }}>{text}</Linkify>;
// }
// If you want, I can also give you a version that works inside React Router <Link> instead of <a> for internal navigation.
// Do you want me to prepare that?


import { type ReactNode } from "react";

const escapeRegex = (value: string) =>
  value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

export const highlightMatches = (text: string, query: string): ReactNode => {
  const trimmed = query.trim();
  if (!trimmed) {
    return text;
  }

  const escaped = escapeRegex(trimmed);
  const regex = new RegExp(`(${escaped})`, "gi");
  const lowerQuery = trimmed.toLowerCase();
  const parts = text.split(regex);

  return parts.map((part, index) =>
    part.toLowerCase() === lowerQuery ? (
      <mark
        key={index}
        className="rounded bg-brand-soft px-0.5 text-slate-900 dark:bg-brand/20 dark:text-brand"
      >
        {part}
      </mark>
    ) : (
      <span key={index} className="contents">
        {part}
      </span>
    ),
  );
};
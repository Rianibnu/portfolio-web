"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Code snippets that will be "typed" with syntax token info
const CODE_SNIPPETS = [
  {
    filename: "app.tsx",
    language: "tsx",
    lines: [
      { tokens: [{ text: "import", type: "keyword" }, { text: " { ", type: "punctuation" }, { text: "NextPage", type: "type" }, { text: " } ", type: "punctuation" }, { text: "from", type: "keyword" }, { text: " ", type: "plain" }, { text: "'next'", type: "string" }, { text: ";", type: "punctuation" }] },
      { tokens: [{ text: "import", type: "keyword" }, { text: " { ", type: "punctuation" }, { text: "motion", type: "variable" }, { text: " } ", type: "punctuation" }, { text: "from", type: "keyword" }, { text: " ", type: "plain" }, { text: "'framer-motion'", type: "string" }, { text: ";", type: "punctuation" }] },
      { tokens: [] },
      { tokens: [{ text: "const", type: "keyword" }, { text: " ", type: "plain" }, { text: "Portfolio", type: "function" }, { text: ": ", type: "punctuation" }, { text: "NextPage", type: "type" }, { text: " = () ", type: "punctuation" }, { text: "=>", type: "keyword" }, { text: " {", type: "punctuation" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "const", type: "keyword" }, { text: " [", type: "punctuation" }, { text: "projects", type: "variable" }, { text: "] = ", type: "punctuation" }, { text: "useState", type: "function" }, { text: "([])", type: "punctuation" }, { text: ";", type: "punctuation" }] },
      { tokens: [] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "return", type: "keyword" }, { text: " (", type: "punctuation" }] },
      { tokens: [{ text: "    ", type: "plain" }, { text: "<", type: "punctuation" }, { text: "motion.div", type: "tag" }] },
      { tokens: [{ text: "      ", type: "plain" }, { text: "animate", type: "attribute" }, { text: "=", type: "punctuation" }, { text: "{{ opacity: 1 }}", type: "string" }] },
      { tokens: [{ text: "      ", type: "plain" }, { text: "className", type: "attribute" }, { text: "=", type: "punctuation" }, { text: "\"portfolio\"", type: "string" }] },
      { tokens: [{ text: "    ", type: "plain" }, { text: ">", type: "punctuation" }] },
      { tokens: [{ text: "      ", type: "plain" }, { text: "{", type: "punctuation" }, { text: "projects", type: "variable" }, { text: ".", type: "punctuation" }, { text: "map", type: "function" }, { text: "((", type: "punctuation" }, { text: "p", type: "variable" }, { text: ") ", type: "punctuation" }, { text: "=>", type: "keyword" }, { text: " (", type: "punctuation" }] },
      { tokens: [{ text: "        ", type: "plain" }, { text: "<", type: "punctuation" }, { text: "Card", type: "tag" }, { text: " ", type: "plain" }, { text: "key", type: "attribute" }, { text: "={", type: "punctuation" }, { text: "p.id", type: "variable" }, { text: "}", type: "punctuation" }, { text: " />", type: "punctuation" }] },
      { tokens: [{ text: "      ", type: "plain" }, { text: "))", type: "punctuation" }, { text: "}", type: "punctuation" }] },
      { tokens: [{ text: "    ", type: "plain" }, { text: "</", type: "punctuation" }, { text: "motion.div", type: "tag" }, { text: ">", type: "punctuation" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: ")", type: "punctuation" }, { text: ";", type: "punctuation" }] },
      { tokens: [{ text: "}", type: "punctuation" }, { text: ";", type: "punctuation" }] },
    ],
  },
  {
    filename: "api/route.ts",
    language: "ts",
    lines: [
      { tokens: [{ text: "import", type: "keyword" }, { text: " { ", type: "punctuation" }, { text: "NextResponse", type: "type" }, { text: " } ", type: "punctuation" }, { text: "from", type: "keyword" }, { text: " ", type: "plain" }, { text: "'next/server'", type: "string" }, { text: ";", type: "punctuation" }] },
      { tokens: [{ text: "import", type: "keyword" }, { text: " { ", type: "punctuation" }, { text: "prisma", type: "variable" }, { text: " } ", type: "punctuation" }, { text: "from", type: "keyword" }, { text: " ", type: "plain" }, { text: "'@/lib/prisma'", type: "string" }, { text: ";", type: "punctuation" }] },
      { tokens: [] },
      { tokens: [{ text: "export", type: "keyword" }, { text: " ", type: "plain" }, { text: "async", type: "keyword" }, { text: " ", type: "plain" }, { text: "function", type: "keyword" }, { text: " ", type: "plain" }, { text: "GET", type: "function" }, { text: "() {", type: "punctuation" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "const", type: "keyword" }, { text: " ", type: "plain" }, { text: "projects", type: "variable" }, { text: " = ", type: "punctuation" }, { text: "await", type: "keyword" }, { text: " ", type: "plain" }, { text: "prisma", type: "variable" }, { text: ".", type: "punctuation" }, { text: "project", type: "variable" }] },
      { tokens: [{ text: "    ", type: "plain" }, { text: ".", type: "punctuation" }, { text: "findMany", type: "function" }, { text: "({", type: "punctuation" }] },
      { tokens: [{ text: "      ", type: "plain" }, { text: "orderBy", type: "attribute" }, { text: ": { ", type: "punctuation" }, { text: "createdAt", type: "variable" }, { text: ": ", type: "punctuation" }, { text: "'desc'", type: "string" }, { text: " },", type: "punctuation" }] },
      { tokens: [{ text: "      ", type: "plain" }, { text: "take", type: "attribute" }, { text: ": ", type: "punctuation" }, { text: "10", type: "number" }, { text: ",", type: "punctuation" }] },
      { tokens: [{ text: "    ", type: "plain" }, { text: "});", type: "punctuation" }] },
      { tokens: [] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "return", type: "keyword" }, { text: " ", type: "plain" }, { text: "NextResponse", type: "type" }, { text: ".", type: "punctuation" }, { text: "json", type: "function" }, { text: "(", type: "punctuation" }, { text: "projects", type: "variable" }, { text: ");", type: "punctuation" }] },
      { tokens: [{ text: "}", type: "punctuation" }] },
    ],
  },
  {
    filename: "schema.prisma",
    language: "prisma",
    lines: [
      { tokens: [{ text: "model", type: "keyword" }, { text: " ", type: "plain" }, { text: "Project", type: "type" }, { text: " {", type: "punctuation" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "id", type: "variable" }, { text: "        ", type: "plain" }, { text: "String", type: "type" }, { text: "   ", type: "plain" }, { text: "@id", type: "attribute" }, { text: " ", type: "plain" }, { text: "@default", type: "attribute" }, { text: "(", type: "punctuation" }, { text: "cuid()", type: "function" }, { text: ")", type: "punctuation" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "title", type: "variable" }, { text: "     ", type: "plain" }, { text: "String", type: "type" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "slug", type: "variable" }, { text: "      ", type: "plain" }, { text: "String", type: "type" }, { text: "   ", type: "plain" }, { text: "@unique", type: "attribute" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "desc", type: "variable" }, { text: "      ", type: "plain" }, { text: "String?", type: "type" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "image", type: "variable" }, { text: "     ", type: "plain" }, { text: "String?", type: "type" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "techStack", type: "variable" }, { text: " ", type: "plain" }, { text: "String[]", type: "type" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "liveUrl", type: "variable" }, { text: "   ", type: "plain" }, { text: "String?", type: "type" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "githubUrl", type: "variable" }, { text: " ", type: "plain" }, { text: "String?", type: "type" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "featured", type: "variable" }, { text: "  ", type: "plain" }, { text: "Boolean", type: "type" }, { text: "  ", type: "plain" }, { text: "@default", type: "attribute" }, { text: "(", type: "punctuation" }, { text: "false", type: "keyword" }, { text: ")", type: "punctuation" }] },
      { tokens: [{ text: "  ", type: "plain" }, { text: "createdAt", type: "variable" }, { text: " ", type: "plain" }, { text: "DateTime", type: "type" }, { text: "  ", type: "plain" }, { text: "@default", type: "attribute" }, { text: "(", type: "punctuation" }, { text: "now()", type: "function" }, { text: ")", type: "punctuation" }] },
      { tokens: [{ text: "}", type: "punctuation" }] },
    ],
  },
];

// Token color mapping for syntax highlighting
const TOKEN_COLORS: Record<string, string> = {
  keyword: "text-purple-400",
  type: "text-cyan-400",
  function: "text-yellow-300",
  string: "text-emerald-400",
  variable: "text-blue-300",
  attribute: "text-orange-300",
  tag: "text-red-400",
  number: "text-orange-400",
  punctuation: "text-foreground-subtle",
  comment: "text-foreground-subtle/50 italic",
  plain: "",
};

export default function HeroCodeEditor() {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<number>(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isTypingLine, setIsTypingLine] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const currentSnippet = CODE_SNIPPETS[currentSnippetIndex];
  const currentLine = currentSnippet.lines[displayedLines];

  // Get the full text of a line
  const getLineText = (line: typeof currentSnippet.lines[0]) => {
    return line.tokens.map((t) => t.text).join("");
  };

  // Typing effect
  useEffect(() => {
    if (isTransitioning) return;

    const snippet = CODE_SNIPPETS[currentSnippetIndex];

    if (displayedLines >= snippet.lines.length) {
      // All lines typed — wait, then transition to next snippet
      const timeout = setTimeout(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSnippetIndex((prev) => (prev + 1) % CODE_SNIPPETS.length);
          setDisplayedLines(0);
          setCharIndex(0);
          setIsTypingLine(true);
          setIsTransitioning(false);
        }, 600);
      }, 3000);
      return () => clearTimeout(timeout);
    }

    const line = snippet.lines[displayedLines];
    const fullText = getLineText(line);

    if (fullText.length === 0) {
      // Empty line — skip quickly
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => prev + 1);
        setCharIndex(0);
      }, 80);
      return () => clearTimeout(timeout);
    }

    if (charIndex < fullText.length) {
      // Still typing current line
      const speed = 20 + Math.random() * 30; // Natural typing speed variation
      const timeout = setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      // Line complete — move to next
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => prev + 1);
        setCharIndex(0);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentSnippetIndex, displayedLines, charIndex, isTransitioning]);

  // Auto-scroll to bottom as new lines appear
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.scrollTop = editorRef.current.scrollHeight;
    }
  }, [displayedLines]);

  // Render a line with proper syntax coloring up to charIndex
  const renderTypingLine = (line: typeof currentSnippet.lines[0], maxChars: number) => {
    let rendered = 0;
    const elements: JSX.Element[] = [];

    for (let i = 0; i < line.tokens.length; i++) {
      const token = line.tokens[i];
      if (rendered >= maxChars) break;

      const remaining = maxChars - rendered;
      const visibleText = token.text.slice(0, remaining);
      rendered += visibleText.length;

      elements.push(
        <span key={i} className={TOKEN_COLORS[token.type] || ""}>
          {visibleText}
        </span>
      );
    }

    return elements;
  };

  // Render a fully completed line
  const renderFullLine = (line: typeof currentSnippet.lines[0]) => {
    return line.tokens.map((token, i) => (
      <span key={i} className={TOKEN_COLORS[token.type] || ""}>
        {token.text}
      </span>
    ));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-lg"
    >
      {/* Glow effect behind editor */}
      <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,var(--accent-primary),transparent_70%)] opacity-[0.07] blur-3xl rounded-3xl" />

      {/* Editor container */}
      <div
        className={`relative rounded-2xl border border-glass-border overflow-hidden bg-[#0d1117] shadow-2xl transition-opacity duration-500 ${
          isTransitioning ? "opacity-40" : "opacity-100"
        }`}
      >
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-[0_0_6px_rgba(255,95,87,0.4)]" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e] shadow-[0_0_6px_rgba(254,188,46,0.4)]" />
              <span className="w-3 h-3 rounded-full bg-[#28c840] shadow-[0_0_6px_rgba(40,200,64,0.4)]" />
            </div>
          </div>

          {/* File tabs */}
          <div className="flex items-center gap-1">
            {CODE_SNIPPETS.map((snippet, idx) => (
              <button
                key={snippet.filename}
                onClick={() => {
                  if (idx === currentSnippetIndex) return;
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentSnippetIndex(idx);
                    setDisplayedLines(0);
                    setCharIndex(0);
                    setIsTypingLine(true);
                    setIsTransitioning(false);
                  }, 300);
                }}
                className={`px-3 py-1 text-[11px] font-medium rounded-md transition-all duration-200 ${
                  idx === currentSnippetIndex
                    ? "bg-[#0d1117] text-blue-400 border border-white/10"
                    : "text-white/30 hover:text-white/50"
                }`}
              >
                {snippet.filename}
              </button>
            ))}
          </div>

          <div className="w-[52px]" /> {/* Spacer to balance the dots */}
        </div>

        {/* Code area */}
        <div
          ref={editorRef}
          className="p-5 font-mono text-[13px] leading-6 min-h-[320px] max-h-[360px] overflow-y-auto scrollbar-none"
        >
          {currentSnippet.lines.map((line, lineIdx) => {
            if (lineIdx > displayedLines) return null;

            const lineNumber = lineIdx + 1;
            const isCurrentLine = lineIdx === displayedLines;
            const isEmpty = line.tokens.length === 0;

            return (
              <div
                key={`${currentSnippetIndex}-${lineIdx}`}
                className="flex group"
              >
                {/* Line number */}
                <span className="select-none w-8 shrink-0 text-right pr-4 text-white/15 text-[12px]">
                  {lineNumber}
                </span>

                {/* Code content */}
                <span className="flex-1 whitespace-pre">
                  {isEmpty ? (
                    <br />
                  ) : isCurrentLine ? (
                    <>
                      {renderTypingLine(line, charIndex)}
                      {/* Blinking cursor */}
                      <span className="inline-block w-[2px] h-[16px] bg-blue-400 align-middle animate-pulse ml-[1px]" />
                    </>
                  ) : (
                    renderFullLine(line)
                  )}
                </span>
              </div>
            );
          })}

          {/* Cursor at end when all lines are done */}
          {displayedLines >= currentSnippet.lines.length && (
            <div className="flex">
              <span className="select-none w-8 shrink-0 text-right pr-4 text-white/15 text-[12px]">
                {currentSnippet.lines.length + 1}
              </span>
              <span className="inline-block w-[2px] h-[16px] bg-blue-400 align-middle animate-pulse" />
            </div>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-1.5 bg-[#161b22] border-t border-white/5 text-[10px] text-white/25">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              UTF-8
            </span>
            <span>{currentSnippet.language.toUpperCase()}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Ln {Math.min(displayedLines + 1, currentSnippet.lines.length)}, Col {charIndex + 1}</span>
            <span>Spaces: 2</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

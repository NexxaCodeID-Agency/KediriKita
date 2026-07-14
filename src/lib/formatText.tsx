import React from "react";

function normalizeInline(text: string): string {
  return text.replace(/[^\S\n]+/g, " ").trim();
}

function parseInlineFormatting(text: string, prefix: string = "0"): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*([^*]+)\*|\*([^*]+)$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const content = match[1] !== undefined ? match[1] : match[2];
    parts.push(
      <strong key={`b-${prefix}-${match.index}`} className="font-bold text-[#d4a017]">
        {content}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

function isSpecialLine(line: string): boolean {
  if (line.startsWith("#")) return true;
  if (line.startsWith("-")) return true;
  if (/^\d+\./.test(line)) return true;
  if (
    line.endsWith(".")
  ) return true;
  return false;
}

function flushParagraph(
  buf: string[],
  idx: number,
  opts?: { firstLetter?: boolean }
): React.ReactNode {
  const isFirst = opts?.firstLetter && idx === 0;
  const text = buf.map((l) => normalizeInline(l)).join("\n");

  const children: React.ReactNode[] = [];
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    if (i > 0) children.push(<br key={`br-${idx}-${i}`} />);
    children.push(...parseInlineFormatting(line, `${idx}-${i}`));
  });

  return (
    <p
      key={`p-${idx}`}
      className={`text-justify text-neutral-300 opacity-95 mb-6 leading-relaxed ${
        isFirst
          ? "indent-4 sm:indent-8 first-letter:float-left first-letter:text-5xl sm:first-letter:text-6xl first-letter:font-black first-letter:text-[#d4a017] first-letter:mr-3 first-letter:font-serif first-letter:leading-none"
          : "indent-4 sm:indent-8"
      }`}
    >
      {children}
    </p>
  );
}

export function renderFormattedText(
  text: string,
  opts?: { firstLetter?: boolean }
): React.ReactNode[] {
  const rawLines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let idx = 0;

  const paraBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length === 0) return;
    elements.push(flushParagraph(paraBuf, idx, opts));
    idx++;
    paraBuf.length = 0;
  };

  let i = 0;
  while (i < rawLines.length) {
    const line = rawLines[i].trim();

    if (!line) {
      flushPara();
      i++;
      continue;
    }

    if (line.startsWith("#")) {
      flushPara();
      elements.push(
        <h3
          key={`h-${idx}`}
          className="text-lg sm:text-xl font-bold text-[#fff8e0] mt-8 mb-3 font-serif border-b border-[#d4a017]/30 pb-2"
        >
          {normalizeInline(line.replace(/^#+\s*/, ""))}
        </h3>
      );
      idx++;
      i++;
      continue;
    }

    const isShortTitle =
      line.startsWith("-") &&
      !/^\d+\./.test(line) &&
      !line.endsWith(".");

    if (isShortTitle) {
      flushPara();
      elements.push(
        <h3
          key={`h-${idx}`}
          className="text-lg sm:text-xl font-bold text-[#fff8e0] mt-8 mb-3 font-serif border-b border-[#d4a017]/30 pb-2"
        >
          {normalizeInline(line)}
        </h3>
      );
      idx++;
      i++;
      continue;
    }

    const dashMatch = line.match(/^[-]\s*(.*)/);
    if (dashMatch) {
      flushPara();
      const content = normalizeInline(dashMatch[1] || "");
      elements.push(
        <div key={`d-${idx}`} className="flex items-start gap-3 text-justify">
          <span className="text-[#d4a017] flex-shrink-0 mt-1.5 text-xs sm:text-sm">✦</span>
          <p className="text-neutral-300 opacity-95 leading-relaxed">
            {parseInlineFormatting(content, `d${idx}`)}
          </p>
        </div>
      );
      idx++;
      i++;
      continue;
    }

    const numMatch = line.match(/^(\d+)\.\s*(.*)/);
    if (numMatch) {
      flushPara();
      const content = normalizeInline(numMatch[2]);
      elements.push(
        <div key={`n-${idx}`} className="flex items-start gap-3 text-justify">
          <span className="text-[#c8a84b] font-bold flex-shrink-0 mt-0.5 text-sm sm:text-base min-w-[1.5rem]">
            {numMatch[1]}.
          </span>
          <p className="text-neutral-300 opacity-95 leading-relaxed">
            {parseInlineFormatting(content, `n${idx}`)}
          </p>
        </div>
      );
      idx++;
      i++;
      continue;
    }

    paraBuf.push(line);
    i++;
  }

  flushPara();

  return elements;
}

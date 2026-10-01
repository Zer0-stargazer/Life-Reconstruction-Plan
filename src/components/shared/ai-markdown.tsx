'use client';

import { Fragment, useMemo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Block =
  | { kind: 'heading'; level: number; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'bullet'; items: string[] }
  | { kind: 'ordered'; items: string[] }
  | { kind: 'rule' };

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) {
      nodes.push(<Fragment key={`text-${key++}`}>{text.slice(cursor, match.index)}</Fragment>);
    }
    nodes.push(
      <strong key={`strong-${key++}`} className="font-semibold text-foreground">
        {match[0].slice(2, -2)}
      </strong>
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) {
    nodes.push(<Fragment key={`text-${key++}`}>{text.slice(cursor)}</Fragment>);
  }

  return nodes;
}

function parseBlocks(content: string): Block[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let bullets: string[] = [];
  let ordered: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: 'paragraph', text: paragraph.join(' ').trim() });
      paragraph = [];
    }
  };
  const flushLists = () => {
    if (bullets.length > 0) {
      blocks.push({ kind: 'bullet', items: bullets });
      bullets = [];
    }
    if (ordered.length > 0) {
      blocks.push({ kind: 'ordered', items: ordered });
      ordered = [];
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushLists();
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushAll();
      continue;
    }

    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushAll();
      blocks.push({ kind: 'rule' });
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushAll();
      blocks.push({ kind: 'heading', level: heading[1].length, text: heading[2] });
      continue;
    }

    const bullet = line.match(/^(?:[-*+])\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      if (ordered.length > 0) {
        blocks.push({ kind: 'ordered', items: ordered });
        ordered = [];
      }
      bullets.push(bullet[1]);
      continue;
    }

    const item = line.match(/^(\d+)[.)]\s+(.+)$/);
    if (item) {
      flushParagraph();
      if (bullets.length > 0) {
        blocks.push({ kind: 'bullet', items: bullets });
        bullets = [];
      }
      ordered.push(item[2]);
      continue;
    }

    flushLists();
    paragraph.push(line);
  }

  flushAll();
  return blocks;
}

export function AiMarkdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = useMemo(() => parseBlocks(content), [content]);

  return (
    <div className={cn('space-y-2.5 text-sm leading-relaxed text-foreground/90', className)}>
      {blocks.map((block, index) => {
        const key = `${block.kind}-${index}`;

        if (block.kind === 'rule') {
          return <hr key={key} className="border-border/60" />;
        }

        if (block.kind === 'heading') {
          const level = Math.min(3, Math.max(1, block.level));
          return (
            <h3
              key={key}
              className={cn(
                'font-semibold text-foreground',
                level === 1 && 'text-base',
                level === 2 && 'text-sm',
                level === 3 && 'text-sm font-medium text-foreground/90'
              )}
            >
              {renderInline(block.text)}
            </h3>
          );
        }

        if (block.kind === 'bullet') {
          return (
            <ul
              key={key}
              className="space-y-1.5 pl-4 list-disc marker:text-primary/50"
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        if (block.kind === 'ordered') {
          return (
            <ol
              key={key}
              className="space-y-1.5 pl-4 list-decimal marker:text-primary/60"
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${key}-${itemIndex}`}>{renderInline(item)}</li>
              ))}
            </ol>
          );
        }

        return <p key={key}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

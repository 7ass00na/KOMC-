'use client';
import { useEffect, useRef, useState } from "react";

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  dir?: "ltr" | "rtl";
};

export default function RichTextEditor({ value = "", onChange, placeholder = "", dir = "ltr" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string>(value);

  useEffect(() => {
    setHtml(value || "");
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    if (ref.current) {
      onChange?.(ref.current.innerHTML);
    }
  };

  return (
    <div className="rounded-lg border border-[var(--panel-border)] bg-white/70 dark:bg-[color-mix(in_oklab,var(--brand-primary),white_10%)]">
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-[var(--panel-border)]">
        <button className="btn-secondary" type="button" onClick={() => exec("bold")}>B</button>
        <button className="btn-secondary" type="button" onClick={() => exec("italic")}><i>I</i></button>
        <button className="btn-secondary" type="button" onClick={() => exec("underline")}><u>U</u></button>
        <button className="btn-secondary" type="button" onClick={() => exec("insertUnorderedList")}>• List</button>
        <button className="btn-secondary" type="button" onClick={() => exec("formatBlock", "<h2>")}>H2</button>
        <button className="btn-secondary" type="button" onClick={() => exec("undo")}>Undo</button>
        <button className="btn-secondary" type="button" onClick={() => exec("redo")}>Redo</button>
        <div className="flex-1" />
      </div>
      <div
        ref={ref}
        className="min-h-[140px] p-3 text-sm text-[var(--ink-primary)]"
        contentEditable
        suppressContentEditableWarning
        dir={dir}
        onInput={(e) => {
          const html = (e.target as HTMLDivElement).innerHTML;
          setHtml(html);
          onChange?.(html);
        }}
        dangerouslySetInnerHTML={{ __html: html || `<p style="opacity:.6">${placeholder}</p>` }}
      />
    </div>
  );
}

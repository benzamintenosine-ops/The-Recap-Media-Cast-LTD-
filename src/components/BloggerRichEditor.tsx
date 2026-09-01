import React, { useRef, useEffect, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  Highlighter,
  List,
  ListOrdered,
  RemoveFormatting
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  minHeight?: string;
}

export const BloggerRichEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  minHeight = '520px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync external value with editor innerHTML when component mounts or value changes outside typing
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  // Execute browser execCommand for WYSIWYG formatting
  const executeCommand = (command: string, arg: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, arg);
    triggerChange();
  };

  const triggerChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  return (
    <div className="w-full border border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col">
      {/* Toolbar Header */}
      <div className="p-3 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2.5">
        {/* Formatting Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('bold');
            }}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-900 dark:text-white font-extrabold text-xs shadow-sm flex items-center gap-1"
            title="বোল্ড (Bold)"
          >
            <Bold className="w-4 h-4 text-red-600" />
            <span className="hidden sm:inline">বোল্ড</span>
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('italic');
            }}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-900 dark:text-white italic text-xs shadow-sm flex items-center gap-1"
            title="ইটালিক (Italic)"
          >
            <Italic className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">ইটালিক</span>
          </button>

          {/* Underline */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('underline');
            }}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-900 dark:text-white underline text-xs shadow-sm flex items-center gap-1"
            title="আন্ডারলাইন (Underline)"
          >
            <Underline className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">আন্ডারলাইন</span>
          </button>

          {/* H2 Heading */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', '<h2>');
            }}
            className="px-2.5 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-900 dark:text-white font-bold text-xs shadow-sm flex items-center gap-1"
            title="উপ-শিরোনাম (H2 Subheading)"
          >
            <Heading2 className="w-4 h-4 text-emerald-500" />
            <span>H2 উপ-শিরোনাম</span>
          </button>

          {/* H3 Heading */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', '<h3>');
            }}
            className="px-2 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-slate-900 dark:text-white font-bold text-xs shadow-sm flex items-center gap-1"
            title="ছোট শিরোনাম (H3)"
          >
            <Heading3 className="w-3.5 h-3.5 text-indigo-500" />
            <span>H3</span>
          </button>

          {/* Colors */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('foreColor', '#e11d48');
            }}
            className="px-2 py-1.5 bg-rose-100 dark:bg-rose-950/80 hover:bg-rose-200 text-rose-600 dark:text-rose-300 font-bold text-xs rounded-lg shadow-sm"
            title="লাল টেক্সট"
          >
            🔴 লাল
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('foreColor', '#2563eb');
            }}
            className="px-2 py-1.5 bg-blue-100 dark:bg-blue-950/80 hover:bg-blue-200 text-blue-600 dark:text-blue-300 font-bold text-xs rounded-lg shadow-sm"
            title="নীল টেক্সট"
          >
            🔵 নীল
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('foreColor', '#16a34a');
            }}
            className="px-2 py-1.5 bg-emerald-100 dark:bg-emerald-950/80 hover:bg-emerald-200 text-emerald-600 dark:text-emerald-300 font-bold text-xs rounded-lg shadow-sm"
            title="সবুজ টেক্সট"
          >
            🟢 সবুজ
          </button>

          {/* Highlight */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('hiliteColor', '#fef08a');
            }}
            className="px-2 py-1.5 bg-amber-200 dark:bg-amber-900/60 hover:bg-amber-300 text-amber-900 dark:text-amber-100 font-bold text-xs rounded-lg shadow-sm flex items-center gap-1"
            title="টেক্সট হাইলাইট করুন"
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />
            <span className="hidden sm:inline">হাইলাইট</span>
          </button>

          {/* Bullet List */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertUnorderedList');
            }}
            className="px-2 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1"
            title="বুলেট তালিকা"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">তালিকা</span>
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertOrderedList');
            }}
            className="px-2 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1"
            title="ক্রমিক সংখ্যা তালিকা"
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">১.২.৩</span>
          </button>

          {/* Clear Formatting */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('removeFormat');
            }}
            className="p-1.5 bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500 hover:text-red-600 rounded-lg text-xs shadow-sm"
            title="ফরম্যাট ক্লিয়ার করুন"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Tip Banner */}
      <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-100 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
        <span>
          💡 <strong>ভিজ্যুয়াল এডিটর:</strong> আপনি যা লিখবেন বা সিলেক্ট করে ওপরের ফরম্যাটিং বোতামে চাপবেন—সেটি সাথে সাথে বোর্ডে ভিজ্যুয়াল স্টাইলে পরিবর্তন হবে।
        </span>
      </div>

      {/* Editor Body Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={triggerChange}
        onBlur={() => {
          setIsFocused(false);
          triggerChange();
        }}
        onFocus={() => setIsFocused(true)}
        style={{ minHeight }}
        className={`w-full p-4 sm:p-6 text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none font-sans leading-relaxed overflow-y-auto cursor-text select-text [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:font-serif [&_h2]:border-b [&_h2]:border-red-600/30 [&_h2]:pb-1 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 ${
          !value && !isFocused ? 'before:content-[attr(data-placeholder)] before:text-slate-400 before:pointer-events-none' : ''
        }`}
        data-placeholder="এখানে আপনার সংবাদের বিবরণ ভিজ্যুয়ালি লিখুন (যেমন: সিলেক্ট করে বোল্ড বা কালার করলে টেক্সটটি সাথে সাথে ভিজ্যুয়ালি বোল্ড বা কালার হবে)..."
      />
    </div>
  );
};

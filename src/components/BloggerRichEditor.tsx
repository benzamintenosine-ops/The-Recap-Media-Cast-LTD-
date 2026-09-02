import React, { useRef, useEffect, useState } from 'react';
import {
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Palette,
  Link as LinkIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Smile,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Indent,
  Outdent,
  RemoveFormatting,
  Undo,
  Redo,
  ChevronDown,
  X,
  Plus,
  Check
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  minHeight?: string;
}

const FONT_FAMILIES = [
  { name: 'ডিফল্ট ফন্ট (Sans)', value: 'sans-serif' },
  { name: 'SolaimanLipi', value: 'SolaimanLipi, Kalpurush, sans-serif' },
  { name: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { name: 'Courier New', value: '"Courier New", Courier, monospace' },
  { name: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
];

const FONT_SIZES = [
  { label: 'খুব ছোট (Smallest)', value: '1' },
  { label: 'ছোট (Small)', value: '2' },
  { label: 'সাধারণ (Normal)', value: '3' },
  { label: 'বড় (Large)', value: '4' },
  { label: 'খুব বড় (Largest)', value: '5' },
];

const HEADING_TYPES = [
  { label: 'সাধারণ অনুচ্ছেদ (Paragraph)', tag: 'p', value: '<p>' },
  { label: 'প্রধান শিরোনাম (Heading 1)', tag: 'h1', value: '<h1>' },
  { label: 'উপ-শিরোনাম (Heading 2)', tag: 'h2', value: '<h2>' },
  { label: 'ছোট শিরোনাম (Heading 3)', tag: 'h3', value: '<h3>' },
  { label: 'সাব-হেডিং (Heading 4)', tag: 'h4', value: '<h4>' },
];

const COLOR_PALETTE = [
  '#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff',
  '#dc2626', '#ea580c', '#d97706', '#16a34a', '#0284c7', '#4f46e5',
  '#7c3aed', '#c026d3', '#e11d48', '#059669', '#0891b2', '#2563eb'
];

const HIGHLIGHT_PALETTE = [
  'transparent', '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa', '#e9d5ff'
];

const EMOJI_LIST = ['😊', '🇧🇩', '📢', '📰', '📌', '⚠️', '💬', '🔥', '❤️', '👍', '✅', '❌', '✨', '⚡', '🎉', '🎯', '📍', '🏆'];

export const RichContentEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  minHeight = '500px'
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Dropdown & Modal states
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showHeadingType, setShowHeadingType] = useState(false);
  const [showTextColor, setShowTextColor] = useState(false);
  const [showBgColor, setShowBgColor] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Modal Inputs
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

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

  // Close all popups
  const closeAllMenus = () => {
    setShowFontFamily(false);
    setShowFontSize(false);
    setShowHeadingType(false);
    setShowTextColor(false);
    setShowBgColor(false);
    setShowAlignMenu(false);
    setShowEmojiPicker(false);
  };

  // Handle Link Insertion
  const handleInsertLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl.trim()) return;
    let url = linkUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    if (linkText.trim()) {
      const html = `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: underline;">${linkText.trim()}</a>`;
      executeCommand('insertHTML', html);
    } else {
      executeCommand('createLink', url);
    }
    setLinkUrl('');
    setLinkText('');
    setShowLinkModal(false);
  };

  // Handle Image Insertion
  const handleInsertImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;
    const imgHtml = `<div style="text-align: center; margin: 12px 0;"><img src="${imageUrl.trim()}" alt="Article Image" style="max-width: 100%; height: auto; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" /></div><p><br></p>`;
    executeCommand('insertHTML', imgHtml);
    setImageUrl('');
    setShowImageModal(false);
  };

  // Handle Local File Upload as Data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const imgHtml = `<div style="text-align: center; margin: 12px 0;"><img src="${result}" alt="Uploaded Image" style="max-width: 100%; height: auto; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" /></div><p><br></p>`;
          executeCommand('insertHTML', imgHtml);
        }
      };
      reader.readAsDataURL(file);
    }
    setShowImageModal(false);
  };

  // Handle Video Embed Insertion (YouTube, Vimeo, MP4)
  const handleInsertVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    let embedUrl = videoUrl.trim();

    // YouTube regex converter
    const ytMatch = embedUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    }

    const videoHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 16px; margin: 16px 0; background-color: #000;">
      <iframe src="${embedUrl}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
    </div><p><br></p>`;

    executeCommand('insertHTML', videoHtml);
    setVideoUrl('');
    setShowVideoModal(false);
  };

  return (
    <div className="w-full border border-slate-300 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden flex flex-col relative">
      {/* Comprehensive Professional Toolbar (Blogger-Inspired Layout) */}
      <div 
        className="p-2.5 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-1.5 sm:gap-2 select-none"
        onClick={() => closeAllMenus()}
      >
        {/* ROW 1 / GROUP 1: Font Family, Font Size & Paragraph Style Dropdowns */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs relative">
          {/* Font Family (A▼) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeAllMenus();
                setShowFontFamily(!showFontFamily);
              }}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1"
              title="ফন্ট সিলেক্ট করুন (Font Family)"
            >
              <span className="font-serif font-black text-sm">A</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showFontFamily && (
              <div className="absolute left-0 top-full mt-1.5 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 py-1.5 text-xs">
                {FONT_FAMILIES.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => {
                      executeCommand('fontName', f.value);
                      setShowFontFamily(false);
                    }}
                    style={{ fontFamily: f.value }}
                    className="w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 block truncate"
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size (TT▼) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeAllMenus();
                setShowFontSize(!showFontSize);
              }}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-0.5"
              title="ফন্টের আকার (Font Size)"
            >
              <span className="font-extrabold text-xs">T</span>
              <span className="font-bold text-[10px]">T</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showFontSize && (
              <div className="absolute left-0 top-full mt-1.5 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 py-1.5 text-xs">
                {FONT_SIZES.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      executeCommand('fontSize', s.value);
                      setShowFontSize(false);
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 block"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Heading / Paragraph Type Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeAllMenus();
                setShowHeadingType(!showHeadingType);
              }}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1"
              title="শিরোনামের ধরন (Paragraph Format)"
            >
              <Type className="w-3.5 h-3.5 text-red-600" />
              <span className="hidden sm:inline">শিরোনাম/লেখা</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {showHeadingType && (
              <div className="absolute left-0 top-full mt-1.5 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 py-1.5 text-xs">
                {HEADING_TYPES.map((h) => (
                  <button
                    key={h.tag}
                    type="button"
                    onClick={() => {
                      executeCommand('formatBlock', h.value);
                      setShowHeadingType(false);
                    }}
                    className="w-full px-3 py-1.5 text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 block"
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-5 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* GROUP 2: Basic Text Formatting (B, I, U, S) */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          {/* Bold */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('bold');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="বোল্ড (Bold Ctrl+B)"
          >
            <Bold className="w-4 h-4 font-black" />
          </button>

          {/* Italic */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('italic');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="ইটালিক (Italic Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>

          {/* Underline */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('underline');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="আন্ডারলাইন (Underline Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('strikeThrough');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="মাঝখানে কাটা (Strikethrough)"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* GROUP 3: Text Color & Highlight Color Palette */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          {/* Text Color (A with Underline) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeAllMenus();
                setShowTextColor(!showTextColor);
              }}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1"
              title="টেক্সট কালার (Text Color)"
            >
              <div className="flex flex-col items-center">
                <span className="font-black text-xs leading-none">A</span>
                <span className="w-3 h-0.5 bg-red-600 mt-0.5 rounded-full" />
              </div>
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>
            {showTextColor && (
              <div className="absolute left-0 top-full mt-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-30 w-44">
                <p className="text-[10px] font-bold text-slate-500 mb-1.5 px-1">টেক্সট কালার বেছে নিন:</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {COLOR_PALETTE.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        executeCommand('foreColor', c);
                        setShowTextColor(false);
                      }}
                      style={{ backgroundColor: c }}
                      className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 hover:scale-125 transition-transform shadow-2xs"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Highlight Color (Marker Icon) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeAllMenus();
                setShowBgColor(!showBgColor);
              }}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1"
              title="হাইলাইট কালার (Background Highlight)"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-500" />
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>
            {showBgColor && (
              <div className="absolute left-0 top-full mt-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-30 w-40">
                <p className="text-[10px] font-bold text-slate-500 mb-1.5 px-1">হাইলাইট এরিয়া:</p>
                <div className="grid grid-cols-4 gap-1.5">
                  {HIGHLIGHT_PALETTE.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => {
                        executeCommand('hiliteColor', bg);
                        setShowBgColor(false);
                      }}
                      style={{ backgroundColor: bg === 'transparent' ? '#ffffff' : bg }}
                      className="w-6 h-6 rounded-lg border border-slate-300 dark:border-slate-600 hover:scale-110 transition-transform flex items-center justify-center text-[10px]"
                    >
                      {bg === 'transparent' ? '✕' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-5 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* GROUP 4: Insert Link, Image, Video & Emojis */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          {/* Link */}
          <button
            type="button"
            onClick={() => setShowLinkModal(true)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="লিঙ্ক যুক্ত করুন (Insert Link)"
          >
            <LinkIcon className="w-4 h-4 text-blue-600" />
          </button>

          {/* Image */}
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="ছবি যুক্ত করুন (Insert Image)"
          >
            <ImageIcon className="w-4 h-4 text-emerald-600" />
          </button>

          {/* Video */}
          <button
            type="button"
            onClick={() => setShowVideoModal(true)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="ভিডিও যুক্ত করুন (YouTube/Video)"
          >
            <VideoIcon className="w-4 h-4 text-red-600" />
          </button>

          {/* Emoji */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeAllMenus();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
              title="ইমোজি / সিম্বল (Emojis)"
            >
              <Smile className="w-4 h-4 text-amber-500" />
            </button>
            {showEmojiPicker && (
              <div className="absolute right-0 top-full mt-1.5 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-30 w-48">
                <div className="grid grid-cols-6 gap-1.5">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        executeCommand('insertHTML', emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="w-6 h-6 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-sm flex items-center justify-center hover:scale-125 transition-transform"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-5 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* GROUP 5: Alignment, Lists, Quote & Indent */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          {/* Alignment Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeAllMenus();
                setShowAlignMenu(!showAlignMenu);
              }}
              className="px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1"
              title="টেক্সট এলাইনমেন্ট (Text Alignment)"
            >
              <AlignLeft className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <ChevronDown className="w-2.5 h-2.5 opacity-60" />
            </button>
            {showAlignMenu && (
              <div className="absolute left-0 top-full mt-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-30 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    executeCommand('justifyLeft');
                    setShowAlignMenu(false);
                  }}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="বামপাশ (Align Left)"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    executeCommand('justifyCenter');
                    setShowAlignMenu(false);
                  }}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="মাঝখানে (Align Center)"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    executeCommand('justifyRight');
                    setShowAlignMenu(false);
                  }}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="ডানপাশ (Align Right)"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    executeCommand('justifyFull');
                    setShowAlignMenu(false);
                  }}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="জাস্টিফাই (Justify)"
                >
                  <AlignJustify className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Bulleted List */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertUnorderedList');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="বুলেট তালিকা (Bulleted List)"
          >
            <List className="w-4 h-4" />
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertOrderedList');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="সংখ্যা তালিকা (Numbered List)"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          {/* Blockquote */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('formatBlock', 'blockquote');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="উক্তি বা উদ্ধৃতি ব্লক (Blockquote)"
          >
            <Quote className="w-4 h-4 text-indigo-500" />
          </button>

          {/* Indent / Outdent */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('outdent');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="ডানে সরান (Indent)"
          >
            <Outdent className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('indent');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="বামে সরান (Outdent)"
          >
            <Indent className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-[1px] bg-slate-300 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* GROUP 6: Clear Formatting, Undo, Redo */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('removeFormat');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-red-500"
            title="ফরম্যাটিং মুছুন (Clear Formatting)"
          >
            <RemoveFormatting className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('undo');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="পূর্বাবস্থায় ফেরান (Undo Ctrl+Z)"
          >
            <Undo className="w-4 h-4" />
          </button>

          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('redo');
            }}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-800 dark:text-slate-200"
            title="পুনরায় করুন (Redo Ctrl+Y)"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Body Canvas */}
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
        className={`w-full p-4 sm:p-6 text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 focus:outline-none font-sans leading-relaxed overflow-y-auto cursor-text select-text [&_h1]:text-2xl [&_h1]:font-black [&_h1]:my-4 [&_h1]:text-slate-900 [&_h1]:dark:text-white [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3 [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:border-b [&_h2]:border-red-600/30 [&_h2]:pb-1 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2 [&_h4]:text-base [&_h4]:font-semibold [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-red-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-3 [&_blockquote]:bg-slate-50 [&_blockquote]:dark:bg-slate-800/50 [&_blockquote]:py-2 ${
          !value && !isFocused ? 'before:content-[attr(data-placeholder)] before:text-slate-400 before:pointer-events-none' : ''
        }`}
        data-placeholder="এখানে আপনার সংবাদের বিবরণ ভিজ্যুয়ালি লিখুন (যেমন: সিলেক্ট করে ওপরের টুলবার থেকে বোল্ড, কালার, লিংক বা ছবি যুক্ত করুন)..."
      />

      {/* MODAL 1: INSERT LINK */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-blue-600" /> হাইপারলিঙ্ক যুক্ত করুন
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleInsertLink} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  লিঙ্ক ঠিকানা (URL) *
                </label>
                <input
                  type="text"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রদর্শিত টেক্সট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="এখানে ক্লিক করুন"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
                >
                  যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INSERT IMAGE */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" /> লেখার মাঝে ছবি যুক্ত করুন
              </h3>
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Option A: Image URL */}
            <form onSubmit={handleInsertImage} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ছবির ওয়েব ইউআরএল (Image URL)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={!imageUrl.trim()}
                className="w-full py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-xl shadow-md"
              >
                ইউআরএল থেকে ছবি সন্নিবেশ করুন
              </button>
            </form>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase">অথবা পিসি/ফোন থেকে আপলোড করুন</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            </div>

            {/* Option B: Local File Upload */}
            <div>
              <label className="w-full py-3 px-4 border-2 border-dashed border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl flex items-center justify-center gap-2 cursor-pointer text-xs font-bold text-emerald-700 dark:text-emerald-300 transition-colors">
                <Plus className="w-4 h-4" /> ডিভাইস থেকে ছবি ফাইল সিলেক্ট করুন
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: INSERT VIDEO */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <VideoIcon className="w-4 h-4 text-red-600" /> ইউটিউব বা ভিডিও যুক্ত করুন
              </h3>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleInsertVideo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ইউটিউব ভিডিও লিঙ্ক (YouTube Video Link) *
                </label>
                <input
                  type="text"
                  required
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md"
                >
                  ভিডিও সংযুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const BloggerRichEditor = RichContentEditor;
export default RichContentEditor;

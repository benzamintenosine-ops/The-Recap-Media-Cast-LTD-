import React from 'react';

/**
 * Utility to parse and render formatted article content (WYSIWYG HTML + Markdown fallback)
 */
export const renderFormattedContent = (rawContent: string) => {
  if (!rawContent) return null;

  let html = rawContent;

  // Check if content is already formatted HTML (e.g., contains <p>, <br>, <b>, <strong>, <span>, <h2>, <ul>, etc.)
  const containsHTMLTags = /<[a-z][\s\S]*>/i.test(html);

  if (!containsHTMLTags) {
    // Process legacy Markdown syntax if no HTML tags detected
    html = html
      .replace(/^## (.*$)/gim, '<h2 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3 font-serif border-b-2 border-red-600/30 pb-1.5 flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full bg-red-600 shrink-0"></span>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2 font-serif">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900 dark:text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800 dark:text-slate-200">$1</em>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-red-600 pl-4 py-2.5 my-4 bg-slate-100 dark:bg-slate-800/80 rounded-r-2xl italic text-slate-700 dark:text-slate-300 font-serif text-sm sm:text-base">$1</blockquote>')
      .replace(/^\- (.*$)/gim, '<li class="ml-5 list-disc text-slate-800 dark:text-slate-200 my-1 font-sans">$1</li>');

    // Convert newlines to paragraphs
    const blocks = html.split(/\n\s*\n/);
    html = blocks
      .map((block) => {
        const trimmed = block.trim();
        if (
          trimmed.startsWith('<h2') ||
          trimmed.startsWith('<h3') ||
          trimmed.startsWith('<blockquote') ||
          trimmed.startsWith('<li')
        ) {
          return trimmed;
        }
        return `<p class="mb-4 leading-relaxed font-sans text-sm sm:text-base">${trimmed.replace(/\n/g, '<br />')}</p>`;
      })
      .join('');
  }

  return (
    <div
      className="formatted-news-article text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-sm sm:text-base space-y-3 select-text [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:dark:text-white [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:border-b-2 [&_h2]:border-red-600/30 [&_h2]:pb-1.5 [&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6 [&_p]:mb-4 [&_p]:leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

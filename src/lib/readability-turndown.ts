/**
 * Mozilla Readability + Turndown Markdown Extractor
 * 
 * Powered by official open-source packages:
 * - @mozilla/readability (Mozilla's official article & web content extraction engine)
 * - linkedom (Fast server-side DOM implementation)
 * - turndown + turndown-plugin-gfm (Official HTML-to-Markdown converter)
 */

import { Readability } from '@mozilla/readability';
import { parseHTML } from 'linkedom';
import TurndownService from 'turndown';
// @ts-ignore
import { gfm } from 'turndown-plugin-gfm';

export interface ReadabilityMarkdownResult {
  title: string;
  byline: string;
  excerpt: string;
  markdown: string;
  textContent: string;
  siteName?: string;
}

export function extractReadabilityMarkdown(html: string, url: string): ReadabilityMarkdownResult {
  try {
    const { document } = parseHTML(html);
    
    // 1. Run Mozilla Readability parser
    const reader = new Readability(document as any, {
      charThreshold: 20,
      keepClasses: false,
    });
    
    const article = reader.parse();

    // 2. Configure Turndown HTML-to-Markdown converter
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '_',
    });
    
    turndownService.use(gfm);

    const cleanHtml = article?.content || html;
    const markdown = turndownService.turndown(cleanHtml);

    return {
      title: article?.title || document.title || 'Healthcare Entity Audit',
      byline: article?.byline || '',
      excerpt: article?.excerpt || '',
      markdown: markdown || '',
      textContent: article?.textContent || '',
      siteName: article?.siteName || '',
    };
  } catch (err) {
    console.warn('Readability extraction fallback:', err);
    return {
      title: 'Healthcare Entity Audit',
      byline: '',
      excerpt: '',
      markdown: '',
      textContent: '',
    };
  }
}

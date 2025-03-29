import { Book, Chapter } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Extracts chapters from book content
 * This is a simple implementation that looks for headings in HTML content
 * or lines that might be chapter titles in text content
 */
export const extractChapters = (book: Book): Chapter[] => {
  const chapters: Chapter[] = [];
  
  // If the book already has chapters defined, return them
  if (book.chapters && book.chapters.length > 0) {
    return book.chapters;
  }
  
  // Use HTML content if available, otherwise use text content
  const content = book.htmlContent || book.content;
  
  // Simple chapter detection based on content patterns
  content.forEach((page, index) => {
    // For HTML content, look for heading tags
    if (book.htmlContent && typeof page === 'string') {
      // Check if the page starts with a heading tag
      if (/<h[1-3][^>]*>.*?<\/h[1-3]>/i.test(page.trim().substring(0, 100))) {
        // Extract the heading text
        const match = page.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
        if (match && match[1]) {
          const title = match[1].replace(/<[^>]*>/g, '').trim();
          chapters.push({
            id: uuidv4(),
            title,
            pageIndex: index
          });
        }
      }
    } 
    // For text content, use heuristics to detect chapter titles
    else if (typeof page === 'string') {
      const lines = page.split('\n');
      const firstLine = lines[0].trim();
      
      // Check if the first line looks like a chapter title
      if (
        // Check if it starts with "Chapter" or similar
        /^(chapter|section|part)\s+\d+/i.test(firstLine) ||
        // Check if it's a short line (likely a title) and all caps or title case
        (firstLine.length < 50 && 
          (firstLine === firstLine.toUpperCase() || 
           firstLine.split(' ').every(word => word.charAt(0) === word.charAt(0).toUpperCase())))
      ) {
        chapters.push({
          id: uuidv4(),
          title: firstLine,
          pageIndex: index
        });
      }
    }
  });
  
  // If no chapters were detected but the book has multiple pages,
  // create some default chapters for navigation
  if (chapters.length === 0 && content.length > 1) {
    // Create chapters for every 10 pages or so
    const chapterInterval = Math.max(1, Math.floor(content.length / 10));
    for (let i = 0; i < content.length; i += chapterInterval) {
      chapters.push({
        id: uuidv4(),
        title: `Section ${Math.floor(i / chapterInterval) + 1}`,
        pageIndex: i
      });
    }
  }
  
  return chapters;
};

import { Book } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { textToHtml, htmlToDelta, epubToHtml, docxToHtml } from './formatConversion';

/**
 * Process a file and convert it to a Book object
 */
export async function processFile(file: File): Promise<Book | null> {
  try {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const arrayBuffer = await file.arrayBuffer();
    
    switch (fileExtension) {
      case 'txt':
        return processTxtFile(file, arrayBuffer);
      case 'epub':
        return processEpubFile(file, arrayBuffer);
      case 'pdf':
        return processPdfFile(file, arrayBuffer);
      case 'docx':
        return processDocxFile(file, arrayBuffer);
      case 'rtf':
        return processRtfFile(file, arrayBuffer);
      default:
        throw new Error(`Unsupported file format: ${fileExtension}`);
    }
  } catch (error) {
    console.error('Error processing file:', error);
    return null;
  }
}

/**
 * Process a TXT file
 */
async function processTxtFile(file: File, arrayBuffer: ArrayBuffer): Promise<Book> {
  const text = new TextDecoder().decode(arrayBuffer);
  const lines = text.split(/\r?\n\r?\n/); // Split by double newlines for paragraphs
  
  // Generate HTML content
  const htmlContent = lines.map(textToHtml);
  
  // Generate Delta content for editing
  const deltaContent = htmlContent.map(html => {
    const result = htmlToDelta(html);
    return result.success ? result.content[0] : null;
  });
  
  return {
    id: uuidv4(),
    title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
    author: 'Unknown',
    content: lines,
    htmlContent,
    deltaContent,
    format: 'txt',
    fileData: arrayBuffer,
    isEditable: true
  };
}

/**
 * Process an EPUB file
 * Note: This is a placeholder. In a real implementation, you would use a library like epub.js
 */
async function processEpubFile(file: File, arrayBuffer: ArrayBuffer): Promise<Book> {
  // This is a simplified placeholder
  // In a real implementation, you would parse the EPUB structure
  
  return {
    id: uuidv4(),
    title: file.name.replace(/\.[^/.]+$/, ""),
    author: 'Unknown',
    content: ['EPUB content would be parsed here'],
    htmlContent: ['<p>EPUB content would be parsed here</p>'],
    deltaContent: [
      {"ops":[{"insert":"EPUB content would be parsed here\n"}]}
    ],
    format: 'epub',
    fileData: arrayBuffer,
    isEditable: true
  };
}

/**
 * Process a PDF file
 * Note: This is a placeholder. In a real implementation, you would use a library like pdf.js
 */
async function processPdfFile(file: File, arrayBuffer: ArrayBuffer): Promise<Book> {
  // This is a simplified placeholder
  // In a real implementation, you would extract text from the PDF
  
  return {
    id: uuidv4(),
    title: file.name.replace(/\.[^/.]+$/, ""),
    author: 'Unknown',
    content: ['PDF content would be extracted here'],
    htmlContent: ['<p>PDF content would be extracted here</p>'],
    // PDFs are typically not editable directly
    format: 'pdf',
    fileData: arrayBuffer,
    isEditable: false
  };
}

/**
 * Process a DOCX file
 * Note: This is a placeholder. In a real implementation, you would use mammoth.js
 */
async function processDocxFile(file: File, arrayBuffer: ArrayBuffer): Promise<Book> {
  // In a real implementation, you would use mammoth.js to convert DOCX to HTML
  const result = await docxToHtml(arrayBuffer);
  
  const htmlContent = result.success ? result.content as string[] : ['<p>Failed to convert DOCX</p>'];
  
  // Generate Delta content for editing
  const deltaContent = htmlContent.map(html => {
    const result = htmlToDelta(html);
    return result.success ? result.content[0] : null;
  });
  
  return {
    id: uuidv4(),
    title: file.name.replace(/\.[^/.]+$/, ""),
    author: 'Unknown',
    content: htmlContent.map(html => html.replace(/<[^>]*>/g, '')), // Strip HTML tags for plain text
    htmlContent,
    deltaContent,
    format: 'docx',
    fileData: arrayBuffer,
    isEditable: true
  };
}

/**
 * Process an RTF file
 * Note: This is a placeholder. In a real implementation, you would use a library to parse RTF
 */
async function processRtfFile(file: File, arrayBuffer: ArrayBuffer): Promise<Book> {
  // This is a simplified placeholder
  // In a real implementation, you would convert RTF to HTML
  
  return {
    id: uuidv4(),
    title: file.name.replace(/\.[^/.]+$/, ""),
    author: 'Unknown',
    content: ['RTF content would be converted here'],
    htmlContent: ['<p>RTF content would be converted here</p>'],
    deltaContent: [
      {"ops":[{"insert":"RTF content would be converted here\n"}]}
    ],
    format: 'txt', // We'll treat it as text for now
    fileData: arrayBuffer,
    isEditable: true
  };
}

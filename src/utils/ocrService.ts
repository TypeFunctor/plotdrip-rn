import { OCRResponse } from '../types';

// This is a mock OCR service for development
// In a real app, this would make API calls to your OCR server
export async function performOCR(images: string[]): Promise<OCRResponse> {
  console.log(`Performing OCR on ${images.length} images...`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Mock successful OCR response
    const mockHtmlPages = images.map((_, index) => {
      return `
        <h1>Sample OCR Result - Page ${index + 1}</h1>
        <p>This is a sample OCR result for demonstration purposes. In a real application, this would be the actual text extracted from the image using OCR technology.</p>
        <p>The OCR service would analyze the image and convert the text content to HTML format, preserving formatting such as:</p>
        <ul>
          <li>Paragraphs and line breaks</li>
          <li>Text formatting (bold, italic, etc.)</li>
          <li>Lists and other structural elements</li>
        </ul>
        <p>This mock response simulates what you would receive from a real OCR service.</p>
      `;
    });
    
    return {
      success: true,
      pages: mockHtmlPages
    };
  } catch (error) {
    console.error('OCR processing error:', error);
    return {
      success: false,
      pages: [],
      error: 'Failed to process OCR request'
    };
  }
}

// Function to convert a file to base64
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
}

// Function to convert an ArrayBuffer to base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return btoa(binary);
}

// Function to split a PDF into page images (mock implementation)
export async function splitPdfToImages(pdfData: ArrayBuffer): Promise<string[]> {
  console.log('Splitting PDF to images...');
  
  // In a real app, you would use a PDF.js or similar library to render each page as an image
  // This is just a mock that returns placeholder images
  
  // Determine rough number of pages based on file size (just for mock purposes)
  const pageCount = Math.max(1, Math.floor(pdfData.byteLength / 50000));
  
  // Create mock base64 images
  const mockImages = Array(pageCount).fill('').map((_, i) => 
    // This is a tiny 1x1 transparent pixel as a placeholder
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  );
  
  return mockImages;
}

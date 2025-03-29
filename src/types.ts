export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  content: string[];
  format: 'txt' | 'epub' | 'pdf' | 'docx' | 'html' | 'delta';
  fileData?: ArrayBuffer | null;
  htmlContent?: string[];
  deltaContent?: any[];
  isEditable?: boolean;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  pageIndex: number;
}

export interface OCRResponse {
  success: boolean;
  pages: string[]; // HTML strings for each page
  error?: string;
}

export interface ConversionResult {
  success: boolean;
  content: string[] | any[];
  error?: string;
}

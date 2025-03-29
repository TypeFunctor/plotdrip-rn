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
  characters?: Character[];
  events?: Event[];
  settings?: Setting[];
  relationships?: Relationship[];
}

export interface Chapter {
  id: string;
  title: string;
  pageIndex: number;
}

export interface Character {
  id: string;
  name: string;
  description?: string;
  traits?: string[];
  firstAppearance?: number; // pageIndex
  imageUrl?: string;
  relationships?: string[]; // IDs of related relationships
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  pageIndex?: number;
  characters?: string[]; // IDs of involved characters
  setting?: string; // ID of the setting
  importance?: 'minor' | 'major' | 'pivotal';
}

export interface Setting {
  id: string;
  name: string;
  description?: string;
  firstAppearance?: number; // pageIndex
  imageUrl?: string;
  events?: string[]; // IDs of events that occur here
}

export interface Relationship {
  id: string;
  type: 'family' | 'friend' | 'enemy' | 'romantic' | 'professional' | 'other';
  description?: string;
  characters: string[]; // IDs of involved characters (usually 2)
  firstMentioned?: number; // pageIndex
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

export interface KnowledgeGraphTriplet {
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
  sourcePageIndex?: number;
}

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
  branches?: Branch[];
  knowledgeGraph?: KnowledgeGraph;
  isPlanning?: boolean; // Flag to indicate if this is a planning document
  literaryDevices?: LiteraryDevicesByChapter[];
  onUpdate?: (book: Book) => void; // Function to update the book (used by components)
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
  goals?: string[];
  conflicts?: string[];
  arc?: 'flat' | 'positive' | 'negative' | 'circular';
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  pageIndex?: number;
  characters?: string[]; // IDs of involved characters
  setting?: string; // ID of the setting
  importance?: 'minor' | 'major' | 'pivotal';
  consequences?: string[]; // IDs of events that result from this event
  causes?: string[]; // IDs of events that caused this event
  branchPoint?: boolean; // Whether this event is a potential branch point
}

export interface Setting {
  id: string;
  name: string;
  description?: string;
  firstAppearance?: number; // pageIndex
  imageUrl?: string;
  events?: string[]; // IDs of events that occur here
  atmosphere?: string;
  timeperiod?: string;
}

export interface Relationship {
  id: string;
  type: 'family' | 'friend' | 'enemy' | 'romantic' | 'professional' | 'other';
  description?: string;
  characters: string[]; // IDs of involved characters (usually 2)
  firstMentioned?: number; // pageIndex
  dynamics?: string;
  evolution?: 'improving' | 'deteriorating' | 'stable' | 'complex';
}

export interface Branch {
  id: string;
  name: string;
  description?: string;
  parentBranchId?: string; // ID of the branch this branches from
  branchPointEventId?: string; // ID of the event where the branch occurs
  branchPointPageIndex: number; // Page index where the branch starts
  content: string[]; // Content after the branch point
  htmlContent?: string[];
  deltaContent?: any[];
  events?: Event[];
  isActive?: boolean; // Whether this branch is currently being viewed
  reconnectBranchId?: string; // ID of the branch this reconnects to, if any
  reconnectPageIndex?: number; // Page index where the branch reconnects
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  triplets: KnowledgeGraphTriplet[];
}

export interface KnowledgeGraphNode {
  id: string;
  type: 'character' | 'event' | 'setting' | 'relationship' | 'concept';
  label: string;
  entityId?: string; // ID of the corresponding entity (character, event, etc.)
  properties?: Record<string, any>;
}

export interface KnowledgeGraphEdge {
  id: string;
  source: string; // ID of source node
  target: string; // ID of target node
  label: string;
  weight?: number; // Strength of connection
  properties?: Record<string, any>;
}

export interface KnowledgeGraphTriplet {
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
  sourcePageIndex?: number;
}

export interface LiteraryDevicesByChapter {
  chapterId: string;
  devices: LiteraryDevice[];
}

export interface LiteraryDevice {
  id: string;
  type: LiteraryDeviceType;
  category: LiteraryDeviceCategory;
  description: string;
  excerpt?: string;
  pageIndex?: number;
  impact?: string;
  characters?: string[]; // IDs of characters involved
  settings?: string[]; // IDs of settings involved
  events?: string[]; // IDs of events involved
  relatedDevices?: string[]; // IDs of related literary devices
}

export type LiteraryDeviceCategory = 
  'character' | 
  'plot' | 
  'setting' | 
  'perspective' | 
  'figurative_language' | 
  'structure';

export type LiteraryDeviceType = 
  // Character devices
  'character_introduction' | 'character_development' | 'character_foil' | 'character_archetype' | 
  'character_motivation' | 'character_epiphany' | 'character_transformation' |
  
  // Plot devices
  'foreshadowing' | 'flashback' | 'plot_twist' | 'cliffhanger' | 'chekhov_gun' | 
  'deus_ex_machina' | 'red_herring' | 'setup_payoff' | 'dramatic_irony' |
  
  // Setting devices
  'world_building' | 'pathetic_fallacy' | 'setting_as_character' | 'setting_contrast' |
  'setting_symbolism' | 'setting_mood' | 'setting_as_constraint' |
  
  // Perspective devices
  'point_of_view_shift' | 'unreliable_narrator' | 'stream_of_consciousness' | 
  'interior_monologue' | 'epistolary' | 'framing_device' | 'breaking_fourth_wall' |
  
  // Figurative language
  'metaphor' | 'simile' | 'personification' | 'hyperbole' | 'irony' | 
  'symbol' | 'allegory' | 'allusion' | 'juxtaposition' | 'motif' |
  'alliteration' | 'assonance' | 'consonance' | 'onomatopoeia' |
  
  // Structure devices
  'parallel_plot' | 'frame_story' | 'vignette' | 'in_medias_res' | 'exposition' |
  'rising_action' | 'climax' | 'falling_action' | 'resolution' | 'denouement' |
  
  // Other
  'other';

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

export interface LLMRequest {
  type: 'plot_suggestion' | 'character_development' | 'event_creation' | 'branch_suggestion' | 'complete_story' | 'literary_device_analysis';
  book: Partial<Book>;
  context?: string;
  constraints?: string[];
}

export interface LLMResponse {
  success: boolean;
  content: any;
  error?: string;
}

export interface PlotSuggestion {
  title: string;
  description: string;
  events: Partial<Event>[];
  themes: string[];
  conflicts: string[];
  resolutions: string[];
}

export interface BranchSuggestion {
  name: string;
  description: string;
  branchPointEventId: string;
  consequences: string;
  events: Partial<Event>[];
  reconnectPossible: boolean;
  reconnectDescription?: string;
}

export interface LiteraryDeviceAnalysisResult {
  chapterId: string;
  chapterTitle: string;
  devices: LiteraryDevice[];
}

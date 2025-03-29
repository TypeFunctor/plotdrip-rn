import { Book, LLMRequest, LLMResponse, PlotSuggestion, BranchSuggestion, Event, Character, Setting, Relationship } from '../types';
import { v4 as uuidv4 } from 'uuid';

// This is a mock implementation of an LLM service
// In a real application, this would make API calls to a remote LLM service

/**
 * Send a request to the LLM service
 */
export const sendLLMRequest = async (request: LLMRequest): Promise<LLMResponse> => {
  console.log('Sending LLM request:', request.type);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // Handle different request types
    switch (request.type) {
      case 'plot_suggestion':
        return handlePlotSuggestion(request);
      case 'character_development':
        return handleCharacterDevelopment(request);
      case 'event_creation':
        return handleEventCreation(request);
      case 'branch_suggestion':
        return handleBranchSuggestion(request);
      case 'complete_story':
        return handleCompleteStory(request);
      default:
        return {
          success: false,
          content: null,
          error: 'Unknown request type'
        };
    }
  } catch (error) {
    return {
      success: false,
      content: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Handle a plot suggestion request
 */
const handlePlotSuggestion = (request: LLMRequest): LLMResponse => {
  const { book } = request;
  
  // Check if we have enough information to generate a plot
  if (!book.characters || book.characters.length === 0) {
    return {
      success: false,
      content: null,
      error: 'Please add at least one character to generate plot suggestions'
    };
  }
  
  // Generate a plot suggestion based on the book's characters, settings, etc.
  const plotSuggestion: PlotSuggestion = {
    title: generatePlotTitle(book),
    description: generatePlotDescription(book),
    events: generatePlotEvents(book),
    themes: generatePlotThemes(book),
    conflicts: generatePlotConflicts(book),
    resolutions: generatePlotResolutions(book)
  };
  
  return {
    success: true,
    content: plotSuggestion
  };
};

/**
 * Handle a character development request
 */
const handleCharacterDevelopment = (request: LLMRequest): LLMResponse => {
  const { book, context } = request;
  
  // Parse the context to get the character ID
  const characterId = context;
  
  if (!characterId || !book.characters) {
    return {
      success: false,
      content: null,
      error: 'Invalid character ID or no characters available'
    };
  }
  
  const character = book.characters.find(c => c.id === characterId);
  
  if (!character) {
    return {
      success: false,
      content: null,
      error: 'Character not found'
    };
  }
  
  // Generate character development suggestions
  const developedCharacter: Character = {
    ...character,
    description: character.description || generateCharacterDescription(character, book),
    traits: character.traits || generateCharacterTraits(character, book),
    goals: character.goals || generateCharacterGoals(character, book),
    conflicts: character.conflicts || generateCharacterConflicts(character, book),
    arc: character.arc || generateCharacterArc(character, book)
  };
  
  return {
    success: true,
    content: developedCharacter
  };
};

/**
 * Handle an event creation request
 */
const handleEventCreation = (request: LLMRequest): LLMResponse => {
  const { book, context } = request;
  
  if (!book.characters || book.characters.length === 0) {
    return {
      success: false,
      content: null,
      error: 'Please add at least one character to generate events'
    };
  }
  
  // Generate a new event based on the book's characters, settings, etc.
  const newEvent: Event = {
    id: uuidv4(),
    title: generateEventTitle(book),
    description: generateEventDescription(book),
    characters: selectRelevantCharacters(book),
    setting: selectRelevantSetting(book),
    importance: selectEventImportance(),
    branchPoint: Math.random() > 0.7 // 30% chance of being a branch point
  };
  
  return {
    success: true,
    content: newEvent
  };
};

/**
 * Handle a branch suggestion request
 */
const handleBranchSuggestion = (request: LLMRequest): LLMResponse => {
  const { book, context } = request;
  
  // Parse the context to get the event ID
  const eventId = context;
  
  if (!eventId || !book.events) {
    return {
      success: false,
      content: null,
      error: 'Invalid event ID or no events available'
    };
  }
  
  const event = book.events.find(e => e.id === eventId);
  
  if (!event) {
    return {
      success: false,
      content: null,
      error: 'Event not found'
    };
  }
  
  // Generate branch suggestions based on the event
  const branchSuggestion: BranchSuggestion = {
    name: generateBranchName(event, book),
    description: generateBranchDescription(event, book),
    branchPointEventId: event.id,
    consequences: generateBranchConsequences(event, book),
    events: generateBranchEvents(event, book),
    reconnectPossible: Math.random() > 0.5, // 50% chance of being able to reconnect
    reconnectDescription: Math.random() > 0.5 ? generateReconnectDescription(event, book) : undefined
  };
  
  return {
    success: true,
    content: branchSuggestion
  };
};

/**
 * Handle a complete story request
 */
const handleCompleteStory = (request: LLMRequest): LLMResponse => {
  const { book } = request;
  
  if (!book.characters || book.characters.length === 0 || !book.events || book.events.length === 0) {
    return {
      success: false,
      content: null,
      error: 'Please add characters and events to generate a complete story'
    };
  }
  
  // Generate a complete story based on the book's characters, events, settings, etc.
  const storyPages = generateStoryPages(book);
  
  return {
    success: true,
    content: {
      content: storyPages,
      htmlContent: storyPages.map(page => `<p>${page}</p>`)
    }
  };
};

// Helper functions for generating content

const generatePlotTitle = (book: Partial<Book>): string => {
  const titles = [
    'The Journey Begins',
    'Unexpected Allies',
    'Shadows of the Past',
    'A New Dawn',
    'The Final Confrontation'
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
};

const generatePlotDescription = (book: Partial<Book>): string => {
  const mainCharacter = book.characters?.[0];
  const mainSetting = book.settings?.[0];
  
  if (mainCharacter && mainSetting) {
    return `${mainCharacter.name} must navigate the challenges of ${mainSetting.name} while confronting personal demons and external threats.`;
  }
  
  return 'A compelling journey of self-discovery and conflict, where the protagonist must overcome obstacles to achieve their goals.';
};

const generatePlotEvents = (book: Partial<Book>): Partial<Event>[] => {
  const events = [
    {
      title: 'The Call to Adventure',
      description: 'The protagonist is drawn into the main conflict of the story.',
      importance: 'pivotal' as const
    },
    {
      title: 'Meeting the Mentor',
      description: 'The protagonist gains guidance from a wise figure.',
      importance: 'major' as const
    },
    {
      title: 'Crossing the Threshold',
      description: 'The protagonist commits to the journey and enters the unknown.',
      importance: 'pivotal' as const
    },
    {
      title: 'Tests, Allies, and Enemies',
      description: 'The protagonist faces challenges and meets friends and foes.',
      importance: 'major' as const
    },
    {
      title: 'The Ordeal',
      description: 'The protagonist faces their greatest fear or challenge.',
      importance: 'pivotal' as const
    },
    {
      title: 'The Reward',
      description: 'The protagonist achieves their goal or gains new insight.',
      importance: 'major' as const
    },
    {
      title: 'The Road Back',
      description: 'The protagonist begins the journey home or to a new normal.',
      importance: 'major' as const
    },
    {
      title: 'The Resurrection',
      description: 'The protagonist faces a final test or challenge.',
      importance: 'pivotal' as const
    },
    {
      title: 'Return with the Elixir',
      description: 'The protagonist returns with something of value to share.',
      importance: 'pivotal' as const
    }
  ];
  
  // Return a subset of events
  return events.slice(0, 5 + Math.floor(Math.random() * 5));
};

const generatePlotThemes = (book: Partial<Book>): string[] => {
  const themes = [
    'Redemption',
    'Love and sacrifice',
    'Coming of age',
    'Power and corruption',
    'Identity and self-discovery',
    'Justice and revenge',
    'Fate versus free will',
    'Humanity versus nature',
    'War and peace',
    'Good versus evil'
  ];
  
  // Return a subset of themes
  return themes.slice(0, 2 + Math.floor(Math.random() * 3));
};

const generatePlotConflicts = (book: Partial<Book>): string[] => {
  const conflicts = [
    'Character vs. Self',
    'Character vs. Character',
    'Character vs. Society',
    'Character vs. Nature',
    'Character vs. Technology',
    'Character vs. Supernatural',
    'Character vs. Fate'
  ];
  
  // Return a subset of conflicts
  return conflicts.slice(0, 2 + Math.floor(Math.random() * 2));
};

const generatePlotResolutions = (book: Partial<Book>): string[] => {
  const resolutions = [
    'The protagonist achieves their goal and grows as a person.',
    'The protagonist fails but learns an important lesson.',
    'The protagonist sacrifices something important to achieve a greater good.',
    'The protagonist reconciles with their past and moves forward.',
    'The protagonist discovers a new purpose or direction in life.'
  ];
  
  // Return a subset of resolutions
  return resolutions.slice(0, 1 + Math.floor(Math.random() * 2));
};

const generateCharacterDescription = (character: Character, book: Partial<Book>): string => {
  const descriptions = [
    `${character.name} is a complex individual with a troubled past but a hopeful outlook.`,
    `${character.name} is known for their quick wit and resourcefulness in difficult situations.`,
    `${character.name} carries the weight of past mistakes but strives to make amends.`,
    `${character.name} is respected for their wisdom and calm demeanor in the face of adversity.`,
    `${character.name} is a passionate individual driven by strong ideals and convictions.`
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const generateCharacterTraits = (character: Character, book: Partial<Book>): string[] => {
  const allTraits = [
    'intelligent', 'brave', 'loyal', 'compassionate', 'determined',
    'stubborn', 'impulsive', 'cautious', 'creative', 'analytical',
    'charismatic', 'introverted', 'extroverted', 'optimistic', 'pessimistic',
    'honest', 'secretive', 'generous', 'selfish', 'ambitious'
  ];
  
  // Select 3-5 random traits
  const traitCount = 3 + Math.floor(Math.random() * 3);
  const shuffled = [...allTraits].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, traitCount);
};

const generateCharacterGoals = (character: Character, book: Partial<Book>): string[] => {
  const goals = [
    'Find redemption for past mistakes',
    'Protect loved ones from harm',
    'Discover the truth about their origins',
    'Achieve recognition or status in society',
    'Overcome a personal weakness or fear',
    'Restore balance or justice to the world',
    'Find a place to belong or call home',
    'Avenge a wrong done to them or others'
  ];
  
  // Select 1-3 random goals
  const goalCount = 1 + Math.floor(Math.random() * 3);
  const shuffled = [...goals].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, goalCount);
};

const generateCharacterConflicts = (character: Character, book: Partial<Book>): string[] => {
  const conflicts = [
    'Internal struggle between duty and desire',
    'Rivalry with another character',
    'Societal expectations that conflict with personal values',
    'Traumatic past experiences that haunt them',
    'Moral dilemma with no clear right answer',
    'Physical limitation or weakness to overcome',
    'Conflicting loyalties to different people or causes'
  ];
  
  // Select 1-2 random conflicts
  const conflictCount = 1 + Math.floor(Math.random() * 2);
  const shuffled = [...conflicts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, conflictCount);
};

const generateCharacterArc = (character: Character, book: Partial<Book>): 'flat' | 'positive' | 'negative' | 'circular' => {
  const arcs = ['flat', 'positive', 'negative', 'circular'] as const;
  return arcs[Math.floor(Math.random() * arcs.length)];
};

const generateEventTitle = (book: Partial<Book>): string => {
  const titles = [
    'The Unexpected Visitor',
    'A Startling Discovery',
    'The Betrayal',
    'A Moment of Truth',
    'The Confrontation',
    'A Narrow Escape',
    'The Revelation',
    'An Unlikely Alliance',
    'The Sacrifice',
    'A New Beginning'
  ];
  
  return titles[Math.floor(Math.random() * titles.length)];
};

const generateEventDescription = (book: Partial<Book>): string => {
  const descriptions = [
    'A surprising turn of events forces the characters to reconsider their plans.',
    'An unexpected revelation changes everything the characters thought they knew.',
    'A moment of crisis brings hidden tensions to the surface.',
    'A chance encounter leads to a valuable new alliance.',
    'A difficult decision must be made with far-reaching consequences.'
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const selectRelevantCharacters = (book: Partial<Book>): string[] => {
  if (!book.characters || book.characters.length === 0) {
    return [];
  }
  
  // Select 1-3 random characters
  const characterCount = 1 + Math.floor(Math.random() * Math.min(3, book.characters.length));
  const shuffled = [...book.characters].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, characterCount).map(c => c.id);
};

const selectRelevantSetting = (book: Partial<Book>): string | undefined => {
  if (!book.settings || book.settings.length === 0) {
    return undefined;
  }
  
  // Select a random setting
  const randomIndex = Math.floor(Math.random() * book.settings.length);
  return book.settings[randomIndex].id;
};

const selectEventImportance = (): 'minor' | 'major' | 'pivotal' => {
  const importances = ['minor', 'major', 'pivotal'] as const;
  const weights = [0.5, 0.3, 0.2]; // 50% minor, 30% major, 20% pivotal
  
  const random = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < importances.length; i++) {
    cumulativeWeight += weights[i];
    if (random < cumulativeWeight) {
      return importances[i];
    }
  }
  
  return 'minor';
};

const generateBranchName = (event: Event, book: Partial<Book>): string => {
  const names = [
    'The Road Not Taken',
    'An Alternative Path',
    'What If...',
    'The Other Choice',
    'A Different Outcome',
    'The Unexpected Turn',
    'The Divergence',
    'The Fork in the Road'
  ];
  
  return names[Math.floor(Math.random() * names.length)];
};

const generateBranchDescription = (event: Event, book: Partial<Book>): string => {
  return `An alternative storyline that explores what might happen if different choices were made during "${event.title}".`;
};

const generateBranchConsequences = (event: Event, book: Partial<Book>): string => {
  const consequences = [
    'Characters form different alliances, leading to new conflicts and resolutions.',
    'A character who was an ally becomes an enemy, or vice versa.',
    'A seemingly minor decision has far-reaching consequences for all involved.',
    'A character avoids a tragedy but faces new challenges instead.',
    'The main conflict is resolved in an unexpected way, revealing new aspects of the characters.'
  ];
  
  return consequences[Math.floor(Math.random() * consequences.length)];
};

const generateBranchEvents = (event: Event, book: Partial<Book>): Partial<Event>[] => {
  // Generate 2-4 new events for the branch
  const eventCount = 2 + Math.floor(Math.random() * 3);
  const events: Partial<Event>[] = [];
  
  for (let i = 0; i < eventCount; i++) {
    events.push({
      title: generateEventTitle(book),
      description: generateEventDescription(book),
      importance: selectEventImportance()
    });
  }
  
  return events;
};

const generateReconnectDescription = (event: Event, book: Partial<Book>): string => {
  const descriptions = [
    'The branch eventually leads back to the main storyline, but with the characters changed by their experiences.',
    'Despite taking a different path, the characters ultimately arrive at a similar destination, though with new perspectives.',
    'The branch reconnects with the main story at a critical moment, bringing new insights to the resolution.',
    'The divergent path eventually converges with the original, creating a richer and more complex narrative.'
  ];
  
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const generateStoryPages = (book: Partial<Book>): string[] => {
  // This is a simplified mock implementation
  // In a real application, this would generate a complete story based on the book's structure
  
  const pages: string[] = [];
  const pageCount = 10 + Math.floor(Math.random() * 10); // 10-19 pages
  
  for (let i = 0; i < pageCount; i++) {
    pages.push(`Page ${i + 1} of the generated story. This would contain actual narrative content in a real implementation.`);
  }
  
  return pages;
};

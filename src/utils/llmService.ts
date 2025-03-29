import { LLMRequest, LLMResponse, Character, Event, Branch, LiteraryDevice, LiteraryDeviceAnalysisResult, LiteraryDeviceCategory, LiteraryDeviceType } from '../types';
import { v4 as uuidv4 } from 'uuid';

// This is a mock implementation of an LLM service
// In a real application, this would make API calls to a language model service
export const sendLLMRequest = async (request: LLMRequest): Promise<LLMResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    switch (request.type) {
      case 'plot_suggestion':
        return generatePlotSuggestion(request);
      case 'character_development':
        return developCharacter(request);
      case 'event_creation':
        return createEvent(request);
      case 'branch_suggestion':
        return suggestBranch(request);
      case 'complete_story':
        return completeStory(request);
      case 'literary_device_analysis':
        return analyzeLiteraryDevices(request);
      default:
        return {
          success: false,
          error: 'Unsupported request type',
          content: null
        };
    }
  } catch (error) {
    return {
      success: false,
      error: `Error processing request: ${error}`,
      content: null
    };
  }
};

const generatePlotSuggestion = (request: LLMRequest): LLMResponse => {
  const { book } = request;
  
  // Generate a plot suggestion based on existing characters and settings
  const characters = book.characters || [];
  const settings = book.settings || [];
  
  if (characters.length === 0 || settings.length === 0) {
    return {
      success: false,
      error: 'Need at least one character and one setting to generate a plot',
      content: null
    };
  }
  
  // Pick a random character as protagonist
  const protagonist = characters[Math.floor(Math.random() * characters.length)];
  
  // Pick a random setting as main setting
  const mainSetting = settings[Math.floor(Math.random() * settings.length)];
  
  // Generate a conflict
  const conflicts = [
    'struggles with inner demons',
    'faces a powerful enemy',
    'must overcome a natural disaster',
    'is falsely accused of a crime',
    'discovers a dark secret',
    'loses something precious',
    'must make an impossible choice'
  ];
  const conflict = conflicts[Math.floor(Math.random() * conflicts.length)];
  
  // Generate a resolution
  const resolutions = [
    'triumphs through perseverance',
    'makes a noble sacrifice',
    'finds an unexpected ally',
    'discovers an unknown strength',
    'changes their perspective',
    'accepts their fate',
    'finds a clever solution'
  ];
  const resolution = resolutions[Math.floor(Math.random() * resolutions.length)];
  
  // Generate themes
  const themeOptions = [
    'redemption', 'love', 'betrayal', 'courage', 'sacrifice', 
    'identity', 'power', 'justice', 'freedom', 'fate', 
    'family', 'friendship', 'loyalty', 'greed', 'revenge'
  ];
  const themes = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * themeOptions.length);
    themes.push(themeOptions[randomIndex]);
    themeOptions.splice(randomIndex, 1);
  }
  
  // Generate events
  const eventCount = 3 + Math.floor(Math.random() * 3); // 3-5 events
  const events = [];
  
  const eventTypes = [
    { title: 'Inciting Incident', importance: 'pivotal' },
    { title: 'Rising Action', importance: 'major' },
    { title: 'Complication', importance: 'major' },
    { title: 'Midpoint Twist', importance: 'pivotal' },
    { title: 'Low Point', importance: 'major' },
    { title: 'Climactic Confrontation', importance: 'pivotal' },
    { title: 'Resolution', importance: 'major' }
  ];
  
  for (let i = 0; i < Math.min(eventCount, eventTypes.length); i++) {
    events.push({
      title: eventTypes[i].title,
      description: `${protagonist.name} ${i === 0 ? conflict : i === eventCount - 1 ? resolution : 'continues the journey'} in ${mainSetting.name}.`,
      importance: eventTypes[i].importance as 'minor' | 'major' | 'pivotal',
      characters: [protagonist.id],
      setting: mainSetting.id
    });
  }
  
  return {
    success: true,
    content: {
      title: `${protagonist.name}'s Journey`,
      description: `A tale of ${themes[0]} and ${themes[1]} where ${protagonist.name} ${conflict} and ultimately ${resolution}.`,
      events,
      themes,
      conflicts: [conflict],
      resolutions: [resolution]
    }
  };
};

const developCharacter = (request: LLMRequest): LLMResponse => {
  const { book, context } = request;
  
  // Find the character to develop
  const characters = book.characters || [];
  const characterId = context;
  
  const character = characters.find(c => c.id === characterId);
  
  if (!character) {
    return {
      success: false,
      error: 'Character not found',
      content: null
    };
  }
  
  // Generate traits
  const traitOptions = [
    'ambitious', 'brave', 'cautious', 'determined', 'empathetic',
    'funny', 'generous', 'honest', 'intelligent', 'kind',
    'loyal', 'mysterious', 'naive', 'optimistic', 'patient',
    'quiet', 'rebellious', 'stubborn', 'thoughtful', 'wise'
  ];
  
  const traits = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * traitOptions.length);
    traits.push(traitOptions[randomIndex]);
    traitOptions.splice(randomIndex, 1);
  }
  
  // Generate goals
  const goalOptions = [
    'find true love',
    'avenge a wrong',
    'discover the truth',
    'achieve recognition',
    'protect loved ones',
    'gain power',
    'find inner peace',
    'escape the past',
    'prove their worth',
    'change the world'
  ];
  
  const goals = [];
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * goalOptions.length);
    goals.push(goalOptions[randomIndex]);
    goalOptions.splice(randomIndex, 1);
  }
  
  // Generate conflicts
  const conflictOptions = [
    'self-doubt',
    'a powerful enemy',
    'societal expectations',
    'a moral dilemma',
    'a physical limitation',
    'a dark past',
    'a forbidden desire',
    'a difficult choice',
    'loss of a loved one',
    'betrayal by a friend'
  ];
  
  const conflicts = [];
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * conflictOptions.length);
    conflicts.push(conflictOptions[randomIndex]);
    conflictOptions.splice(randomIndex, 1);
  }
  
  // Determine character arc
  const arcOptions = ['flat', 'positive', 'negative', 'circular'];
  const arc = arcOptions[Math.floor(Math.random() * arcOptions.length)] as 'flat' | 'positive' | 'negative' | 'circular';
  
  // Create developed character
  const developedCharacter: Character = {
    ...character,
    traits,
    goals,
    conflicts,
    arc
  };
  
  return {
    success: true,
    content: developedCharacter
  };
};

const createEvent = (request: LLMRequest): LLMResponse => {
  const { book } = request;
  
  const characters = book.characters || [];
  const settings = book.settings || [];
  
  if (characters.length === 0) {
    return {
      success: false,
      error: 'Need at least one character to generate an event',
      content: null
    };
  }
  
  // Pick random characters
  const characterCount = 1 + Math.floor(Math.random() * Math.min(2, characters.length));
  const selectedCharacters = [];
  const charactersCopy = [...characters];
  
  for (let i = 0; i < characterCount; i++) {
    const randomIndex = Math.floor(Math.random() * charactersCopy.length);
    selectedCharacters.push(charactersCopy[randomIndex]);
    charactersCopy.splice(randomIndex, 1);
  }
  
  // Pick a random setting if available
  let setting = undefined;
  if (settings.length > 0) {
    setting = settings[Math.floor(Math.random() * settings.length)];
  }
  
  // Generate event type
  const eventTypes = [
    'Discovery', 'Confrontation', 'Decision', 'Revelation', 
    'Transformation', 'Loss', 'Victory', 'Journey', 'Return'
  ];
  const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
  
  // Generate event description
  const actions = [
    'finds', 'loses', 'fights', 'escapes', 'creates', 
    'destroys', 'learns', 'teaches', 'saves', 'betrays'
  ];
  const action = actions[Math.floor(Math.random() * actions.length)];
  
  const objects = [
    'a secret', 'a treasure', 'an enemy', 'a friend', 'a memory',
    'a weapon', 'a truth', 'a lie', 'a home', 'a way out'
  ];
  const object = objects[Math.floor(Math.random() * objects.length)];
  
  // Determine importance
  const importanceOptions = ['minor', 'major', 'pivotal'];
  const importance = importanceOptions[Math.floor(Math.random() * importanceOptions.length)] as 'minor' | 'major' | 'pivotal';
  
  // Determine if it's a branch point
  const branchPoint = Math.random() > 0.7; // 30% chance
  
  // Create event
  const event: Event = {
    id: uuidv4(),
    title: `${eventType}: ${selectedCharacters[0].name} ${action} ${object}`,
    description: `${selectedCharacters.map(c => c.name).join(' and ')} ${selectedCharacters.length > 1 ? 'are' : 'is'} involved in a ${eventType.toLowerCase()} where ${selectedCharacters[0].name} ${action} ${object}${setting ? ` in ${setting.name}` : ''}.`,
    characters: selectedCharacters.map(c => c.id),
    setting: setting?.id,
    importance,
    branchPoint
  };
  
  return {
    success: true,
    content: event
  };
};

const suggestBranch = (request: LLMRequest): LLMResponse => {
  const { book, context } = request;
  
  // Find the event that is the branch point
  const events = book.events || [];
  const eventId = context;
  
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return {
      success: false,
      error: 'Event not found',
      content: null
    };
  }
  
  // Generate branch name
  const branchPrefixes = [
    'The Path of', 'A Journey into', 'The Road to', 
    'Exploring', 'Venturing into', 'The Way of'
  ];
  const branchThemes = [
    'Redemption', 'Darkness', 'Light', 'Truth', 'Deception',
    'Courage', 'Fear', 'Hope', 'Despair', 'Wisdom'
  ];
  
  const branchName = `${branchPrefixes[Math.floor(Math.random() * branchPrefixes.length)]} ${branchThemes[Math.floor(Math.random() * branchThemes.length)]}`;
  
  // Generate branch description
  const branchActions = [
    'chooses a different path',
    'makes an unexpected decision',
    'encounters an unforeseen obstacle',
    'receives help from an unexpected source',
    'discovers a hidden truth',
    'faces a new challenge',
    'takes a risk'
  ];
  
  const branchAction = branchActions[Math.floor(Math.random() * branchActions.length)];
  
  // Get characters involved
  const characters = book.characters || [];
  const involvedCharacters = event.characters 
    ? event.characters.map(id => characters.find(c => c.id === id)).filter(Boolean)
    : [];
  
  const mainCharacter = involvedCharacters.length > 0 
    ? involvedCharacters[0] 
    : characters.length > 0 
      ? characters[0] 
      : { name: 'The protagonist' };
  
  const branchDescription = `What if ${mainCharacter.name} ${branchAction}? This branch explores the consequences of this alternative choice.`;
  
  // Generate consequences
  const consequenceOptions = [
    'leads to unexpected allies',
    'creates new enemies',
    'reveals hidden secrets',
    'changes the balance of power',
    'alters relationships forever',
    'opens new possibilities',
    'closes certain paths',
    'tests loyalties',
    'forces difficult choices',
    'brings unforeseen dangers'
  ];
  
  const consequence = consequenceOptions[Math.floor(Math.random() * consequenceOptions.length)];
  
  const consequences = `This choice ${consequence} and dramatically changes the story's direction.`;
  
  // Generate new events for this branch
  const eventCount = 2 + Math.floor(Math.random() * 2); // 2-3 events
  const branchEvents = [];
  
  for (let i = 0; i < eventCount; i++) {
    const eventTypes = [
      'Consequence', 'Discovery', 'Challenge', 'Meeting', 'Decision'
    ];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const eventActions = [
      'confronts', 'discovers', 'creates', 'destroys', 'transforms',
      'escapes', 'embraces', 'rejects', 'accepts', 'questions'
    ];
    const eventAction = eventActions[Math.floor(Math.random() * eventActions.length)];
    
    const eventObjects = [
      'a new reality', 'an unexpected ally', 'a hidden enemy',
      'a difficult truth', 'a painful memory', 'a secret power',
      'a moral dilemma', 'a personal demon', 'a lost treasure',
      'an ancient wisdom'
    ];
    const eventObject = eventObjects[Math.floor(Math.random() * eventObjects.length)];
    
    branchEvents.push({
      title: `${eventType}: ${mainCharacter.name} ${eventAction} ${eventObject}`,
      description: `As a result of the new path, ${mainCharacter.name} ${eventAction} ${eventObject}, which ${i === eventCount - 1 ? 'brings this branch to its conclusion' : 'leads to further complications'}.`,
      importance: i === eventCount - 1 ? 'pivotal' : 'major'
    });
  }
  
  // Determine if branch can reconnect
  const reconnectPossible = Math.random() > 0.5; // 50% chance
  
  // Generate reconnect description if applicable
  let reconnectDescription = undefined;
  if (reconnectPossible) {
    const reconnectOptions = [
      'eventually leads back to the main storyline',
      'creates a parallel path that later rejoins the original story',
      'offers a detour that ultimately returns to the main narrative',
      'explores an alternative approach to the same destination',
      'provides a different perspective before returning to the main plot'
    ];
    
    reconnectDescription = reconnectOptions[Math.floor(Math.random() * reconnectOptions.length)];
  }
  
  return {
    success: true,
    content: {
      name: branchName,
      description: branchDescription,
      branchPointEventId: event.id,
      consequences,
      events: branchEvents,
      reconnectPossible,
      reconnectDescription
    }
  };
};

const completeStory = (request: LLMRequest): LLMResponse => {
  // This would generate a complete story based on the book's characters, settings, etc.
  // For the mock implementation, we'll return a simple success response
  return {
    success: true,
    content: "Story completion would be generated here based on the book's elements."
  };
};

const analyzeLiteraryDevices = (request: LLMRequest): LLMResponse => {
  const { book, context } = request;
  
  // The context should be the chapter ID to analyze
  const chapterId = context;
  
  if (!chapterId) {
    return {
      success: false,
      error: 'No chapter ID provided for analysis',
      content: null
    };
  }
  
  const chapters = book.chapters || [];
  const chapter = chapters.find(c => c.id === chapterId);
  
  if (!chapter) {
    return {
      success: false,
      error: 'Chapter not found',
      content: null
    };
  }
  
  // Generate literary devices for this chapter
  // We'll create a mix of different categories
  const deviceCount = 8 + Math.floor(Math.random() * 5); // 8-12 devices
  const devices: LiteraryDevice[] = [];
  
  // Get book elements to reference
  const characters = book.characters || [];
  const settings = book.settings || [];
  const events = book.events || [];
  
  // Define device categories and their types
  const deviceCategories: Record<LiteraryDeviceCategory, LiteraryDeviceType[]> = {
    'character': [
      'character_introduction', 'character_development', 'character_foil', 
      'character_archetype', 'character_motivation', 'character_epiphany', 
      'character_transformation'
    ],
    'plot': [
      'foreshadowing', 'flashback', 'plot_twist', 'cliffhanger', 
      'chekhov_gun', 'deus_ex_machina', 'red_herring', 'setup_payoff', 
      'dramatic_irony'
    ],
    'setting': [
      'world_building', 'pathetic_fallacy', 'setting_as_character', 
      'setting_contrast', 'setting_symbolism', 'setting_mood', 
      'setting_as_constraint'
    ],
    'perspective': [
      'point_of_view_shift', 'unreliable_narrator', 'stream_of_consciousness', 
      'interior_monologue', 'epistolary', 'framing_device', 'breaking_fourth_wall'
    ],
    'figurative_language': [
      'metaphor', 'simile', 'personification', 'hyperbole', 'irony', 
      'symbol', 'allegory', 'allusion', 'juxtaposition', 'motif',
      'alliteration', 'assonance', 'consonance', 'onomatopoeia'
    ],
    'structure': [
      'parallel_plot', 'frame_story', 'vignette', 'in_medias_res', 
      'exposition', 'rising_action', 'climax', 'falling_action', 
      'resolution', 'denouement'
    ]
  };
  
  // Descriptions for each device type
  const deviceDescriptions: Record<LiteraryDeviceType, string[]> = {
    // Character devices
    'character_introduction': [
      'Introduces a new character in a memorable way',
      'Establishes character traits through first appearance',
      'Creates a strong first impression of the character'
    ],
    'character_development': [
      'Shows growth or change in a character',
      'Reveals new aspects of a character\'s personality',
      'Deepens reader understanding of a character\'s motivations'
    ],
    'character_foil': [
      'Contrasts two characters to highlight their differences',
      'Uses character comparison to emphasize traits',
      'Creates dramatic tension through character opposition'
    ],
    'character_archetype': [
      'Employs a recognizable character type from literature',
      'Uses universal character patterns that resonate with readers',
      'Draws on collective unconscious through character representation'
    ],
    'character_motivation': [
      'Reveals what drives a character\'s actions',
      'Explores the underlying reasons for character decisions',
      'Clarifies character goals and desires'
    ],
    'character_epiphany': [
      'Shows a character\'s moment of sudden realization',
      'Depicts a character gaining important insight',
      'Presents a turning point in character understanding'
    ],
    'character_transformation': [
      'Depicts fundamental change in a character',
      'Shows character evolution through experience',
      'Illustrates how events reshape a character\'s identity'
    ],
    
    // Plot devices
    'foreshadowing': [
      'Hints at future events through subtle clues',
      'Creates anticipation by suggesting what might happen',
      'Plants seeds for later plot developments'
    ],
    'flashback': [
      'Reveals past events to provide context',
      'Explores character backstory through memory',
      'Interrupts chronological flow to show important history'
    ],
    'plot_twist': [
      'Subverts reader expectations with surprising development',
      'Changes the direction of the narrative unexpectedly',
      'Reveals information that transforms understanding of events'
    ],
    'cliffhanger': [
      'Ends a scene or chapter with unresolved tension',
      'Creates suspense by delaying resolution',
      'Compels continued reading through narrative tension'
    ],
    'chekhov_gun': [
      'Introduces an element that will become important later',
      'Plants a detail that will have significant payoff',
      'Establishes a seemingly minor element with major implications'
    ],
    'deus_ex_machina': [
      'Resolves a seemingly impossible situation through unexpected means',
      'Introduces an unlikely solution to a plot problem',
      'Uses a surprising intervention to change the course of events'
    ],
    'red_herring': [
      'Presents misleading clues to distract from the truth',
      'Creates false expectations to heighten surprise',
      'Misdirects reader attention for narrative effect'
    ],
    'setup_payoff': [
      'Establishes elements early that are resolved later',
      'Creates satisfaction through narrative completion',
      'Builds narrative coherence through planned resolution'
    ],
    'dramatic_irony': [
      'Creates tension when readers know what characters don\'t',
      'Uses audience awareness to heighten emotional impact',
      'Builds anticipation through knowledge disparity'
    ],
    
    // Setting devices
    'world_building': [
      'Establishes the rules and details of the story world',
      'Creates immersion through setting description',
      'Develops the environment in which characters operate'
    ],
    'pathetic_fallacy': [
      'Uses setting or weather to reflect emotional states',
      'Mirrors character feelings through environmental description',
      'Creates atmosphere that enhances emotional resonance'
    ],
    'setting_as_character': [
      'Treats location as an active force in the narrative',
      'Personifies setting to emphasize its importance',
      'Gives setting agency in influencing events'
    ],
    'setting_contrast': [
      'Juxtaposes different locations to highlight themes',
      'Uses setting changes to emphasize character transitions',
      'Creates meaning through environmental differences'
    ],
    'setting_symbolism': [
      'Uses location elements to represent abstract concepts',
      'Creates deeper meaning through setting details',
      'Embeds thematic significance in environmental description'
    ],
    'setting_mood': [
      'Establishes emotional atmosphere through location description',
      'Creates specific feeling through environmental details',
      'Uses setting to prepare readers for narrative events'
    ],
    'setting_as_constraint': [
      'Uses location limitations to drive plot',
      'Creates tension through environmental restrictions',
      'Forces character adaptation through setting challenges'
    ],
    
    // Perspective devices
    'point_of_view_shift': [
      'Changes narrative perspective to reveal new information',
      'Alters who is telling the story for dramatic effect',
      'Provides multiple viewpoints on the same events'
    ],
    'unreliable_narrator': [
      'Presents a narrator whose credibility is compromised',
      'Creates tension between narration and reality',
      'Challenges reader to discern truth from narrator\'s perspective'
    ],
    'stream_of_consciousness': [
      'Presents character thoughts in unfiltered flow',
      'Shows mental process without conventional structure',
      'Creates intimacy through direct access to character mind'
    ],
    'interior_monologue': [
      'Reveals character thoughts directly to reader',
      'Shows internal reflection and decision-making',
      'Creates connection through character introspection'
    ],
    'epistolary': [
      'Tells story through letters, documents, or messages',
      'Creates authenticity through documentary approach',
      'Builds narrative through character communication'
    ],
    'framing_device': [
      'Uses a story within a story structure',
      'Creates narrative layers through embedded stories',
      'Provides context through surrounding narrative'
    ],
    'breaking_fourth_wall': [
      'Directly addresses the reader from within the narrative',
      'Acknowledges the artifice of storytelling',
      'Creates meta-awareness of narrative construction'
    ],
    
    // Figurative language
    'metaphor': [
      'Compares two unlike things without using "like" or "as"',
      'Creates deeper meaning through implicit comparison',
      'Transforms abstract concepts into concrete images'
    ],
    'simile': [
      'Explicitly compares two different things using "like" or "as"',
      'Creates vivid imagery through comparison',
      'Makes abstract ideas more relatable through familiar references'
    ],
    'personification': [
      'Attributes human qualities to non-human entities',
      'Brings inanimate objects to life through human characteristics',
      'Creates connection between reader and environment'
    ],
    'hyperbole': [
      'Uses extreme exaggeration for emphasis or humor',
      'Overstates to create dramatic effect',
      'Emphasizes emotional intensity through overstatement'
    ],
    'irony': [
      'Creates contrast between expectation and reality',
      'Says one thing while meaning another',
      'Presents situations where outcomes contradict expectations'
    ],
    'symbol': [
      'Uses concrete objects to represent abstract ideas',
      'Creates deeper layers of meaning through representation',
      'Condenses complex concepts into recognizable images'
    ],
    'allegory': [
      'Tells a story with symbolic meaning parallel to the surface narrative',
      'Uses characters and events to represent abstract concepts',
      'Creates a narrative with dual meanings'
    ],
    'allusion': [
      'References external works, events, or figures',
      'Creates connections to cultural or historical touchpoints',
      'Adds depth through external references'
    ],
    'juxtaposition': [
      'Places contrasting elements side by side for effect',
      'Highlights differences through proximity',
      'Creates tension through opposing ideas or images'
    ],
    'motif': [
      'Repeats elements throughout the narrative for thematic emphasis',
      'Uses recurring symbols or ideas to reinforce meaning',
      'Creates patterns that highlight important themes'
    ],
    'alliteration': [
      'Repeats initial consonant sounds in nearby words',
      'Creates rhythm through sound patterns',
      'Emphasizes specific words through sound repetition'
    ],
    'assonance': [
      'Repeats vowel sounds in nearby words',
      'Creates internal rhyme through vowel repetition',
      'Establishes mood through sound patterns'
    ],
    'consonance': [
      'Repeats consonant sounds within or at the end of words',
      'Creates subtle sound patterns through consonant repetition',
      'Builds rhythm through repeated sounds'
    ],
    'onomatopoeia': [
      'Uses words that phonetically imitate the sounds they describe',
      'Creates sensory experience through sound words',
      'Makes descriptions more vivid through sound mimicry'
    ],
    
    // Structure devices
    'parallel_plot': [
      'Develops multiple storylines simultaneously',
      'Creates thematic resonance through story comparison',
      'Builds complexity through narrative layering'
    ],
    'frame_story': [
      'Embeds stories within an overarching narrative',
      'Uses nested narratives to create meaning',
      'Provides context through story containment'
    ],
    'vignette': [
      'Presents brief, evocative scenes that build to create meaning',
      'Uses snapshot-like moments to develop theme or character',
      'Creates impressionistic effect through scene collection'
    ],
    'in_medias_res': [
      'Begins the story in the middle of action',
      'Creates immediate engagement through narrative immersion',
      'Establishes tension by delaying exposition'
    ],
    'exposition': [
      'Introduces necessary background information',
      'Establishes context for character and plot development',
      'Provides foundation for narrative understanding'
    ],
    'rising_action': [
      'Builds tension through escalating complications',
      'Increases stakes as the narrative progresses',
      'Creates momentum toward climactic moments'
    ],
    'climax': [
      'Presents the moment of highest tension or conflict',
      'Creates emotional peak in the narrative',
      'Brings central conflicts to a head'
    ],
    'falling_action': [
      'Shows consequences following the climactic moment',
      'Begins resolution of central conflicts',
      'Transitions toward narrative conclusion'
    ],
    'resolution': [
      'Resolves the story\'s central conflicts',
      'Provides answers to narrative questions',
      'Creates satisfaction through problem resolution'
    ],
    'denouement': [
      'Ties up loose ends after main conflicts are resolved',
      'Shows new equilibrium following narrative events',
      'Provides closure to character arcs and storylines'
    ],
    
    // Other
    'other': [
      'Employs unique or combined literary techniques',
      'Creates effects through innovative language use',
      'Develops original approaches to narrative or language'
    ]
  };
  
  const impactDescriptions = [
    'Enhances the emotional resonance of the scene',
    'Deepens character development',
    'Reinforces the central theme of the chapter',
    'Creates foreshadowing for later events',
    'Establishes mood and atmosphere',
    'Provides insight into character motivation',
    'Highlights the conflict at the heart of the story',
    'Creates memorable imagery that lingers with the reader',
    'Adds layers of meaning to the narrative',
    'Connects this moment to broader themes in the work',
    'Builds tension and suspense',
    'Reveals character relationships and dynamics',
    'Emphasizes important plot developments',
    'Creates contrast that highlights key ideas',
    'Establishes the story\'s unique voice and style'
  ];
  
  const excerptStarters = [
    'The wind whispered through the trees',
    'Her eyes reflected the distant stars',
    'Time seemed to stand still',
    'The silence spoke volumes',
    'Memories flooded back like a tidal wave',
    'The truth dawned on him slowly',
    'Shadows danced across the wall',
    'The city breathed like a living creature',
    'Words hung in the air between them',
    'The past and present collided',
    'His heart raced as he realized',
    'The room felt smaller than before',
    'She stood at the threshold, hesitating',
    'The landscape stretched endlessly before them',
    'Voices echoed from the distant hallway',
    'The letter trembled in his hands',
    'Rain pounded against the windows',
    'The decision weighed heavily on her mind',
    'Their paths crossed unexpectedly',
    'The revelation changed everything'
  ];
  
  // Ensure we have at least one device from each category
  const categoryKeys = Object.keys(deviceCategories) as LiteraryDeviceCategory[];
  
  // First, create one device for each category
  for (const category of categoryKeys) {
    const availableTypes = [...deviceCategories[category]];
    const typeIndex = Math.floor(Math.random() * availableTypes.length);
    const deviceType = availableTypes[typeIndex];
    
    // Create the device
    createDevice(category, deviceType);
  }
  
  // Then fill in the rest randomly
  const remainingDevices = deviceCount - categoryKeys.length;
  for (let i = 0; i < remainingDevices; i++) {
    const categoryIndex = Math.floor(Math.random() * categoryKeys.length);
    const category = categoryKeys[categoryIndex];
    const availableTypes = [...deviceCategories[category]];
    
    // Remove types we've already used for this category
    const usedTypes = devices
      .filter(d => d.category === category)
      .map(d => d.type);
    
    const unusedTypes = availableTypes.filter(type => !usedTypes.includes(type));
    
    // If we've used all types in this category, pick another category
    if (unusedTypes.length === 0) {
      i--; // Try again
      continue;
    }
    
    const typeIndex = Math.floor(Math.random() * unusedTypes.length);
    const deviceType = unusedTypes[typeIndex];
    
    // Create the device
    createDevice(category, deviceType);
  }
  
  // Helper function to create a device
  function createDevice(category: LiteraryDeviceCategory, deviceType: LiteraryDeviceType) {
    // Get descriptions for this device type
    const descriptions = deviceDescriptions[deviceType];
    const description = descriptions[Math.floor(Math.random() * descriptions.length)];
    
    // Generate an excerpt
    const excerptStarter = excerptStarters[Math.floor(Math.random() * excerptStarters.length)];
    const excerpt = `"${excerptStarter}..." (from Chapter ${chapter.title})`;
    
    // Select an impact
    const impact = impactDescriptions[Math.floor(Math.random() * impactDescriptions.length)];
    
    // Determine if we should include characters, settings, or events
    // based on the device category
    let involvedCharacters: string[] = [];
    let involvedSettings: string[] = [];
    let involvedEvents: string[] = [];
    
    if (category === 'character' && characters.length > 0) {
      // Character devices should involve characters
      const characterCount = 1 + Math.floor(Math.random() * Math.min(2, characters.length));
      const charactersCopy = [...characters];
      
      for (let j = 0; j < characterCount; j++) {
        const randomIndex = Math.floor(Math.random() * charactersCopy.length);
        involvedCharacters.push(charactersCopy[randomIndex].id);
        charactersCopy.splice(randomIndex, 1);
      }
    } else if (category === 'setting' && settings.length > 0) {
      // Setting devices should involve settings
      const settingCount = 1 + Math.floor(Math.random() * Math.min(2, settings.length));
      const settingsCopy = [...settings];
      
      for (let j = 0; j < settingCount; j++) {
        const randomIndex = Math.floor(Math.random() * settingsCopy.length);
        involvedSettings.push(settingsCopy[randomIndex].id);
        settingsCopy.splice(randomIndex, 1);
      }
    } else if (category === 'plot' && events.length > 0) {
      // Plot devices might involve events
      const eventCount = 1 + Math.floor(Math.random() * Math.min(2, events.length));
      const eventsCopy = [...events];
      
      for (let j = 0; j < eventCount; j++) {
        const randomIndex = Math.floor(Math.random() * eventsCopy.length);
        involvedEvents.push(eventsCopy[randomIndex].id);
        eventsCopy.splice(randomIndex, 1);
      }
    } else if (Math.random() > 0.5 && characters.length > 0) {
      // Other devices might involve characters
      const characterCount = 1 + Math.floor(Math.random() * Math.min(2, characters.length));
      const charactersCopy = [...characters];
      
      for (let j = 0; j < characterCount; j++) {
        const randomIndex = Math.floor(Math.random() * charactersCopy.length);
        involvedCharacters.push(charactersCopy[randomIndex].id);
        charactersCopy.splice(randomIndex, 1);
      }
    }
    
    // Create the device
    devices.push({
      id: uuidv4(),
      category,
      type: deviceType,
      description,
      excerpt,
      pageIndex: chapter.pageIndex + Math.floor(Math.random() * 3), // Random page within chapter
      impact,
      characters: involvedCharacters.length > 0 ? involvedCharacters : undefined,
      settings: involvedSettings.length > 0 ? involvedSettings : undefined,
      events: involvedEvents.length > 0 ? involvedEvents : undefined
    });
  }
  
  const result: LiteraryDeviceAnalysisResult = {
    chapterId: chapter.id,
    chapterTitle: chapter.title,
    devices
  };
  
  return {
    success: true,
    content: result
  };
};

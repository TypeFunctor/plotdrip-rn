import { Book, KnowledgeGraphTriplet, Character, Event, Setting, Relationship } from '../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Extracts knowledge graph triplets from book content
 * In a real implementation, this would use NLP techniques or an API
 * This is a simplified mock implementation
 */
export const extractTriplets = (book: Book, pageIndex: number, content: string): KnowledgeGraphTriplet[] => {
  // This is a mock implementation
  // In a real app, this would use NLP or an external API
  const triplets: KnowledgeGraphTriplet[] = [];
  
  // Simple regex-based extraction for demonstration
  // Character detection (names with capital letters)
  const characterRegex = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g;
  const characters = [...content.matchAll(characterRegex)].map(match => match[0]);
  
  // Action detection (verbs)
  const actionRegex = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s+((?:is|was|has|had|went|said|spoke|thought|felt|saw|heard|walked|ran|jumped|moved|looked|appeared|seemed|became|made)\b)/gi;
  const actions = [...content.matchAll(actionRegex)];
  
  // Create triplets from detected patterns
  actions.forEach(match => {
    const subject = match[1];
    const predicate = match[2].toLowerCase();
    
    // Find what comes after the verb (simplified)
    const restOfSentence = content.substring(match.index! + match[0].length);
    const objectMatch = restOfSentence.match(/\b([a-zA-Z]+(?:\s[a-zA-Z]+){0,5})\b/);
    const object = objectMatch ? objectMatch[0] : '';
    
    if (subject && predicate && object) {
      triplets.push({
        subject,
        predicate,
        object,
        confidence: 0.7, // Mock confidence score
        sourcePageIndex: pageIndex
      });
    }
  });
  
  return triplets;
};

/**
 * Updates the book's knowledge graph data based on extracted triplets
 */
export const updateBookKnowledgeGraph = (book: Book, triplets: KnowledgeGraphTriplet[]): Book => {
  const updatedBook = { ...book };
  
  // Initialize arrays if they don't exist
  if (!updatedBook.characters) updatedBook.characters = [];
  if (!updatedBook.events) updatedBook.events = [];
  if (!updatedBook.settings) updatedBook.settings = [];
  if (!updatedBook.relationships) updatedBook.relationships = [];
  
  // Process triplets to update knowledge graph
  triplets.forEach(triplet => {
    // Character extraction
    if (
      triplet.predicate.includes('is') || 
      triplet.predicate.includes('was') ||
      triplet.predicate.includes('has') ||
      triplet.predicate.includes('had')
    ) {
      // Check if character already exists
      const existingCharacter = updatedBook.characters!.find(
        c => c.name.toLowerCase() === triplet.subject.toLowerCase()
      );
      
      if (!existingCharacter && isLikelyCharacter(triplet.subject)) {
        // Add new character
        updatedBook.characters!.push({
          id: uuidv4(),
          name: triplet.subject,
          description: `${triplet.subject} ${triplet.predicate} ${triplet.object}`,
          traits: [triplet.object],
          firstAppearance: triplet.sourcePageIndex
        });
      } else if (existingCharacter) {
        // Update existing character
        if (!existingCharacter.traits) existingCharacter.traits = [];
        if (!existingCharacter.traits.includes(triplet.object)) {
          existingCharacter.traits.push(triplet.object);
        }
        
        // Update description if it doesn't exist
        if (!existingCharacter.description) {
          existingCharacter.description = `${triplet.subject} ${triplet.predicate} ${triplet.object}`;
        }
      }
    }
    
    // Event extraction
    if (
      triplet.predicate.includes('went') ||
      triplet.predicate.includes('ran') ||
      triplet.predicate.includes('jumped') ||
      triplet.predicate.includes('moved') ||
      triplet.predicate.includes('appeared')
    ) {
      // Create a new event
      const eventTitle = `${triplet.subject} ${triplet.predicate} ${triplet.object}`;
      
      // Check if event already exists
      const existingEvent = updatedBook.events!.find(e => e.title === eventTitle);
      
      if (!existingEvent) {
        // Find character ID
        const character = updatedBook.characters!.find(
          c => c.name.toLowerCase() === triplet.subject.toLowerCase()
        );
        
        // Find or create setting
        let settingId = '';
        const existingSetting = updatedBook.settings!.find(
          s => s.name.toLowerCase() === triplet.object.toLowerCase()
        );
        
        if (existingSetting) {
          settingId = existingSetting.id;
        } else if (isLikelySetting(triplet.object)) {
          const newSetting = {
            id: uuidv4(),
            name: triplet.object,
            description: `Location where ${triplet.subject} ${triplet.predicate}`,
            firstAppearance: triplet.sourcePageIndex
          };
          updatedBook.settings!.push(newSetting);
          settingId = newSetting.id;
        }
        
        // Add new event
        const newEvent = {
          id: uuidv4(),
          title: eventTitle,
          description: `${triplet.subject} ${triplet.predicate} ${triplet.object}`,
          pageIndex: triplet.sourcePageIndex,
          characters: character ? [character.id] : [],
          setting: settingId,
          importance: 'minor' as const
        };
        
        updatedBook.events!.push(newEvent);
        
        // Update setting with event reference
        if (settingId) {
          const setting = updatedBook.settings!.find(s => s.id === settingId);
          if (setting) {
            if (!setting.events) setting.events = [];
            setting.events.push(newEvent.id);
          }
        }
      }
    }
    
    // Relationship extraction
    if (
      triplet.predicate.includes('spoke') ||
      triplet.predicate.includes('said') ||
      triplet.predicate.includes('saw')
    ) {
      // Find characters
      const character1 = updatedBook.characters!.find(
        c => c.name.toLowerCase() === triplet.subject.toLowerCase()
      );
      
      const character2 = updatedBook.characters!.find(
        c => c.name.toLowerCase() === triplet.object.toLowerCase()
      );
      
      if (character1 && character2 && character1.id !== character2.id) {
        // Check if relationship already exists
        const existingRelationship = updatedBook.relationships!.find(r => 
          r.characters.includes(character1.id) && 
          r.characters.includes(character2.id)
        );
        
        if (!existingRelationship) {
          // Create new relationship
          const newRelationship = {
            id: uuidv4(),
            type: 'other' as const,
            description: `${character1.name} ${triplet.predicate} ${character2.name}`,
            characters: [character1.id, character2.id],
            firstMentioned: triplet.sourcePageIndex
          };
          
          updatedBook.relationships!.push(newRelationship);
          
          // Update character relationships
          if (!character1.relationships) character1.relationships = [];
          if (!character2.relationships) character2.relationships = [];
          
          character1.relationships.push(newRelationship.id);
          character2.relationships.push(newRelationship.id);
        }
      }
    }
  });
  
  return updatedBook;
};

// Helper functions
function isLikelyCharacter(name: string): boolean {
  // Simple heuristic: characters usually have capitalized names
  return /^[A-Z]/.test(name) && name.length > 1;
}

function isLikelySetting(name: string): boolean {
  // Simple heuristic: settings are often places
  const settingWords = [
    'house', 'room', 'garden', 'park', 'street', 'city', 'town', 'village',
    'castle', 'palace', 'forest', 'mountain', 'river', 'lake', 'ocean', 'sea',
    'school', 'university', 'hospital', 'restaurant', 'cafe', 'shop', 'store'
  ];
  
  return settingWords.some(word => name.toLowerCase().includes(word));
}

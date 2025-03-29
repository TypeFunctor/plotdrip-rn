import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Book, Character, Event, Setting, Relationship, PlotSuggestion, BranchSuggestion } from '../types';
import { sendLLMRequest } from '../utils/llmService';
import { v4 as uuidv4 } from 'uuid';
import KnowledgeGraphViewer from './KnowledgeGraphViewer';

interface NovelPlannerProps {
  book: Book;
  onSave: (updatedBook: Book) => void;
  onCancel: () => void;
}

const NovelPlanner: React.FC<NovelPlannerProps> = ({ book, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'events' | 'settings' | 'relationships' | 'branches' | 'graph'>('overview');
  const [editedBook, setEditedBook] = useState<Book>({ ...book });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plotSuggestions, setPlotSuggestions] = useState<PlotSuggestion[]>([]);
  const [branchSuggestions, setBranchSuggestions] = useState<Record<string, BranchSuggestion[]>>({});
  
  // Form states for adding new entities
  const [newCharacter, setNewCharacter] = useState<Partial<Character>>({ name: '' });
  const [newEvent, setNewEvent] = useState<Partial<Event>>({ title: '' });
  const [newSetting, setNewSetting] = useState<Partial<Setting>>({ name: '' });
  const [newRelationship, setNewRelationship] = useState<Partial<Relationship>>({ 
    type: 'other', 
    characters: [] 
  });
  
  // State for showing forms
  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showSettingForm, setShowSettingForm] = useState(false);
  const [showRelationshipForm, setShowRelationshipForm] = useState(false);
  
  // Initialize book for planning if needed
  useEffect(() => {
    if (!editedBook.isPlanning) {
      setEditedBook(prev => ({
        ...prev,
        isPlanning: true,
        characters: prev.characters || [],
        events: prev.events || [],
        settings: prev.settings || [],
        relationships: prev.relationships || [],
        branches: prev.branches || []
      }));
    }
  }, []);
  
  // Get plot suggestions when characters or settings change
  useEffect(() => {
    if (editedBook.characters?.length && editedBook.settings?.length) {
      getPlotSuggestions();
    }
  }, [editedBook.characters, editedBook.settings]);
  
  const getPlotSuggestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await sendLLMRequest({
        type: 'plot_suggestion',
        book: editedBook
      });
      
      if (response.success) {
        setPlotSuggestions(prev => [response.content, ...prev].slice(0, 3));
      } else {
        setError(response.error || 'Failed to get plot suggestions');
      }
    } catch (err) {
      setError('An error occurred while getting plot suggestions');
    } finally {
      setIsLoading(false);
    }
  };
  
  const getBranchSuggestions = async (eventId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await sendLLMRequest({
        type: 'branch_suggestion',
        book: editedBook,
        context: eventId
      });
      
      if (response.success) {
        setBranchSuggestions(prev => ({
          ...prev,
          [eventId]: [...(prev[eventId] || []), response.content].slice(0, 3)
        }));
      } else {
        setError(response.error || 'Failed to get branch suggestions');
      }
    } catch (err) {
      setError('An error occurred while getting branch suggestions');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddCharacter = () => {
    if (!newCharacter.name) return;
    
    const character: Character = {
      id: uuidv4(),
      name: newCharacter.name,
      description: newCharacter.description || '',
      traits: [],
      relationships: []
    };
    
    setEditedBook(prev => ({
      ...prev,
      characters: [...(prev.characters || []), character]
    }));
    
    setNewCharacter({ name: '' });
    setShowCharacterForm(false);
  };
  
  const handleAddEvent = () => {
    if (!newEvent.title) return;
    
    const event: Event = {
      id: uuidv4(),
      title: newEvent.title,
      description: newEvent.description || '',
      importance: newEvent.importance || 'minor',
      characters: [],
      branchPoint: newEvent.branchPoint || false
    };
    
    setEditedBook(prev => ({
      ...prev,
      events: [...(prev.events || []), event]
    }));
    
    setNewEvent({ title: '' });
    setShowEventForm(false);
  };
  
  const handleAddSetting = () => {
    if (!newSetting.name) return;
    
    const setting: Setting = {
      id: uuidv4(),
      name: newSetting.name,
      description: newSetting.description || '',
      atmosphere: newSetting.atmosphere || '',
      timeperiod: newSetting.timeperiod || '',
      events: []
    };
    
    setEditedBook(prev => ({
      ...prev,
      settings: [...(prev.settings || []), setting]
    }));
    
    setNewSetting({ name: '' });
    setShowSettingForm(false);
  };
  
  const handleAddRelationship = () => {
    if (newRelationship.characters?.length !== 2) return;
    
    const relationship: Relationship = {
      id: uuidv4(),
      type: newRelationship.type || 'other',
      description: newRelationship.description || '',
      characters: newRelationship.characters as string[],
      dynamics: newRelationship.dynamics || '',
      evolution: newRelationship.evolution || 'stable'
    };
    
    setEditedBook(prev => ({
      ...prev,
      relationships: [...(prev.relationships || []), relationship]
    }));
    
    setNewRelationship({ type: 'other', characters: [] });
    setShowRelationshipForm(false);
  };
  
  const handleDeleteCharacter = (id: string) => {
    setEditedBook(prev => ({
      ...prev,
      characters: prev.characters?.filter(c => c.id !== id) || []
    }));
  };
  
  const handleDeleteEvent = (id: string) => {
    setEditedBook(prev => ({
      ...prev,
      events: prev.events?.filter(e => e.id !== id) || []
    }));
  };
  
  const handleDeleteSetting = (id: string) => {
    setEditedBook(prev => ({
      ...prev,
      settings: prev.settings?.filter(s => s.id !== id) || []
    }));
  };
  
  const handleDeleteRelationship = (id: string) => {
    setEditedBook(prev => ({
      ...prev,
      relationships: prev.relationships?.filter(r => r.id !== id) || []
    }));
  };
  
  const handleApplyPlotSuggestion = (suggestion: PlotSuggestion) => {
    // Create events from the suggestion
    const newEvents = suggestion.events.map(eventData => ({
      id: uuidv4(),
      title: eventData.title || 'Untitled Event',
      description: eventData.description || '',
      importance: eventData.importance || 'minor',
      characters: [],
      branchPoint: Math.random() > 0.7 // 30% chance of being a branch point
    }));
    
    setEditedBook(prev => ({
      ...prev,
      events: [...(prev.events || []), ...newEvents]
    }));
  };
  
  const handleCreateBranch = (suggestion: BranchSuggestion) => {
    const event = editedBook.events?.find(e => e.id === suggestion.branchPointEventId);
    if (!event) return;
    
    // Find the page index of the event
    const pageIndex = event.pageIndex || 0;
    
    // Create new events for the branch
    const branchEvents = suggestion.events.map(eventData => ({
      id: uuidv4(),
      title: eventData.title || 'Untitled Event',
      description: eventData.description || '',
      importance: eventData.importance || 'minor',
      characters: [],
      branchPoint: false
    }));
    
    // Create the branch
    const branch = {
      id: uuidv4(),
      name: suggestion.name,
      description: suggestion.description,
      branchPointEventId: event.id,
      branchPointPageIndex: pageIndex,
      content: ['This is the beginning of the branch...'],
      events: branchEvents,
      isActive: false
    };
    
    setEditedBook(prev => ({
      ...prev,
      branches: [...(prev.branches || []), branch]
    }));
  };
  
  const handleSave = () => {
    onSave(editedBook);
  };
  
  const renderOverview = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Novel Planning Overview</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{editedBook.characters?.length || 0}</Text>
          <Text style={styles.statLabel}>Characters</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{editedBook.events?.length || 0}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{editedBook.settings?.length || 0}</Text>
          <Text style={styles.statLabel}>Settings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{editedBook.relationships?.length || 0}</Text>
          <Text style={styles.statLabel}>Relationships</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plot Suggestions</Text>
        {isLoading && (
          <Text style={styles.loadingText}>Loading suggestions...</Text>
        )}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
        {plotSuggestions.length > 0 ? (
          plotSuggestions.map((suggestion, index) => (
            <View key={index} style={styles.suggestionCard}>
              <Text style={styles.suggestionTitle}>{suggestion.title}</Text>
              <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
              
              <View style={styles.suggestionSection}>
                <Text style={styles.suggestionSectionTitle}>Key Events:</Text>
                {suggestion.events.map((event, eventIndex) => (
                  <Text key={eventIndex} style={styles.suggestionItem}>
                    • {event.title} ({event.importance})
                  </Text>
                ))}
              </View>
              
              <View style={styles.suggestionSection}>
                <Text style={styles.suggestionSectionTitle}>Themes:</Text>
                {suggestion.themes.map((theme, themeIndex) => (
                  <Text key={themeIndex} style={styles.suggestionItem}>• {theme}</Text>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.applyButton} 
                onPress={() => handleApplyPlotSuggestion(suggestion)}
              >
                <Text style={styles.applyButtonText}>Apply This Plot</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No plot suggestions yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Add characters and settings to generate plot suggestions
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={getPlotSuggestions}
              disabled={!editedBook.characters?.length || !editedBook.settings?.length}
            >
              <Text style={styles.refreshButtonText}>Generate Suggestions</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Getting Started</Text>
        <Text style={styles.instructionText}>
          1. Add characters, settings, and relationships in their respective tabs
        </Text>
        <Text style={styles.instructionText}>
          2. Review plot suggestions and apply one that interests you
        </Text>
        <Text style={styles.instructionText}>
          3. Customize events and explore potential story branches
        </Text>
        <Text style={styles.instructionText}>
          4. Save your plan to start writing your novel
        </Text>
      </View>
    </View>
  );
  
  const renderCharacters = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Characters</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowCharacterForm(!showCharacterForm)}
        >
          <Text style={styles.addButtonText}>{showCharacterForm ? 'Cancel' : 'Add Character'}</Text>
        </TouchableOpacity>
      </View>
      
      {showCharacterForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Character Name"
            value={newCharacter.name}
            onChangeText={(text) => setNewCharacter(prev => ({ ...prev, name: text }))}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Character Description"
            multiline
            numberOfLines={3}
            value={newCharacter.description}
            onChangeText={(text) => setNewCharacter(prev => ({ ...prev, description: text }))}
          />
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleAddCharacter}
            disabled={!newCharacter.name}
          >
            <Text style={styles.submitButtonText}>Add Character</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {editedBook.characters && editedBook.characters.length > 0 ? (
        editedBook.characters.map(character => (
          <View key={character.id} style={styles.entityCard}>
            <View style={styles.entityHeader}>
              <View style={styles.entityImagePlaceholder}>
                <Text style={styles.entityImagePlaceholderText}>{character.name[0]}</Text>
              </View>
              <View style={styles.entityHeaderText}>
                <Text style={styles.entityName}>{character.name}</Text>
                {character.arc && (
                  <Text style={styles.entityMeta}>Character Arc: {character.arc}</Text>
                )}
              </View>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleDeleteCharacter(character.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            {character.description && (
              <Text style={styles.entityDescription}>{character.description}</Text>
            )}
            
            {character.traits && character.traits.length > 0 && (
              <View style={styles.tagContainer}>
                {character.traits.map((trait, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{trait}</Text>
                  </View>
                ))}
              </View>
            )}
            
            {character.goals && character.goals.length > 0 && (
              <View style={styles.entitySection}>
                <Text style={styles.entitySectionTitle}>Goals:</Text>
                {character.goals.map((goal, index) => (
                  <Text key={index} style={styles.entitySectionItem}>• {goal}</Text>
                ))}
              </View>
            )}
            
            {character.conflicts && character.conflicts.length > 0 && (
              <View style={styles.entitySection}>
                <Text style={styles.entitySectionTitle}>Conflicts:</Text>
                {character.conflicts.map((conflict, index) => (
                  <Text key={index} style={styles.entitySectionItem}>• {conflict}</Text>
                ))}
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.developButton} 
              onPress={async () => {
                setIsLoading(true);
                try {
                  const response = await sendLLMRequest({
                    type: 'character_development',
                    book: editedBook,
                    context: character.id
                  });
                  
                  if (response.success) {
                    setEditedBook(prev => ({
                      ...prev,
                      characters: prev.characters?.map(c => 
                        c.id === character.id ? response.content : c
                      ) || []
                    }));
                  } else {
                    setError(response.error || 'Failed to develop character');
                  }
                } catch (err) {
                  setError('An error occurred while developing character');
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              <Text style={styles.developButtonText}>Develop Character</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No characters yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add characters to start building your story
          </Text>
        </View>
      )}
    </View>
  );
  
  const renderEvents = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Events</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowEventForm(!showEventForm)}
        >
          <Text style={styles.addButtonText}>{showEventForm ? 'Cancel' : 'Add Event'}</Text>
        </TouchableOpacity>
      </View>
      
      {showEventForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Event Title"
            value={newEvent.title}
            onChangeText={(text) => setNewEvent(prev => ({ ...prev, title: text }))}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Event Description"
            multiline
            numberOfLines={3}
            value={newEvent.description}
            onChangeText={(text) => setNewEvent(prev => ({ ...prev, description: text }))}
          />
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Importance:</Text>
            <View style={styles.formOptions}>
              <TouchableOpacity 
                style={[
                  styles.formOption, 
                  newEvent.importance === 'minor' && styles.formOptionSelected
                ]}
                onPress={() => setNewEvent(prev => ({ ...prev, importance: 'minor' }))}
              >
                <Text style={styles.formOptionText}>Minor</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.formOption, 
                  newEvent.importance === 'major' && styles.formOptionSelected
                ]}
                onPress={() => setNewEvent(prev => ({ ...prev, importance: 'major' }))}
              >
                <Text style={styles.formOptionText}>Major</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.formOption, 
                  newEvent.importance === 'pivotal' && styles.formOptionSelected
                ]}
                onPress={() => setNewEvent(prev => ({ ...prev, importance: 'pivotal' }))}
              >
                <Text style={styles.formOptionText}>Pivotal</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Branch Point:</Text>
            <View style={styles.formOptions}>
              <TouchableOpacity 
                style={[
                  styles.formOption, 
                  newEvent.branchPoint === true && styles.formOptionSelected
                ]}
                onPress={() => setNewEvent(prev => ({ ...prev, branchPoint: true }))}
              >
                <Text style={styles.formOptionText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.formOption, 
                  newEvent.branchPoint === false && styles.formOptionSelected
                ]}
                onPress={() => setNewEvent(prev => ({ ...prev, branchPoint: false }))}
              >
                <Text style={styles.formOptionText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleAddEvent}
            disabled={!newEvent.title}
          >
            <Text style={styles.submitButtonText}>Add Event</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {editedBook.events && editedBook.events.length > 0 ? (
        editedBook.events.map(event => (
          <View key={event.id} style={styles.entityCard}>
            <View style={styles.entityHeader}>
              <View style={[
                styles.eventImportanceIndicator, 
                event.importance === 'pivotal' ? styles.pivotalEvent : 
                event.importance === 'major' ? styles.majorEvent : 
                styles.minorEvent
              ]} />
              <View style={styles.entityHeaderText}>
                <Text style={styles.entityName}>{event.title}</Text>
                <View style={styles.eventMetaContainer}>
                  {event.branchPoint && (
                    <View style={styles.branchPointBadge}>
                      <Text style={styles.branchPointText}>Branch Point</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleDeleteEvent(event.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            {event.description && (
              <Text style={styles.entityDescription}>{event.description}</Text>
            )}
            
            {event.characters && event.characters.length > 0 && (
              <View style={styles.entitySection}>
                <Text style={styles.entitySectionTitle}>Characters Involved:</Text>
                <Text style={styles.entitySectionItem}>
                  {event.characters.map(charId => {
                    const character = editedBook.characters?.find(c => c.id === charId);
                    return character ? character.name : 'Unknown';
                  }).join(', ')}
                </Text>
              </View>
            )}
            
            {event.setting && (
              <View style={styles.entitySection}>
                <Text style={styles.entitySectionTitle}>Setting:</Text>
                <Text style={styles.entitySectionItem}>
                  {editedBook.settings?.find(s => s.id === event.setting)?.name || 'Unknown'}
                </Text>
              </View>
            )}
            
            {event.branchPoint && (
              <View style={styles.branchSuggestions}>
                <View style={styles.branchSuggestionsHeader}>
                  <Text style={styles.branchSuggestionsTitle}>Branch Suggestions</Text>
                  <TouchableOpacity 
                    style={styles.refreshButton} 
                    onPress={() => getBranchSuggestions(event.id)}
                  >
                    <Text style={styles.refreshButtonText}>Get Suggestions</Text>
                  </TouchableOpacity>
                </View>
                
                {branchSuggestions[event.id] && branchSuggestions[event.id].length > 0 ? (
                  branchSuggestions[event.id].map((suggestion, index) => (
                    <View key={index} style={styles.branchSuggestionCard}>
                      <Text style={styles.branchSuggestionTitle}>{suggestion.name}</Text>
                      <Text style={styles.branchSuggestionDescription}>{suggestion.description}</Text>
                      <Text style={styles.branchSuggestionConsequences}>{suggestion.consequences}</Text>
                      
                      <TouchableOpacity 
                        style={styles.createBranchButton} 
                        onPress={() => handleCreateBranch(suggestion)}
                      >
                        <Text style={styles.createBranchButtonText}>Create Branch</Text>
                      </TouchableOpacity>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noBranchSuggestions}>
                    Click "Get Suggestions" to generate branch ideas
                  </Text>
                )}
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No events yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add events to build your story's plot
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={async () => {
              setIsLoading(true);
              try {
                const response = await sendLLMRequest({
                  type: 'event_creation',
                  book: editedBook
                });
                
                if (response.success) {
                  setEditedBook(prev => ({
                    ...prev,
                    events: [...(prev.events || []), response.content]
                  }));
                } else {
                  setError(response.error || 'Failed to create event');
                }
              } catch (err) {
                setError('An error occurred while creating event');
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={!editedBook.characters?.length}
          >
            <Text style={styles.refreshButtonText}>Generate Event</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
  const renderSettings = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowSettingForm(!showSettingForm)}
        >
          <Text style={styles.addButtonText}>{showSettingForm ? 'Cancel' : 'Add Setting'}</Text>
        </TouchableOpacity>
      </View>
      
      {showSettingForm && (
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Setting Name"
            value={newSetting.name}
            onChangeText={(text) => setNewSetting(prev => ({ ...prev, name: text }))}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Setting Description"
            multiline
            numberOfLines={3}
            value={newSetting.description}
            onChangeText={(text) => setNewSetting(prev => ({ ...prev, description: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Atmosphere (e.g., gloomy, cheerful, tense)"
            value={newSetting.atmosphere}
            onChangeText={(text) => setNewSetting(prev => ({ ...prev, atmosphere: text }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Time Period (e.g., medieval, modern, future)"
            value={newSetting.timeperiod}
            onChangeText={(text) => setNewSetting(prev => ({ ...prev, timeperiod: text }))}
          />
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleAddSetting}
            disabled={!newSetting.name}
          >
            <Text style={styles.submitButtonText}>Add Setting</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {editedBook.settings && editedBook.settings.length > 0 ? (
        editedBook.settings.map(setting => (
          <View key={setting.id} style={styles.entityCard}>
            <View style={styles.entityHeader}>
              <View style={styles.entityImagePlaceholder}>
                <Text style={styles.entityImagePlaceholderText}>{setting.name[0]}</Text>
              </View>
              <View style={styles.entityHeaderText}>
                <Text style={styles.entityName}>{setting.name}</Text>
                {setting.timeperiod && (
                  <Text style={styles.entityMeta}>{setting.timeperiod}</Text>
                )}
              </View>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleDeleteSetting(setting.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            {setting.description && (
              <Text style={styles.entityDescription}>{setting.description}</Text>
            )}
            
            {setting.atmosphere && (
              <View style={styles.entitySection}>
                <Text style={styles.entitySectionTitle}>Atmosphere:</Text>
                <Text style={styles.entitySectionItem}>{setting.atmosphere}</Text>
              </View>
            )}
            
            {setting.events && setting.events.length > 0 && (
              <View style={styles.entitySection}>
                <Text style={styles.entitySectionTitle}>Events that occur here:</Text>
                <Text style={styles.entitySectionItem}>
                  {setting.events.map(eventId => {
                    const event = editedBook.events?.find(e => e.id === eventId);
                    return event ? event.title : 'Unknown';
                  }).join(', ')}
                </Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No settings yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add settings to establish your story's world
          </Text>
        </View>
      )}
    </View>
  );
  
  const renderRelationships = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Relationships</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setShowRelationshipForm(!showRelationshipForm)}
        >
          <Text style={styles.addButtonText}>{showRelationshipForm ? 'Cancel' : 'Add Relationship'}</Text>
        </TouchableOpacity>
      </View>
      
      {showRelationshipForm && (
        <View style={styles.formContainer}>
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Type:</Text>
            <View style={styles.formOptions}>
              {['family', 'friend', 'enemy', 'romantic', 'professional', 'other'].map(type => (
                <TouchableOpacity 
                  key={type}
                  style={[
                    styles.formOption, 
                    newRelationship.type === type && styles.formOptionSelected
                  ]}
                  onPress={() => setNewRelationship(prev => ({ ...prev, type: type as any }))}
                >
                  <Text style={styles.formOptionText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Characters:</Text>
            <View style={styles.characterSelection}>
              {editedBook.characters?.map(character => (
                <TouchableOpacity 
                  key={character.id}
                  style={[
                    styles.characterOption,
                    newRelationship.characters?.includes(character.id) && styles.characterOptionSelected
                  ]}
                  onPress={() => {
                    setNewRelationship(prev => {
                      const characters = [...(prev.characters || [])];
                      const index = characters.indexOf(character.id);
                      
                      if (index === -1) {
                        // Add character if not already selected (max 2)
                        if (characters.length < 2) {
                          characters.push(character.id);
                        }
                      } else {
                        // Remove character if already selected
                        characters.splice(index, 1);
                      }
                      
                      return { ...prev, characters };
                    });
                  }}
                >
                  <Text style={styles.characterOptionText}>{character.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Relationship Description"
            multiline
            numberOfLines={3}
            value={newRelationship.description}
            onChangeText={(text) => setNewRelationship(prev => ({ ...prev, description: text }))}
          />
          
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Evolution:</Text>
            <View style={styles.formOptions}>
              {['improving', 'deteriorating', 'stable', 'complex'].map(evolution => (
                <TouchableOpacity 
                  key={evolution}
                  style={[
                    styles.formOption, 
                    newRelationship.evolution === evolution && styles.formOptionSelected
                  ]}
                  onPress={() => setNewRelationship(prev => ({ ...prev, evolution: evolution as any }))}
                >
                  <Text style={styles.formOptionText}>{evolution}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleAddRelationship}
            disabled={!newRelationship.characters || newRelationship.characters.length !== 2}
          >
            <Text style={styles.submitButtonText}>Add Relationship</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {editedBook.relationships && editedBook.relationships.length > 0 ? (
        editedBook.relationships.map(relationship => (
          <View key={relationship.id} style={styles.entityCard}>
            <View style={styles.relationshipHeader}>
              <View style={styles.relationshipType}>
                <Text style={styles.relationshipTypeText}>{relationship.type}</Text>
              </View>
              <Text style={styles.entityName}>
                {relationship.characters.map(charId => {
                  const character = editedBook.characters?.find(c => c.id === charId);
                  return character ? character.name : 'Unknown';
                }).join(' & ')}
              </Text>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleDeleteRelationship(relationship.id)}
              >
                <Text style={styles.deleteButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            
            {relationship.description && (
              <Text style={styles.entityDescription}>{relationship.description}</Text>
            )}
            
            {relationship.evolution && (
              <View style={styles.entitySection}>
                <Text style={styles.entitySectionTitle}>Evolution:</Text>
                <Text style={styles.entitySectionItem}>{relationship.evolution}</Text>
              </View>
            )}
            
            {relationship.dynamics && (
              <View style={styles.entitySection}>
                <Text style={styles.entitySectionTitle}>Dynamics:</Text>
                <Text style={styles.entitySectionItem}>{relationship.dynamics}</Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No relationships yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add relationships to define character connections
          </Text>
        </View>
      )}
    </View>
  );
  
  const renderBranches = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Story Branches</Text>
      
      {editedBook.branches && editedBook.branches.length > 0 ? (
        editedBook.branches.map(branch => (
          <View key={branch.id} style={styles.branchCard}>
            <View style={styles.branchHeader}>
              <Text style={styles.branchName}>{branch.name}</Text>
              <Text style={styles.branchDescription}>{branch.description}</Text>
            </View>
            
            <View style={styles.branchDetails}>
              <Text style={styles.branchDetailLabel}>Branch Point:</Text>
              <Text style={styles.branchDetailText}>
                {editedBook.events?.find(e => e.id === branch.branchPointEventId)?.title || 'Unknown Event'}
              </Text>
            </View>
            
            {branch.events && branch.events.length > 0 && (
              <View style={styles.branchEvents}>
                <Text style={styles.branchEventsTitle}>Events in this Branch:</Text>
                {branch.events.map((event, index) => (
                  <View key={index} style={styles.branchEvent}>
                    <Text style={styles.branchEventTitle}>{event.title}</Text>
                    {event.description && (
                      <Text style={styles.branchEventDescription}>{event.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
            
            <TouchableOpacity 
              style={styles.viewBranchButton} 
              onPress={() => {
                // In a real implementation, this would navigate to a branch editor
                console.log('View branch:', branch.id);
              }}
            >
              <Text style={styles.viewBranchButtonText}>View Branch</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No branches yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Create branches from events marked as branch points
          </Text>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Branching</Text>
        <Text style={styles.instructionText}>
          Branches allow you to explore alternative storylines from key decision points.
        </Text>
        <Text style={styles.instructionText}>
          To create a branch:
        </Text>
        <Text style={styles.instructionText}>
          1. Mark an event as a branch point in the Events tab
        </Text>
        <Text style={styles.instructionText}>
          2. Get branch suggestions for that event
        </Text>
        <Text style={styles.instructionText}>
          3. Create a branch from a suggestion you like
        </Text>
        <Text style={styles.instructionText}>
          4. Develop the branch with its own events and content
        </Text>
      </View>
    </View>
  );
  
  const renderGraph = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Knowledge Graph</Text>
      
      {(editedBook.characters?.length || 0) > 0 || 
       (editedBook.events?.length || 0) > 0 || 
       (editedBook.settings?.length || 0) > 0 ? (
        <View style={styles.graphContainer}>
          <KnowledgeGraphViewer book={editedBook} height={500} />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No graph data available yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add characters, events, settings, and relationships to visualize your story's structure
          </Text>
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Graph Legend</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#3498db' }]} />
          <Text style={styles.legendText}>Book (Central Node)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#e74c3c' }]} />
          <Text style={styles.legendText}>Characters</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f39c12' }]} />
          <Text style={styles.legendText}>Events</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#2ecc71' }]} />
          <Text style={styles.legendText}>Settings</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#9b59b6' }]} />
          <Text style={styles.legendText}>Character-Event Connections</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Graph Interactions</Text>
        <Text style={styles.instructionText}>• Click and drag nodes to rearrange the graph</Text>
        <Text style={styles.instructionText}>• Scroll to zoom in and out</Text>
        <Text style={styles.instructionText}>• Hover over nodes and edges to see details</Text>
        <Text style={styles.instructionText}>• Click on a node to focus on it and its connections</Text>
      </View>
    </View>
  );
  
  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]} 
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'characters' && styles.activeTab]} 
          onPress={() => setActiveTab('characters')}
        >
          <Text style={[styles.tabText, activeTab === 'characters' && styles.activeTabText]}>Characters</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'events' && styles.activeTab]} 
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]} 
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'relationships' && styles.activeTab]} 
          onPress={() => setActiveTab('relationships')}
        >
          <Text style={[styles.tabText, activeTab === 'relationships' && styles.activeTabText]}>Relationships</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'branches' && styles.activeTab]} 
          onPress={() => setActiveTab('branches')}
        >
          <Text style={[styles.tabText, activeTab === 'branches' && styles.activeTabText]}>Branches</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'graph' && styles.activeTab]} 
          onPress={() => setActiveTab('graph')}
        >
          <Text style={[styles.tabText, activeTab === 'graph' && styles.activeTabText]}>Graph</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'characters' && renderCharacters()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'relationships' && renderRelationships()}
        {activeTab === 'branches' && renderBranches()}
        {activeTab === 'graph' && renderGraph()}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.footerButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.footerButtonText}>Save Plan</Text>
        </TouchableOpacity>
      </View>
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingOverlayText}>Processing...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexWrap: 'wrap',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formRow: {
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  formOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  formOption: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  formOptionSelected: {
    backgroundColor: '#3498db',
  },
  formOptionText: {
    color: '#333',
  },
  characterSelection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  characterOption: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  characterOptionSelected: {
    backgroundColor: '#3498db',
  },
  characterOptionText: {
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
    marginVertical: 16,
  },
  suggestionCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  suggestionSection: {
    marginBottom: 12,
  },
  suggestionSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  suggestionItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  applyButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  entityCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  entityHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  entityImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  entityImagePlaceholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  entityHeaderText: {
    flex: 1,
    justifyContent: 'center',
  },
  entityName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  entityMeta: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  entityDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 2,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  entitySection: {
    marginTop: 8,
  },
  entitySectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  entitySectionItem: {
    fontSize: 14,
    color: '#333',
  },
  developButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  developButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  eventImportanceIndicator: {
    width: 8,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  pivotalEvent: {
    backgroundColor: '#e74c3c',
  },
  majorEvent: {
    backgroundColor: '#f39c12',
  },
  minorEvent: {
    backgroundColor: '#3498db',
  },
  eventMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  branchPointBadge: {
    backgroundColor: '#9b59b6',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  branchPointText: {
    fontSize: 10,
    color: 'white',
  },
  branchSuggestions: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  branchSuggestionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  branchSuggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  branchSuggestionCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#9b59b6',
  },
  branchSuggestionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  branchSuggestionDescription: {
    fontSize: 13,
    color: '#333',
    marginBottom: 8,
  },
  branchSuggestionConsequences: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  createBranchButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-end',
  },
  createBranchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  noBranchSuggestions: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  relationshipHeader: {
    marginBottom: 8,
  },
  relationshipType: {
    alignSelf: 'flex-start',
    backgroundColor: '#3498db',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  relationshipTypeText: {
    fontSize: 12,
    color: 'white',
    textTransform: 'capitalize',
  },
  branchCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#9b59b6',
  },
  branchHeader: {
    marginBottom: 12,
  },
  branchName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  branchDescription: {
    fontSize: 14,
    color: '#333',
  },
  branchDetails: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  branchDetailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 8,
  },
  branchDetailText: {
    fontSize: 14,
    color: '#333',
  },
  branchEvents: {
    marginTop: 12,
  },
  branchEventsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  branchEvent: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  branchEventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  branchEventDescription: {
    fontSize: 13,
    color: '#666',
  },
  viewBranchButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 12,
  },
  viewBranchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    borderRadius: 4,
    marginRight: 8,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2ecc71',
    paddingVertical: 10,
    borderRadius: 4,
    marginLeft: 8,
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlayText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  graphContainer: {
    height: 500,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
});

export default NovelPlanner;

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Book, Chapter, Character, Event, Setting, Relationship } from '../types';
import KnowledgeGraphViewer from './KnowledgeGraphViewer';

interface KnowledgeBaseProps {
  book: Book;
  onBackToBookInfo: () => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ book, onBackToBookInfo }) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'characters' | 'events' | 'settings' | 'relationships'>('graph');
  const [activeChapter, setActiveChapter] = useState<string | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get chapters for filtering
  const chapters = book.chapters || [];
  
  // Filter function based on chapter and search query
  const filterByChapterAndSearch = <T extends { name?: string; title?: string; chapterId?: string }>(
    items: T[] | undefined,
    getSearchText: (item: T) => string = (item) => item.name || item.title || ''
  ): T[] => {
    if (!items) return [];
    
    return items.filter(item => {
      // Filter by chapter
      const passesChapterFilter = activeChapter === 'all' || item.chapterId === activeChapter;
      
      // Filter by search
      const searchText = getSearchText(item).toLowerCase();
      const passesSearchFilter = !searchQuery || searchText.includes(searchQuery.toLowerCase());
      
      return passesChapterFilter && passesSearchFilter;
    });
  };
  
  // Get chapter title by ID
  const getChapterTitle = (chapterId?: string): string => {
    if (!chapterId) return 'Unknown Chapter';
    const chapter = chapters.find(c => c.id === chapterId);
    return chapter ? chapter.title : 'Unknown Chapter';
  };
  
  // Get character name by ID
  const getCharacterName = (characterId: string): string => {
    const character = book.characters?.find(c => c.id === characterId);
    return character ? character.name : 'Unknown Character';
  };
  
  // Get setting name by ID
  const getSettingName = (settingId: string): string => {
    const setting = book.settings?.find(s => s.id === settingId);
    return setting ? setting.name : 'Unknown Setting';
  };
  
  // Render the knowledge graph view
  const renderGraph = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Story Knowledge Graph</Text>
      <Text style={styles.sectionDescription}>
        Visualizing the relationships between characters, events, and settings across chapters.
      </Text>
      
      <View style={styles.graphOptions}>
        <TouchableOpacity 
          style={[styles.graphOption, styles.graphOptionSelected]} 
          onPress={() => {/* Toggle option */}}
        >
          <Text style={styles.graphOptionText}>Show Chapter Progression</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.graphContainer}>
        <KnowledgeGraphViewer 
          book={book} 
          height={500} 
          showChapterProgression={true}
        />
      </View>
      
      <View style={styles.graphLegend}>
        <Text style={styles.legendTitle}>Graph Legend</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#34495e' }]} />
            <Text style={styles.legendText}>Chapters</Text>
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
            <Text style={styles.legendText}>Relationships</Text>
          </View>
        </View>
      </View>
    </View>
  );
  
  // Render the characters view
  const renderCharacters = () => {
    const filteredCharacters = filterByChapterAndSearch(book.characters, char => char.name);
    
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Characters</Text>
        
        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search characters..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chapterFilter}>
            <TouchableOpacity 
              style={[
                styles.chapterFilterItem, 
                activeChapter === 'all' && styles.activeChapterFilterItem
              ]} 
              onPress={() => setActiveChapter('all')}
            >
              <Text style={[
                styles.chapterFilterText,
                activeChapter === 'all' && styles.activeChapterFilterText
              ]}>All Chapters</Text>
            </TouchableOpacity>
            
            {chapters.map(chapter => (
              <TouchableOpacity 
                key={chapter.id}
                style={[
                  styles.chapterFilterItem, 
                  activeChapter === chapter.id && styles.activeChapterFilterItem
                ]} 
                onPress={() => setActiveChapter(chapter.id)}
              >
                <Text style={[
                  styles.chapterFilterText,
                  activeChapter === chapter.id && styles.activeChapterFilterText
                ]}>{chapter.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {filteredCharacters.length > 0 ? (
          filteredCharacters.map(character => (
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
              </View>
              
              {character.chapterId && (
                <View style={styles.chapterBadge}>
                  <Text style={styles.chapterBadgeText}>
                    First appears in: {getChapterTitle(character.chapterId)}
                  </Text>
                </View>
              )}
              
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
              
              {character.chapterProgression && character.chapterProgression.length > 0 && (
                <View style={styles.entitySection}>
                  <Text style={styles.entitySectionTitle}>Chapter Progression:</Text>
                  <View style={styles.progressionContainer}>
                    {character.chapterProgression.map((chapterId, index) => (
                      <View key={chapterId} style={styles.progressionItem}>
                        <Text style={styles.progressionNumber}>{index + 1}</Text>
                        <Text style={styles.progressionText}>{getChapterTitle(chapterId)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No characters found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term or chapter filter.' : 'This book doesn\'t have any characters defined.'}
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  // Render the events view
  const renderEvents = () => {
    const filteredEvents = filterByChapterAndSearch(book.events, event => event.title);
    
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Events</Text>
        
        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search events..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chapterFilter}>
            <TouchableOpacity 
              style={[
                styles.chapterFilterItem, 
                activeChapter === 'all' && styles.activeChapterFilterItem
              ]} 
              onPress={() => setActiveChapter('all')}
            >
              <Text style={[
                styles.chapterFilterText,
                activeChapter === 'all' && styles.activeChapterFilterText
              ]}>All Chapters</Text>
            </TouchableOpacity>
            
            {chapters.map(chapter => (
              <TouchableOpacity 
                key={chapter.id}
                style={[
                  styles.chapterFilterItem, 
                  activeChapter === chapter.id && styles.activeChapterFilterItem
                ]} 
                onPress={() => setActiveChapter(chapter.id)}
              >
                <Text style={[
                  styles.chapterFilterText,
                  activeChapter === chapter.id && styles.activeChapterFilterText
                ]}>{chapter.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
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
              </View>
              
              {event.chapterId && (
                <View style={styles.chapterBadge}>
                  <Text style={styles.chapterBadgeText}>
                    Occurs in: {getChapterTitle(event.chapterId)}
                  </Text>
                </View>
              )}
              
              {event.description && (
                <Text style={styles.entityDescription}>{event.description}</Text>
              )}
              
              {event.characters && event.characters.length > 0 && (
                <View style={styles.entitySection}>
                  <Text style={styles.entitySectionTitle}>Characters Involved:</Text>
                  <Text style={styles.entitySectionItem}>
                    {event.characters.map(getCharacterName).join(', ')}
                  </Text>
                </View>
              )}
              
              {event.setting && (
                <View style={styles.entitySection}>
                  <Text style={styles.entitySectionTitle}>Setting:</Text>
                  <Text style={styles.entitySectionItem}>
                    {getSettingName(event.setting)}
                  </Text>
                </View>
              )}
              
              {event.causes && event.causes.length > 0 && (
                <View style={styles.entitySection}>
                  <Text style={styles.entitySectionTitle}>Caused By:</Text>
                  <Text style={styles.entitySectionItem}>
                    {event.causes.map(causeId => {
                      const causeEvent = book.events?.find(e => e.id === causeId);
                      return causeEvent ? causeEvent.title : 'Unknown Event';
                    }).join(', ')}
                  </Text>
                </View>
              )}
              
              {event.consequences && event.consequences.length > 0 && (
                <View style={styles.entitySection}>
                  <Text style={styles.entitySectionTitle}>Leads To:</Text>
                  <Text style={styles.entitySectionItem}>
                    {event.consequences.map(consequenceId => {
                      const consequenceEvent = book.events?.find(e => e.id === consequenceId);
                      return consequenceEvent ? consequenceEvent.title : 'Unknown Event';
                    }).join(', ')}
                  </Text>
                </View>
              )}
              
              {event.chapterPosition !== undefined && (
                <Text style={styles.chapterPosition}>
                  Position in chapter: {event.chapterPosition}
                </Text>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No events found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term or chapter filter.' : 'This book doesn\'t have any events defined.'}
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  // Render the settings view
  const renderSettings = () => {
    const filteredSettings = filterByChapterAndSearch(book.settings, setting => setting.name);
    
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search settings..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chapterFilter}>
            <TouchableOpacity 
              style={[
                styles.chapterFilterItem, 
                activeChapter === 'all' && styles.activeChapterFilterItem
              ]} 
              onPress={() => setActiveChapter('all')}
            >
              <Text style={[
                styles.chapterFilterText,
                activeChapter === 'all' && styles.activeChapterFilterText
              ]}>All Chapters</Text>
            </TouchableOpacity>
            
            {chapters.map(chapter => (
              <TouchableOpacity 
                key={chapter.id}
                style={[
                  styles.chapterFilterItem, 
                  activeChapter === chapter.id && styles.activeChapterFilterItem
                ]} 
                onPress={() => setActiveChapter(chapter.id)}
              >
                <Text style={[
                  styles.chapterFilterText,
                  activeChapter === chapter.id && styles.activeChapterFilterText
                ]}>{chapter.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {filteredSettings.length > 0 ? (
          filteredSettings.map(setting => (
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
              </View>
              
              {setting.chapterId && (
                <View style={styles.chapterBadge}>
                  <Text style={styles.chapterBadgeText}>
                    First appears in: {getChapterTitle(setting.chapterId)}
                  </Text>
                </View>
              )}
              
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
                      const event = book.events?.find(e => e.id === eventId);
                      return event ? event.title : 'Unknown Event';
                    }).join(', ')}
                  </Text>
                </View>
              )}
              
              {setting.chapterProgression && setting.chapterProgression.length > 0 && (
                <View style={styles.entitySection}>
                  <Text style={styles.entitySectionTitle}>Chapter Progression:</Text>
                  <View style={styles.progressionContainer}>
                    {setting.chapterProgression.map((chapterId, index) => (
                      <View key={chapterId} style={styles.progressionItem}>
                        <Text style={styles.progressionNumber}>{index + 1}</Text>
                        <Text style={styles.progressionText}>{getChapterTitle(chapterId)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No settings found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term or chapter filter.' : 'This book doesn\'t have any settings defined.'}
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  // Render the relationships view
  const renderRelationships = () => {
    const filteredRelationships = filterByChapterAndSearch(
      book.relationships,
      rel => {
        const char1 = book.characters?.find(c => c.id === rel.characters[0]);
        const char2 = rel.characters.length > 1 ? book.characters?.find(c => c.id === rel.characters[1]) : null;
        return `${char1?.name || ''} ${char2?.name || ''} ${rel.type}`;
      }
    );
    
    return (
      <View style={styles.tabContent}>
        <Text style={styles.sectionTitle}>Relationships</Text>
        
        <View style={styles.filterContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search relationships..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chapterFilter}>
            <TouchableOpacity 
              style={[
                styles.chapterFilterItem, 
                activeChapter === 'all' && styles.activeChapterFilterItem
              ]} 
              onPress={() => setActiveChapter('all')}
            >
              <Text style={[
                styles.chapterFilterText,
                activeChapter === 'all' && styles.activeChapterFilterText
              ]}>All Chapters</Text>
            </TouchableOpacity>
            
            {chapters.map(chapter => (
              <TouchableOpacity 
                key={chapter.id}
                style={[
                  styles.chapterFilterItem, 
                  activeChapter === chapter.id && styles.activeChapterFilterItem
                ]} 
                onPress={() => setActiveChapter(chapter.id)}
              >
                <Text style={[
                  styles.chapterFilterText,
                  activeChapter === chapter.id && styles.activeChapterFilterText
                ]}>{chapter.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {filteredRelationships.length > 0 ? (
          filteredRelationships.map(relationship => (
            <View key={relationship.id} style={styles.entityCard}>
              <View style={styles.relationshipHeader}>
                <View style={styles.relationshipType}>
                  <Text style={styles.relationshipTypeText}>{relationship.type}</Text>
                </View>
                <Text style={styles.entityName}>
                  {relationship.characters.map(getCharacterName).join(' & ')}
                </Text>
              </View>
              
              {relationship.chapterId && (
                <View style={styles.chapterBadge}>
                  <Text style={styles.chapterBadgeText}>
                    First appears in: {getChapterTitle(relationship.chapterId)}
                  </Text>
                </View>
              )}
              
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
              
              {relationship.chapterProgression && relationship.chapterProgression.length > 0 && (
                <View style={styles.entitySection}>
                  <Text style={styles.entitySectionTitle}>Chapter Progression:</Text>
                  <View style={styles.progressionContainer}>
                    {relationship.chapterProgression.map((chapterId, index) => (
                      <View key={chapterId} style={styles.progressionItem}>
                        <Text style={styles.progressionNumber}>{index + 1}</Text>
                        <Text style={styles.progressionText}>{getChapterTitle(chapterId)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No relationships found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try a different search term or chapter filter.' : 'This book doesn\'t have any relationships defined.'}
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Knowledge Base: {book.title}</Text>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'graph' && styles.activeTab]} 
          onPress={() => setActiveTab('graph')}
        >
          <Text style={[styles.tabText, activeTab === 'graph' && styles.activeTabText]}>Graph</Text>
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
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'graph' && renderGraph()}
        {activeTab === 'characters' && renderCharacters()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'relationships' && renderRelationships()}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={onBackToBookInfo}>
          <Text style={styles.footerButtonText}>Back to Book Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  graphOptions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  graphOption: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  graphOptionSelected: {
    backgroundColor: '#3498db',
  },
  graphOptionText: {
    color: 'white',
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
  graphLegend: {
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
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
    minWidth: 100,
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
  filterContainer: {
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
  },
  chapterFilter: {
    marginBottom: 8,
  },
  chapterFilterItem: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  activeChapterFilterItem: {
    backgroundColor: '#3498db',
  },
  chapterFilterText: {
    fontSize: 14,
    color: '#666',
  },
  activeChapterFilterText: {
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
  chapterBadge: {
    backgroundColor: '#34495e',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  chapterBadgeText: {
    color: 'white',
    fontSize: 12,
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
    marginBottom: 8,
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
  progressionContainer: {
    marginTop: 4,
  },
  progressionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3498db',
    color: 'white',
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressionText: {
    fontSize: 14,
    color: '#333',
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
  chapterPosition: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
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
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white',
  },
  footerButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default KnowledgeBase;

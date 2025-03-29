import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Book, Character, Event, Setting, Relationship } from '../types';
import KnowledgeGraphViewer from './KnowledgeGraphViewer';

interface BookInfoProps {
  book: Book;
  onSelectChapters: () => void;
  onBackToLibrary: () => void;
}

const BookInfo: React.FC<BookInfoProps> = ({ book, onSelectChapters, onBackToLibrary }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'events' | 'settings' | 'relationships'>('overview');
  
  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.bookHeader}>
        {book.coverUrl ? (
          <Image source={{ uri: book.coverUrl }} style={styles.coverImage} />
        ) : (
          <View style={styles.placeholderCover}>
            <Text style={styles.placeholderText}>{book.title[0]}</Text>
          </View>
        )}
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>
          <Text style={styles.bookFormat}>{book.format.toUpperCase()}</Text>
          <Text style={styles.bookStats}>
            {book.chapters?.length || 0} chapters • {book.content.length} pages
          </Text>
          <TouchableOpacity style={styles.readButton} onPress={onSelectChapters}>
            <Text style={styles.readButtonText}>Read Book</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{book.characters?.length || 0}</Text>
          <Text style={styles.statLabel}>Characters</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{book.events?.length || 0}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{book.settings?.length || 0}</Text>
          <Text style={styles.statLabel}>Settings</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{book.relationships?.length || 0}</Text>
          <Text style={styles.statLabel}>Relationships</Text>
        </View>
      </View>
      
      <View style={styles.knowledgeGraphPreview}>
        <Text style={styles.sectionTitle}>Knowledge Graph</Text>
        {book.characters && book.characters.length > 0 ? (
          <KnowledgeGraphViewer book={book} height={400} />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No knowledge graph data available yet.</Text>
            <Text style={styles.emptyStateSubtext}>Knowledge graph data will be extracted as you read and annotate the book.</Text>
          </View>
        )}
      </View>
    </View>
  );
  
  const renderCharacters = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Characters</Text>
      {book.characters && book.characters.length > 0 ? (
        book.characters.map(character => (
          <View key={character.id} style={styles.entityCard}>
            <View style={styles.entityHeader}>
              {character.imageUrl ? (
                <Image source={{ uri: character.imageUrl }} style={styles.entityImage} />
              ) : (
                <View style={styles.entityImagePlaceholder}>
                  <Text style={styles.entityImagePlaceholderText}>{character.name[0]}</Text>
                </View>
              )}
              <View style={styles.entityHeaderText}>
                <Text style={styles.entityName}>{character.name}</Text>
                {character.firstAppearance !== undefined && (
                  <Text style={styles.entityMeta}>First appearance: Page {character.firstAppearance + 1}</Text>
                )}
              </View>
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
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No character data available yet.</Text>
          <Text style={styles.emptyStateSubtext}>Character information will be extracted as you read and annotate the book.</Text>
        </View>
      )}
    </View>
  );
  
  const renderEvents = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Events</Text>
      {book.events && book.events.length > 0 ? (
        book.events.map(event => (
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
                {event.pageIndex !== undefined && (
                  <Text style={styles.entityMeta}>Page {event.pageIndex + 1}</Text>
                )}
              </View>
            </View>
            {event.description && (
              <Text style={styles.entityDescription}>{event.description}</Text>
            )}
            {event.characters && event.characters.length > 0 && (
              <View style={styles.eventMeta}>
                <Text style={styles.eventMetaLabel}>Characters involved:</Text>
                <Text style={styles.eventMetaText}>
                  {event.characters.map(charId => {
                    const character = book.characters?.find(c => c.id === charId);
                    return character ? character.name : 'Unknown';
                  }).join(', ')}
                </Text>
              </View>
            )}
            {event.setting && (
              <View style={styles.eventMeta}>
                <Text style={styles.eventMetaLabel}>Setting:</Text>
                <Text style={styles.eventMetaText}>
                  {book.settings?.find(s => s.id === event.setting)?.name || 'Unknown'}
                </Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No event data available yet.</Text>
          <Text style={styles.emptyStateSubtext}>Event information will be extracted as you read and annotate the book.</Text>
        </View>
      )}
    </View>
  );
  
  const renderSettings = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Settings</Text>
      {book.settings && book.settings.length > 0 ? (
        book.settings.map(setting => (
          <View key={setting.id} style={styles.entityCard}>
            <View style={styles.entityHeader}>
              {setting.imageUrl ? (
                <Image source={{ uri: setting.imageUrl }} style={styles.entityImage} />
              ) : (
                <View style={styles.entityImagePlaceholder}>
                  <Text style={styles.entityImagePlaceholderText}>{setting.name[0]}</Text>
                </View>
              )}
              <View style={styles.entityHeaderText}>
                <Text style={styles.entityName}>{setting.name}</Text>
                {setting.firstAppearance !== undefined && (
                  <Text style={styles.entityMeta}>First appearance: Page {setting.firstAppearance + 1}</Text>
                )}
              </View>
            </View>
            {setting.description && (
              <Text style={styles.entityDescription}>{setting.description}</Text>
            )}
            {setting.events && setting.events.length > 0 && (
              <View style={styles.settingMeta}>
                <Text style={styles.settingMetaLabel}>Events that occur here:</Text>
                <Text style={styles.settingMetaText}>
                  {setting.events.map(eventId => {
                    const event = book.events?.find(e => e.id === eventId);
                    return event ? event.title : 'Unknown';
                  }).join(', ')}
                </Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No setting data available yet.</Text>
          <Text style={styles.emptyStateSubtext}>Setting information will be extracted as you read and annotate the book.</Text>
        </View>
      )}
    </View>
  );
  
  const renderRelationships = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Relationships</Text>
      {book.relationships && book.relationships.length > 0 ? (
        book.relationships.map(relationship => (
          <View key={relationship.id} style={styles.entityCard}>
            <View style={styles.relationshipHeader}>
              <View style={styles.relationshipType}>
                <Text style={styles.relationshipTypeText}>{relationship.type}</Text>
              </View>
              <Text style={styles.entityName}>
                {relationship.characters.map(charId => {
                  const character = book.characters?.find(c => c.id === charId);
                  return character ? character.name : 'Unknown';
                }).join(' & ')}
              </Text>
              {relationship.firstMentioned !== undefined && (
                <Text style={styles.entityMeta}>First mentioned: Page {relationship.firstMentioned + 1}</Text>
              )}
            </View>
            {relationship.description && (
              <Text style={styles.entityDescription}>{relationship.description}</Text>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No relationship data available yet.</Text>
          <Text style={styles.emptyStateSubtext}>Relationship information will be extracted as you read and annotate the book.</Text>
        </View>
      )}
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
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'characters' && renderCharacters()}
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'relationships' && renderRelationships()}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={onBackToLibrary}>
          <Text style={styles.footerButtonText}>Back to Library</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton} onPress={onSelectChapters}>
          <Text style={styles.footerButtonText}>View Chapters</Text>
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
  bookHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  coverImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  placeholderCover: {
    width: 120,
    height: 180,
    borderRadius: 8,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  bookDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  bookFormat: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  bookStats: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  readButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  readButtonText: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  knowledgeGraphPreview: {
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
  entityImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
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
  entityDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  eventMeta: {
    marginTop: 4,
  },
  eventMetaLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  eventMetaText: {
    fontSize: 14,
    color: '#333',
  },
  settingMeta: {
    marginTop: 4,
  },
  settingMetaLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  settingMetaText: {
    fontSize: 14,
    color: '#333',
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
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  footerButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 4,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BookInfo;

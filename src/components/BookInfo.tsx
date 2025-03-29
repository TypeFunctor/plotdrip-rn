import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Book } from '../types';
import KnowledgeGraphViewer from './KnowledgeGraphViewer';

interface BookInfoProps {
  book: Book;
  onSelectChapters: () => void;
  onBackToLibrary: () => void;
  onViewLiteraryDevices?: () => void;
}

const BookInfo: React.FC<BookInfoProps> = ({ 
  book, 
  onSelectChapters, 
  onBackToLibrary,
  onViewLiteraryDevices
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'characters' | 'plot' | 'knowledge'>('overview');
  
  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.coverContainer}>
        {book.coverUrl ? (
          <Image source={{ uri: book.coverUrl }} style={styles.coverImage} />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text style={styles.coverPlaceholderText}>{book.title[0]}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>
        
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Format</Text>
            <Text style={styles.metaValue}>{book.format.toUpperCase()}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Pages</Text>
            <Text style={styles.metaValue}>{book.content.length}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Chapters</Text>
            <Text style={styles.metaValue}>{book.chapters?.length || 0}</Text>
          </View>
        </View>
        
        {book.isEditable && (
          <View style={styles.editableBadge}>
            <Text style={styles.editableBadgeText}>Editable</Text>
          </View>
        )}
        
        {book.isPlanning && (
          <View style={[styles.editableBadge, styles.planningBadge]}>
            <Text style={styles.editableBadgeText}>Planning</Text>
          </View>
        )}
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
          <Text style={styles.statNumber}>
            {book.literaryDevices?.reduce((total, chapter) => total + chapter.devices.length, 0) || 0}
          </Text>
          <Text style={styles.statLabel}>Literary Devices</Text>
        </View>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={onSelectChapters}
        >
          <Text style={styles.actionButtonText}>View Chapters</Text>
        </TouchableOpacity>
        
        {onViewLiteraryDevices && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={onViewLiteraryDevices}
          >
            <Text style={styles.actionButtonText}>Literary Devices</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
  
  const renderCharacters = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Characters</Text>
      
      {book.characters && book.characters.length > 0 ? (
        book.characters.map(character => (
          <View key={character.id} style={styles.characterCard}>
            <View style={styles.characterHeader}>
              <View style={styles.characterImagePlaceholder}>
                <Text style={styles.characterImagePlaceholderText}>{character.name[0]}</Text>
              </View>
              <View style={styles.characterHeaderText}>
                <Text style={styles.characterName}>{character.name}</Text>
                {character.arc && (
                  <Text style={styles.characterMeta}>Character Arc: {character.arc}</Text>
                )}
              </View>
            </View>
            
            {character.description && (
              <Text style={styles.characterDescription}>{character.description}</Text>
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
              <View style={styles.characterSection}>
                <Text style={styles.characterSectionTitle}>Goals:</Text>
                {character.goals.map((goal, index) => (
                  <Text key={index} style={styles.characterSectionItem}>• {goal}</Text>
                ))}
              </View>
            )}
            
            {character.conflicts && character.conflicts.length > 0 && (
              <View style={styles.characterSection}>
                <Text style={styles.characterSectionTitle}>Conflicts:</Text>
                {character.conflicts.map((conflict, index) => (
                  <Text key={index} style={styles.characterSectionItem}>• {conflict}</Text>
                ))}
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No characters defined</Text>
          <Text style={styles.emptyStateSubtext}>
            This book doesn't have any character information yet.
          </Text>
        </View>
      )}
    </View>
  );
  
  const renderPlot = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Plot Elements</Text>
      
      {book.events && book.events.length > 0 ? (
        <View>
          <Text style={styles.subsectionTitle}>Events</Text>
          {book.events.map(event => (
            <View key={event.id} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <View style={[
                  styles.eventImportanceIndicator, 
                  event.importance === 'pivotal' ? styles.pivotalEvent : 
                  event.importance === 'major' ? styles.majorEvent : 
                  styles.minorEvent
                ]} />
                <View style={styles.eventHeaderText}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventMetaContainer}>
                    {event.branchPoint && (
                      <View style={styles.branchPointBadge}>
                        <Text style={styles.branchPointText}>Branch Point</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              
              {event.description && (
                <Text style={styles.eventDescription}>{event.description}</Text>
              )}
              
              {event.characters && event.characters.length > 0 && (
                <View style={styles.eventSection}>
                  <Text style={styles.eventSectionTitle}>Characters Involved:</Text>
                  <Text style={styles.eventSectionItem}>
                    {event.characters.map(charId => {
                      const character = book.characters?.find(c => c.id === charId);
                      return character ? character.name : 'Unknown';
                    }).join(', ')}
                  </Text>
                </View>
              )}
              
              {event.setting && (
                <View style={styles.eventSection}>
                  <Text style={styles.eventSectionTitle}>Setting:</Text>
                  <Text style={styles.eventSectionItem}>
                    {book.settings?.find(s => s.id === event.setting)?.name || 'Unknown'}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No plot elements defined</Text>
          <Text style={styles.emptyStateSubtext}>
            This book doesn't have any plot information yet.
          </Text>
        </View>
      )}
      
      {book.settings && book.settings.length > 0 && (
        <View style={styles.settingsContainer}>
          <Text style={styles.subsectionTitle}>Settings</Text>
          {book.settings.map(setting => (
            <View key={setting.id} style={styles.settingCard}>
              <Text style={styles.settingName}>{setting.name}</Text>
              {setting.description && (
                <Text style={styles.settingDescription}>{setting.description}</Text>
              )}
              {setting.atmosphere && (
                <Text style={styles.settingAtmosphere}>Atmosphere: {setting.atmosphere}</Text>
              )}
              {setting.timeperiod && (
                <Text style={styles.settingTimePeriod}>Time Period: {setting.timeperiod}</Text>
              )}
            </View>
          ))}
        </View>
      )}
      
      {book.branches && book.branches.length > 0 && (
        <View style={styles.branchesContainer}>
          <Text style={styles.subsectionTitle}>Story Branches</Text>
          {book.branches.map(branch => (
            <View key={branch.id} style={styles.branchCard}>
              <Text style={styles.branchName}>{branch.name}</Text>
              {branch.description && (
                <Text style={styles.branchDescription}>{branch.description}</Text>
              )}
              <View style={styles.branchDetails}>
                <Text style={styles.branchDetailLabel}>Branch Point:</Text>
                <Text style={styles.branchDetailText}>
                  {book.events?.find(e => e.id === branch.branchPointEventId)?.title || 'Unknown Event'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
  
  const renderKnowledgeGraph = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Knowledge Graph</Text>
      
      {book.knowledgeGraph && 
       (book.knowledgeGraph.nodes.length > 0 || 
        book.characters?.length || 
        book.events?.length || 
        book.settings?.length) ? (
        <View style={styles.graphContainer}>
          <KnowledgeGraphViewer book={book} height={400} />
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No knowledge graph available</Text>
          <Text style={styles.emptyStateSubtext}>
            This book doesn't have knowledge graph data yet.
          </Text>
        </View>
      )}
      
      {book.knowledgeGraph && book.knowledgeGraph.triplets && book.knowledgeGraph.triplets.length > 0 && (
        <View style={styles.tripletsContainer}>
          <Text style={styles.subsectionTitle}>Knowledge Triplets</Text>
          {book.knowledgeGraph.triplets.slice(0, 10).map((triplet, index) => (
            <View key={index} style={styles.tripletItem}>
              <Text style={styles.tripletText}>
                <Text style={styles.tripletSubject}>{triplet.subject}</Text>
                {' '}
                <Text style={styles.tripletPredicate}>{triplet.predicate}</Text>
                {' '}
                <Text style={styles.tripletObject}>{triplet.object}</Text>
              </Text>
              <Text style={styles.tripletConfidence}>
                Confidence: {Math.round(triplet.confidence * 100)}%
              </Text>
            </View>
          ))}
          {book.knowledgeGraph.triplets.length > 10 && (
            <Text style={styles.moreTriplets}>
              + {book.knowledgeGraph.triplets.length - 10} more triplets
            </Text>
          )}
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
          style={[styles.tab, activeTab === 'plot' && styles.activeTab]} 
          onPress={() => setActiveTab('plot')}
        >
          <Text style={[styles.tabText, activeTab === 'plot' && styles.activeTabText]}>Plot</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'knowledge' && styles.activeTab]} 
          onPress={() => setActiveTab('knowledge')}
        >
          <Text style={[styles.tabText, activeTab === 'knowledge' && styles.activeTabText]}>Knowledge Graph</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'characters' && renderCharacters()}
        {activeTab === 'plot' && renderPlot()}
        {activeTab === 'knowledge' && renderKnowledgeGraph()}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={onBackToLibrary}>
          <Text style={styles.footerButtonText}>Back to Library</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
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
  coverContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  coverImage: {
    width: 150,
    height: 225,
    borderRadius: 8,
  },
  coverPlaceholder: {
    width: 150,
    height: 225,
    borderRadius: 8,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverPlaceholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editableBadge: {
    backgroundColor: '#2ecc71',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  planningBadge: {
    backgroundColor: '#9b59b6',
  },
  editableBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  statsContainer: {
    flexDirection: 'row',
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  characterCard: {
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
  characterHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  characterImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  characterImagePlaceholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  characterHeaderText: {
    flex: 1,
    justifyContent: 'center',
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  characterMeta: {
    fontSize: 12,
    color: '#999',
  },
  characterDescription: {
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
  characterSection: {
    marginTop: 8,
  },
  characterSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  characterSectionItem: {
    fontSize: 14,
    color: '#333',
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    marginBottom: 8,
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
  eventHeaderText: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
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
  eventDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  eventSection: {
    marginTop: 8,
  },
  eventSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  eventSectionItem: {
    fontSize: 14,
    color: '#333',
  },
  settingsContainer: {
    marginTop: 16,
  },
  settingCard: {
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
  settingName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  settingDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  settingAtmosphere: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  settingTimePeriod: {
    fontSize: 14,
    color: '#666',
  },
  branchesContainer: {
    marginTop: 16,
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
  branchName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  branchDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  branchDetails: {
    flexDirection: 'row',
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
  graphContainer: {
    height: 400,
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
  tripletsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tripletItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tripletText: {
    fontSize: 14,
    marginBottom: 4,
  },
  tripletSubject: {
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  tripletPredicate: {
    fontStyle: 'italic',
    color: '#3498db',
  },
  tripletObject: {
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  tripletConfidence: {
    fontSize: 12,
    color: '#999',
  },
  moreTriplets: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
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

export default BookInfo;

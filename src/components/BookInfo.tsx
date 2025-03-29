import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Book } from '../types';

interface BookInfoProps {
  book: Book;
  onSelectChapters: () => void;
  onBackToLibrary: () => void;
  onViewLiteraryDevices?: () => void;
  onViewKnowledgeBase?: () => void;
  onToggleSidebar: () => void;
  onOpenNovelPlanner?: () => void;
}

const BookInfo: React.FC<BookInfoProps> = ({ 
  book, 
  onSelectChapters, 
  onBackToLibrary,
  onViewLiteraryDevices,
  onViewKnowledgeBase,
  onToggleSidebar,
  onOpenNovelPlanner
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBackToLibrary} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{book.title}</Text>
        <TouchableOpacity onPress={onToggleSidebar} style={styles.burgerButton}>
          <Text style={styles.burgerIcon}>☰</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.tabContent}>
          {/* Header section with cover on left, title/author on right */}
          <View style={styles.headerSection}>
            <View style={styles.coverContainer}>
              {book.coverUrl ? (
                <Image source={{ uri: book.coverUrl }} style={styles.coverImage} />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <Text style={styles.coverPlaceholderText}>{book.title[0]}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.headerInfo}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>by {book.author}</Text>
              
              {/* Badges */}
              <View style={styles.badgesContainer}>
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
            </View>
          </View>
          
          {/* Metadata section */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Pages</Text>
              <Text style={styles.metaValue}>{book.content.length}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Chapters</Text>
              <Text style={styles.metaValue}>{book.chapters?.length || 0}</Text>
            </View>
          </View>
          
          {/* Stats section */}
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
          
          {/* Actions section */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={onSelectChapters}
            >
              <Text style={styles.actionButtonText}>View Chapters</Text>
            </TouchableOpacity>
            
            {onOpenNovelPlanner && (
              <TouchableOpacity 
                style={[styles.actionButton, styles.plannerButton]} 
                onPress={onOpenNovelPlanner}
              >
                <Text style={styles.actionButtonText}>Novel Planning</Text>
              </TouchableOpacity>
            )}
            
            {onViewLiteraryDevices && (
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={onViewLiteraryDevices}
              >
                <Text style={styles.actionButtonText}>Literary Devices</Text>
              </TouchableOpacity>
            )}
            
            {onViewKnowledgeBase && (
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={onViewKnowledgeBase}
              >
                <Text style={styles.actionButtonText}>Knowledge Base</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
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
  header: {
    height: 50,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backArrow: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  burgerButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  burgerIcon: {
    fontSize: 24,
    color: 'white',
  },
  scrollContainer: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  headerSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  coverContainer: {
    marginRight: 16,
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
  headerInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 0,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  metaItem: {
    alignItems: 'center',
    flex: 1,
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
    marginRight: 8,
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
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 8,
    marginBottom: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  plannerButton: {
    backgroundColor: '#9b59b6',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BookInfo;

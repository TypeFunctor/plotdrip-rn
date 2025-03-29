import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Book, Chapter } from '../types';

interface ChapterListProps {
  book: Book;
  onSelectChapter: (chapter: Chapter) => void;
  onBackToLibrary: () => void;
  onBackToBookInfo: () => void;
}

const ChapterList: React.FC<ChapterListProps> = ({ 
  book, 
  onSelectChapter, 
  onBackToLibrary,
  onBackToBookInfo
}) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {book.chapters && book.chapters.length > 0 ? (
          book.chapters.map((chapter) => (
            <TouchableOpacity
              key={chapter.id}
              style={styles.chapterItem}
              onPress={() => onSelectChapter(chapter)}
            >
              <Text style={styles.chapterTitle}>{chapter.title}</Text>
              <Text style={styles.chapterPage}>Page {chapter.pageIndex + 1}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No chapters found</Text>
            <Text style={styles.emptyStateSubtext}>This book doesn't have any chapters defined.</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={onBackToBookInfo}>
          <Text style={styles.footerButtonText}>Back to Book Info</Text>
        </TouchableOpacity>
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
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  chapterItem: {
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
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chapterPage: {
    fontSize: 14,
    color: '#666',
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
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
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

export default ChapterList;

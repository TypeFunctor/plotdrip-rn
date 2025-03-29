import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Book, Chapter } from '../types';

interface ChapterListProps {
  book: Book;
  onSelectChapter: (chapter: Chapter) => void;
  onBackToLibrary: () => void;
}

const ChapterList: React.FC<ChapterListProps> = ({ book, onSelectChapter, onBackToLibrary }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bookInfoContainer}>
        {book.coverUrl ? (
          <Image source={{ uri: book.coverUrl }} style={styles.cover} />
        ) : (
          <View style={styles.placeholderCover}>
            <Text style={styles.placeholderText}>{book.title[0]}</Text>
          </View>
        )}
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>
          <Text style={styles.bookFormat}>{book.format.toUpperCase()}</Text>
          <Text style={styles.bookPages}>{book.content.length} pages</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Chapters</Text>
      
      <ScrollView style={styles.chapterList}>
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
          <View style={styles.noChaptersContainer}>
            <Text style={styles.noChaptersText}>No chapters detected</Text>
            <TouchableOpacity
              style={styles.startReadingButton}
              onPress={() => onSelectChapter({
                id: 'default',
                title: 'Beginning',
                pageIndex: 0
              })}
            >
              <Text style={styles.startReadingButtonText}>Start Reading from Beginning</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToLibrary}>
          <Text style={styles.backButtonText}>Back to Library</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.startReadingButton}
          onPress={() => onSelectChapter({
            id: 'default',
            title: 'Beginning',
            pageIndex: 0
          })}
        >
          <Text style={styles.startReadingButtonText}>Start Reading</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  bookInfoContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cover: {
    width: 100,
    height: 150,
    borderRadius: 4,
    marginRight: 16,
  },
  placeholderCover: {
    width: 100,
    height: 150,
    borderRadius: 4,
    marginRight: 16,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 36,
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
    fontSize: 14,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  bookPages: {
    fontSize: 14,
    color: '#999',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  chapterList: {
    flex: 1,
  },
  chapterItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  chapterPage: {
    fontSize: 14,
    color: '#666',
  },
  noChaptersContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    alignItems: 'center',
  },
  noChaptersText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  backButton: {
    backgroundColor: '#95a5a6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  startReadingButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  startReadingButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChapterList;

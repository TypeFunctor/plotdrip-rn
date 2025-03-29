import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Book, Chapter } from '../types';

interface ChapterPageListProps {
  book: Book;
  chapter: Chapter;
  onSelectPage: (pageIndex: number) => void;
  onBackToChapters: () => void;
}

const ChapterPageList: React.FC<ChapterPageListProps> = ({
  book,
  chapter,
  onSelectPage,
  onBackToChapters
}) => {
  // Determine the range of pages in this chapter
  const getChapterPageRange = () => {
    const chapterIndex = book.chapters?.findIndex(ch => ch.id === chapter.id) || 0;
    const nextChapterIndex = chapterIndex + 1;
    
    const startPage = chapter.pageIndex;
    let endPage = book.content.length - 1; // Default to end of book
    
    // If there's a next chapter, use its pageIndex as the end (exclusive)
    if (book.chapters && nextChapterIndex < book.chapters.length) {
      endPage = book.chapters[nextChapterIndex].pageIndex - 1;
    }
    
    return { startPage, endPage };
  };
  
  const { startPage, endPage } = getChapterPageRange();
  const pageCount = endPage - startPage + 1;
  
  // Generate array of page numbers for this chapter
  const pageIndices = Array.from({ length: pageCount }, (_, i) => startPage + i);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.chapterTitle}>{chapter.title}</Text>
        <Text style={styles.pageCount}>{pageCount} {pageCount === 1 ? 'page' : 'pages'}</Text>
      </View>
      
      <ScrollView style={styles.pageList}>
        {pageIndices.map((pageIndex) => (
          <TouchableOpacity
            key={pageIndex}
            style={styles.pageItem}
            onPress={() => onSelectPage(pageIndex)}
          >
            <Text style={styles.pageNumber}>Page {pageIndex + 1}</Text>
            <Text style={styles.pagePreview}>
              {book.content[pageIndex]?.substring(0, 50)}
              {book.content[pageIndex]?.length > 50 ? '...' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBackToChapters}
        >
          <Text style={styles.buttonText}>Back to Chapters</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.readButton} 
          onPress={() => onSelectPage(startPage)}
        >
          <Text style={styles.buttonText}>Start Reading Chapter</Text>
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
  header: {
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
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pageCount: {
    fontSize: 14,
    color: '#666',
  },
  pageList: {
    flex: 1,
  },
  pageItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pageNumber: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  pagePreview: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
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
  readButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ChapterPageList;

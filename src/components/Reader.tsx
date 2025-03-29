import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Book } from '../types';

interface ReaderProps {
  book: Book;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Reader: React.FC<ReaderProps> = ({ book, currentPage, setCurrentPage }) => {
  const totalPages = book.htmlContent?.length || book.content.length || 0;
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Determine content to display - prefer HTML content if available
  const pageContent = book.htmlContent?.[currentPage] || book.content[currentPage] || '';
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {book.htmlContent && book.htmlContent[currentPage] ? (
          <div 
            className="html-content"
            dangerouslySetInnerHTML={{ __html: pageContent }}
            style={styles.htmlContainer}
          />
        ) : (
          <Text style={styles.textContent}>{pageContent}</Text>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.navButton, currentPage === 0 && styles.disabledButton]} 
          onPress={handlePrevPage}
          disabled={currentPage === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <View style={styles.pageInfoContainer}>
          <Text style={styles.pageInfo}>
            Page {currentPage + 1} of {totalPages}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.navButton, currentPage === totalPages - 1 && styles.disabledButton]} 
          onPress={handleNextPage}
          disabled={currentPage === totalPages - 1}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f7f1', // Cream color for reading comfort
    padding: 16,
  },
  content: {
    flex: 1,
    marginBottom: 16,
  },
  htmlContainer: {
    padding: 8,
    fontSize: 18,
    lineHeight: 1.6,
    color: '#333',
  },
  textContent: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  pageInfoContainer: {
    alignItems: 'center',
  },
  navButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 14,
    color: '#666',
  }
});

export default Reader;

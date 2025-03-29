import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Book } from '../types';

interface LibraryProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onImportBook: () => void;
}

const Library: React.FC<LibraryProps> = ({ books, onSelectBook, onImportBook }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Library</Text>
        <TouchableOpacity 
          style={styles.importButton} 
          onPress={onImportBook}
        >
          <Text style={styles.importButtonText}>Import Book</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.grid}>
          {books.map((book) => (
            <TouchableOpacity 
              key={book.id} 
              style={styles.bookCard}
              onPress={() => onSelectBook(book)}
            >
              {book.coverUrl ? (
                <Image source={{ uri: book.coverUrl }} style={styles.cover} />
              ) : (
                <View style={styles.placeholderCover}>
                  <Text style={styles.placeholderText}>{book.title[0]}</Text>
                </View>
              )}
              <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
              <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
              <Text style={styles.format}>{book.format.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 50,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  importButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  importButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bookCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cover: {
    width: '100%',
    height: 180,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#e0e0e0',
  },
  placeholderCover: {
    width: '100%',
    height: 180,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  format: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
  },
});

export default Library;

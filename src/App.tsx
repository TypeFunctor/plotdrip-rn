import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import Library from './components/Library';
import Reader from './components/Reader';
import Editor from './components/Editor';
import ChapterList from './components/ChapterList';
import ChapterPageList from './components/ChapterPageList';
import BookInfo from './components/BookInfo';
import { Book, Chapter } from './types';
import { sampleBooks } from './data/sampleBooks';
import ImportBooks from './components/ImportBooks';
import { textToHtml, htmlToDelta } from './utils/formatConversion';
import Sidebar from './components/Sidebar';
import { extractChapters } from './utils/chapterExtraction';
import { extractTriplets, updateBookKnowledgeGraph } from './utils/knowledgeGraphExtractor';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(sampleBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [viewMode, setViewMode] = useState<'library' | 'bookInfo' | 'chapters' | 'chapterPages' | 'reader' | 'editor'>('library');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  
  const handleSelectBook = (book: Book) => {
    // Prepare book for reading/editing if needed
    let preparedBook = { ...book };
    
    // If the book doesn't have HTML content yet, generate it from text content
    if (!preparedBook.htmlContent && preparedBook.content) {
      preparedBook.htmlContent = preparedBook.content.map(textToHtml);
    }
    
    // If the book is editable but doesn't have Delta content, generate it from HTML
    if (preparedBook.isEditable && !preparedBook.deltaContent && preparedBook.htmlContent) {
      preparedBook.deltaContent = preparedBook.htmlContent.map(html => {
        const result = htmlToDelta(html);
        return result.success ? result.content[0] : null;
      });
    }
    
    // Extract chapters if not already present
    if (!preparedBook.chapters || preparedBook.chapters.length === 0) {
      preparedBook.chapters = extractChapters(preparedBook);
    }
    
    setSelectedBook(preparedBook);
    setViewMode('bookInfo');
  };
  
  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    
    // Determine if this chapter has multiple pages
    if (selectedBook && selectedBook.chapters) {
      const chapterIndex = selectedBook.chapters.findIndex(ch => ch.id === chapter.id);
      const nextChapterIndex = chapterIndex + 1;
      
      const startPage = chapter.pageIndex;
      let endPage = selectedBook.content.length - 1; // Default to end of book
      
      // If there's a next chapter, use its pageIndex as the end (exclusive)
      if (nextChapterIndex < selectedBook.chapters.length) {
        endPage = selectedBook.chapters[nextChapterIndex].pageIndex - 1;
      }
      
      const pageCount = endPage - startPage + 1;
      
      // If chapter has multiple pages, show chapter page list
      if (pageCount > 1) {
        setViewMode('chapterPages');
      } else {
        // If only one page, go directly to reader
        setCurrentPage(startPage);
        setViewMode('reader');
      }
    }
  };
  
  const handleSelectPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    setViewMode('reader');
  };
  
  const handleBackToLibrary = () => {
    setSelectedBook(null);
    setSelectedChapter(null);
    setCurrentPage(0);
    setIsEditing(false);
    setViewMode('library');
  };
  
  const handleBackToBookInfo = () => {
    setSelectedChapter(null);
    setViewMode('bookInfo');
  };
  
  const handleBackToChapters = () => {
    setSelectedChapter(null);
    setViewMode('chapters');
  };
  
  const handleBackToChapterPages = () => {
    if (selectedChapter) {
      setViewMode('chapterPages');
    } else {
      handleBackToChapters();
    }
  };
  
  const handleStartEditing = () => {
    setIsEditing(true);
    setViewMode('editor');
  };
  
  const handleSaveEdits = (updatedBook: Book) => {
    // Update the book in the library
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === updatedBook.id ? updatedBook : book
      )
    );
    
    // Update the selected book
    setSelectedBook(updatedBook);
    setIsEditing(false);
    setViewMode('reader');
  };
  
  const handleCancelEditing = () => {
    setIsEditing(false);
    setViewMode('reader');
  };
  
  const handleImportBook = (newBook: Book) => {
    // Extract chapters for the new book
    const bookWithChapters = {
      ...newBook,
      chapters: extractChapters(newBook)
    };
    
    setBooks(prevBooks => [...prevBooks, bookWithChapters]);
    setShowImportModal(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleImportClick = () => {
    setShowImportModal(true);
    setIsSidebarOpen(false);
  };

  // Process knowledge graph data when reading
  const handlePageChange = (newPage: number) => {
    if (selectedBook) {
      // Extract knowledge graph data from the current page
      const pageContent = selectedBook.content[newPage];
      const triplets = extractTriplets(selectedBook, newPage, pageContent);
      
      if (triplets.length > 0) {
        // Update book with new knowledge graph data
        const updatedBook = updateBookKnowledgeGraph(selectedBook, triplets);
        
        // Update the book in state and library
        setSelectedBook(updatedBook);
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book.id === updatedBook.id ? updatedBook : book
          )
        );
      }
    }
    
    setCurrentPage(newPage);
  };

  // Determine current view for contextual sidebar
  const getCurrentView = () => {
    return viewMode;
  };

  // Get header title based on current view
  const getHeaderTitle = () => {
    if (!selectedBook) return 'E-Reader Library';
    if (viewMode === 'bookInfo') return `Book Info: ${selectedBook.title}`;
    if (viewMode === 'chapters') return `Chapters: ${selectedBook.title}`;
    if (viewMode === 'chapterPages' && selectedChapter) return `Pages in "${selectedChapter.title}"`;
    if (viewMode === 'editor') return `Edit: ${selectedBook.title}`;
    return selectedBook.title;
  };

  // Find current chapter information
  const getCurrentChapterInfo = () => {
    if (!selectedBook || !selectedBook.chapters || selectedBook.chapters.length === 0 || viewMode !== 'reader') {
      return null;
    }
    
    // Find the chapter this page belongs to
    let currentChapter = null;
    for (let i = 0; i < selectedBook.chapters.length; i++) {
      if (selectedBook.chapters[i].pageIndex <= currentPage) {
        currentChapter = selectedBook.chapters[i];
      } else {
        break;
      }
    }
    
    if (currentChapter) {
      const isChapterStart = currentChapter.pageIndex === currentPage;
      return {
        title: currentChapter.title,
        isChapterStart
      };
    }
    
    return null;
  };
  
  const chapterInfo = getCurrentChapterInfo();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appContainer}>
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
              {selectedBook && viewMode === 'reader' && (
                <Text style={styles.headerSubtitle}>by {selectedBook.author}</Text>
              )}
            </View>
            
            <View style={styles.headerCenterContainer}>
              {chapterInfo && viewMode === 'reader' && (
                <Text style={styles.chapterInfo}>
                  {chapterInfo.title}
                  {chapterInfo.isChapterStart ? ' (Start)' : ''}
                </Text>
              )}
            </View>
            
            <TouchableOpacity onPress={toggleSidebar} style={styles.burgerButton}>
              <Text style={styles.burgerIcon}>☰</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            {viewMode === 'library' && (
              <Library 
                books={books} 
                onSelectBook={handleSelectBook} 
              />
            )}
            
            {viewMode === 'bookInfo' && selectedBook && (
              <BookInfo
                book={selectedBook}
                onSelectChapters={() => setViewMode('chapters')}
                onBackToLibrary={handleBackToLibrary}
              />
            )}
            
            {viewMode === 'chapters' && selectedBook && (
              <ChapterList
                book={selectedBook}
                onSelectChapter={handleSelectChapter}
                onBackToLibrary={handleBackToLibrary}
                onBackToBookInfo={handleBackToBookInfo}
              />
            )}
            
            {viewMode === 'chapterPages' && selectedBook && selectedChapter && (
              <ChapterPageList
                book={selectedBook}
                currentChapter={selectedChapter}
                onSelectPage={handleSelectPage}
                onBackToChapters={handleBackToChapters}
              />
            )}
            
            {viewMode === 'editor' && selectedBook && (
              <Editor 
                book={selectedBook}
                currentPage={currentPage}
                onSave={handleSaveEdits}
                onCancel={handleCancelEditing}
              />
            )}
            
            {viewMode === 'reader' && selectedBook && (
              <View style={styles.readerContainer}>
                <Reader 
                  book={selectedBook}
                  currentPage={currentPage}
                  setCurrentPage={handlePageChange}
                />
                <View style={styles.readerFooter}>
                  {selectedChapter ? (
                    <TouchableOpacity 
                      style={styles.footerButton} 
                      onPress={handleBackToChapterPages}
                    >
                      <Text style={styles.footerButtonText}>Back to Chapter Pages</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={styles.footerButton} 
                      onPress={handleBackToChapters}
                    >
                      <Text style={styles.footerButtonText}>Back to Chapters</Text>
                    </TouchableOpacity>
                  )}
                  
                  <TouchableOpacity 
                    style={styles.footerButton} 
                    onPress={handleBackToBookInfo}
                  >
                    <Text style={styles.footerButtonText}>Book Info</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
        
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
          onImport={handleImportClick}
          currentView={getCurrentView()}
          onEdit={selectedBook?.isEditable && viewMode === 'reader' ? handleStartEditing : undefined}
          onBackToLibrary={handleBackToLibrary}
          onBackToBookInfo={viewMode !== 'library' && viewMode !== 'bookInfo' ? handleBackToBookInfo : undefined}
          onBackToChapters={viewMode === 'reader' || viewMode === 'chapterPages' ? handleBackToChapters : undefined}
          onBackToChapterPages={viewMode === 'reader' && selectedChapter ? handleBackToChapterPages : undefined}
        />
      </View>
      
      <ImportBooks 
        onImportBook={handleImportBook} 
        isVisible={showImportModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100vh',
    width: '100vw',
  },
  appContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    height: 60,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerCenterContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterInfo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
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
  contentContainer: {
    flex: 1,
  },
  readerContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  readerFooter: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;

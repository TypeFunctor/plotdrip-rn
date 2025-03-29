import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Library from './components/Library';
import Reader from './components/Reader';
import Editor from './components/Editor';
import ImportBooks from './components/ImportBooks';
import { Book, Branch } from './types';
import { sampleBooks } from './data/sampleBooks';
import Sidebar from './components/Sidebar';
import ChapterList from './components/ChapterList';
import ChapterPageList from './components/ChapterPageList';
import BookInfo from './components/BookInfo';
import KnowledgeGraphViewer from './components/KnowledgeGraphViewer';
import LiteraryDevicesList from './components/LiteraryDevicesList';
import NovelPlanner from './components/NovelPlanner';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(sampleBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [view, setView] = useState<'library' | 'reader' | 'chapters' | 'chapterPages' | 'bookInfo' | 'knowledgeGraph' | 'literaryDevices' | 'novelPlanner'>('library');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(null);
  
  // Add/remove body class when sidebar is open/closed
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isSidebarOpen]);
  
  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentPage(0);
    setView('bookInfo');
    setActiveBranch(null);
  };
  
  const handleBackToLibrary = () => {
    setSelectedBook(null);
    setView('library');
    setActiveBranch(null);
  };
  
  const handleSelectChapters = () => {
    if (selectedBook) {
      setView('chapters');
    }
  };
  
  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setView('chapterPages');
  };
  
  const handleSelectPage = (pageIndex: number) => {
    setCurrentPage(pageIndex);
    setView('reader');
  };
  
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };
  
  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };
  
  const handleImportBook = (newBook: Book) => {
    setBooks([...books, newBook]);
    setShowImportModal(false);
  };
  
  const handleViewKnowledgeGraph = () => {
    setView('knowledgeGraph');
  };
  
  const handleViewLiteraryDevices = () => {
    setView('literaryDevices');
  };
  
  const handleOpenNovelPlanner = () => {
    setView('novelPlanner');
  };
  
  const handleUpdateBook = (updatedBook: Book) => {
    const updatedBooks = books.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    );
    setBooks(updatedBooks);
    setSelectedBook(updatedBook);
  };
  
  const handleSavePlan = (updatedBook: Book) => {
    handleUpdateBook(updatedBook);
    setView('bookInfo');
  };
  
  const handleSelectBranch = (branch: Branch | null) => {
    setActiveBranch(branch);
    if (branch) {
      setCurrentPage(branch.branchPointPageIndex);
    }
    setView('reader');
  };
  
  const renderHeader = () => {
    if (view === 'library') {
      return (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Library</Text>
          <TouchableOpacity onPress={handleToggleSidebar} style={styles.burgerButton}>
            <Text style={styles.burgerIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (view === 'reader' && selectedBook) {
      // Find the chapter that contains the current page
      const currentChapter = selectedBook.chapters?.find(chapter => {
        const nextChapter = selectedBook.chapters?.find(c => c.pageIndex > chapter.pageIndex);
        return currentPage >= chapter.pageIndex && (!nextChapter || currentPage < nextChapter.pageIndex);
      });
      
      return (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('chapters')} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {selectedBook.title}
            {currentChapter && ` - ${currentChapter.title}`}
            {activeBranch && ` (${activeBranch.name})`}
          </Text>
          <TouchableOpacity onPress={handleToggleSidebar} style={styles.burgerButton}>
            <Text style={styles.burgerIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (view === 'chapters' && selectedBook) {
      return (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('bookInfo')} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedBook.title} - Chapters</Text>
          <TouchableOpacity onPress={handleToggleSidebar} style={styles.burgerButton}>
            <Text style={styles.burgerIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (view === 'chapterPages' && selectedBook && selectedChapter) {
      const chapter = selectedBook.chapters?.find(c => c.id === selectedChapter);
      return (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('chapters')} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedBook.title} - {chapter?.title}</Text>
          <TouchableOpacity onPress={handleToggleSidebar} style={styles.burgerButton}>
            <Text style={styles.burgerIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (view === 'knowledgeGraph' && selectedBook) {
      return (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('bookInfo')} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedBook.title} - Knowledge Graph</Text>
          <TouchableOpacity onPress={handleToggleSidebar} style={styles.burgerButton}>
            <Text style={styles.burgerIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (view === 'literaryDevices' && selectedBook) {
      return (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('bookInfo')} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedBook.title} - Literary Devices</Text>
          <TouchableOpacity onPress={handleToggleSidebar} style={styles.burgerButton}>
            <Text style={styles.burgerIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (view === 'novelPlanner' && selectedBook) {
      return (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setView('bookInfo')} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedBook.title} - Novel Planning</Text>
          <TouchableOpacity onPress={handleToggleSidebar} style={styles.burgerButton}>
            <Text style={styles.burgerIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return null;
  };
  
  const renderContent = () => {
    if (view === 'library') {
      return (
        <Library 
          books={books} 
          onSelectBook={handleSelectBook} 
          onImportBook={() => setShowImportModal(true)} 
        />
      );
    }
    
    if (!selectedBook) {
      return null;
    }
    
    if (view === 'reader') {
      return isEditing ? (
        <Editor 
          book={selectedBook} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          onSave={handleUpdateBook}
        />
      ) : (
        <Reader 
          book={selectedBook} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          activeBranch={activeBranch}
        />
      );
    }
    
    if (view === 'chapters') {
      return (
        <ChapterList 
          book={selectedBook} 
          onSelectChapter={handleSelectChapter} 
          onBackToBookInfo={() => setView('bookInfo')}
        />
      );
    }
    
    if (view === 'chapterPages' && selectedChapter) {
      const chapter = selectedBook.chapters?.find(c => c.id === selectedChapter);
      if (!chapter) return null;
      
      return (
        <ChapterPageList 
          book={selectedBook} 
          chapter={chapter} 
          onSelectPage={handleSelectPage} 
          onBackToChapters={() => setView('chapters')}
        />
      );
    }
    
    if (view === 'bookInfo') {
      return (
        <BookInfo 
          book={selectedBook} 
          onSelectChapters={handleSelectChapters} 
          onBackToLibrary={handleBackToLibrary}
          onViewLiteraryDevices={handleViewLiteraryDevices}
          onToggleSidebar={handleToggleSidebar}
          onOpenNovelPlanner={handleOpenNovelPlanner}
        />
      );
    }
    
    if (view === 'knowledgeGraph') {
      return (
        <View style={styles.graphContainer}>
          <KnowledgeGraphViewer 
            book={selectedBook} 
            height={window.innerHeight - 100} 
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => setView('bookInfo')}
          >
            <Text style={styles.backButtonText}>Back to Book Info</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (view === 'literaryDevices') {
      return (
        <LiteraryDevicesList 
          book={selectedBook} 
          onBackToBookInfo={() => setView('bookInfo')}
        />
      );
    }
    
    if (view === 'novelPlanner') {
      return (
        <NovelPlanner 
          book={selectedBook} 
          onSave={handleSavePlan}
          onCancel={() => setView('bookInfo')}
        />
      );
    }
    
    return null;
  };
  
  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <View style={styles.content}>
        {renderContent()}
      </View>
      
      {showImportModal && (
        <ImportBooks 
          onClose={() => setShowImportModal(false)} 
          onImport={handleImportBook} 
        />
      )}
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={handleCloseSidebar}
        onToggleEdit={isEditing ? undefined : handleToggleEdit}
        onImportBook={() => setShowImportModal(true)}
        onBackToLibrary={handleBackToLibrary}
        book={selectedBook}
        onSelectBranch={handleSelectBranch}
        activeBranch={activeBranch}
        onViewKnowledgeGraph={selectedBook ? handleViewKnowledgeGraph : undefined}
        onViewLiteraryDevices={selectedBook ? handleViewLiteraryDevices : undefined}
        onOpenNovelPlanner={selectedBook ? handleOpenNovelPlanner : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    width: '100%',
    height: '100%',
  },
  header: {
    height: 50,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    width: '100%',
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
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backArrow: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  graphContainer: {
    flex: 1,
    padding: 16,
    width: '100%',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Book, Branch } from '../types';

interface ReaderProps {
  book: Book;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  activeBranch?: Branch | null;
}

const Reader: React.FC<ReaderProps> = ({ book, currentPage, setCurrentPage, activeBranch }) => {
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
    // Determine total pages based on whether we're in a branch or main content
    if (activeBranch && currentPage >= activeBranch.branchPointPageIndex) {
      setTotalPages(activeBranch.branchPointPageIndex + activeBranch.content.length);
    } else {
      setTotalPages(book.content.length);
    }
  }, [book, activeBranch, currentPage]);
  
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
  
  // Get the content to display based on whether we're in a branch or main content
  const getContent = () => {
    if (activeBranch && currentPage >= activeBranch.branchPointPageIndex) {
      const branchIndex = currentPage - activeBranch.branchPointPageIndex;
      
      // If we have HTML content in the branch, use it
      if (activeBranch.htmlContent && activeBranch.htmlContent[branchIndex]) {
        return (
          <div 
            className="html-content"
            dangerouslySetInnerHTML={{ __html: activeBranch.htmlContent[branchIndex] }} 
          />
        );
      }
      
      // Otherwise use plain text
      return (
        <Text style={styles.content}>
          {activeBranch.content[branchIndex] || "No content available for this page."}
        </Text>
      );
    }
    
    // If we have HTML content, use it
    if (book.htmlContent && book.htmlContent[currentPage]) {
      return (
        <div 
          className="html-content"
          dangerouslySetInnerHTML={{ __html: book.htmlContent[currentPage] }} 
        />
      );
    }
    
    // Otherwise use plain text
    return (
      <Text style={styles.content}>
        {book.content[currentPage] || "No content available for this page."}
      </Text>
    );
  };
  
  // Check if we're at a branch point
  const isBranchPoint = () => {
    if (!book.branches) return false;
    
    return book.branches.some(branch => branch.branchPointPageIndex === currentPage);
  };
  
  // Get available branches at this point
  const getAvailableBranches = () => {
    if (!book.branches) return [];
    
    return book.branches.filter(branch => branch.branchPointPageIndex === currentPage);
  };
  
  // Show branch notification if we're at a branch point
  const renderBranchNotification = () => {
    const branches = getAvailableBranches();
    
    if (branches.length === 0) return null;
    
    return (
      <View style={styles.branchNotification}>
        <Text style={styles.branchNotificationTitle}>Story Branch Point</Text>
        <Text style={styles.branchNotificationText}>
          This is a point where the story can take different paths. Use the sidebar to explore alternative branches.
        </Text>
      </View>
    );
  };
  
  // Show reconnection notification if we're at a reconnection point
  const renderReconnectionNotification = () => {
    if (!activeBranch || !activeBranch.reconnectBranchId || currentPage !== activeBranch.reconnectPageIndex) {
      return null;
    }
    
    return (
      <View style={styles.reconnectNotification}>
        <Text style={styles.reconnectNotificationTitle}>Branch Reconnection Point</Text>
        <Text style={styles.reconnectNotificationText}>
          This branch reconnects with the main storyline here.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          {getContent()}
          
          {isBranchPoint() && renderBranchNotification()}
          {renderReconnectionNotification()}
        </View>
      </ScrollView>
      
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={[styles.navButton, currentPage === 0 && styles.disabledButton]} 
          onPress={handlePrevPage}
          disabled={currentPage === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <Text style={styles.pageInfo}>
          Page {currentPage + 1} of {totalPages}
          {activeBranch && currentPage >= activeBranch.branchPointPageIndex && (
            ` (${activeBranch.name})`
          )}
        </Text>
        
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
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    minHeight: 500,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  navButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  pageInfo: {
    fontSize: 14,
    color: '#666',
  },
  branchNotification: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f8f4e5',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  branchNotificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f39c12',
    marginBottom: 8,
  },
  branchNotificationText: {
    fontSize: 14,
    color: '#666',
  },
  reconnectNotification: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#e8f4f8',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  reconnectNotificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 8,
  },
  reconnectNotificationText: {
    fontSize: 14,
    color: '#666',
  },
});

export default Reader;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
  currentView: string;
  onEdit?: () => void;
  onBackToLibrary: () => void;
  onBackToBookInfo?: () => void;
  onBackToChapters?: () => void;
  onBackToChapterPages?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onImport, 
  currentView,
  onEdit,
  onBackToLibrary,
  onBackToBookInfo,
  onBackToChapters,
  onBackToChapterPages
}) => {
  // Using CSS transitions instead of Animated API to avoid global reference issues
  return (
    <>
      {isOpen && (
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={onClose}
          activeOpacity={1}
        />
      )}
      
      <View 
        style={[
          styles.sidebar,
          { transform: [{ translateX: isOpen ? 0 : 300 }] }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          {/* Import Books - available in all views */}
          <TouchableOpacity style={styles.menuItem} onPress={onImport}>
            <Text style={styles.menuItemText}>Import Books</Text>
          </TouchableOpacity>
          
          {/* Edit Book - only in reader view and if book is editable */}
          {onEdit && currentView === 'reader' && (
            <TouchableOpacity style={styles.menuItem} onPress={onEdit}>
              <Text style={styles.menuItemText}>Edit Page</Text>
            </TouchableOpacity>
          )}
          
          {/* Navigation options based on current view */}
          {currentView !== 'library' && (
            <TouchableOpacity style={styles.menuItem} onPress={onBackToLibrary}>
              <Text style={styles.menuItemText}>Back to Library</Text>
            </TouchableOpacity>
          )}
          
          {onBackToBookInfo && currentView !== 'library' && currentView !== 'bookInfo' && (
            <TouchableOpacity style={styles.menuItem} onPress={onBackToBookInfo}>
              <Text style={styles.menuItemText}>Back to Book Info</Text>
            </TouchableOpacity>
          )}
          
          {onBackToChapters && (currentView === 'reader' || currentView === 'chapterPages') && (
            <TouchableOpacity style={styles.menuItem} onPress={onBackToChapters}>
              <Text style={styles.menuItemText}>Back to Chapters</Text>
            </TouchableOpacity>
          )}
          
          {onBackToChapterPages && currentView === 'reader' && (
            <TouchableOpacity style={styles.menuItem} onPress={onBackToChapterPages}>
              <Text style={styles.menuItemText}>Back to Chapter Pages</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 300,
    height: '100%',
    backgroundColor: 'white',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    transition: 'transform 300ms ease',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 20,
    color: '#666',
  },
  content: {
    padding: 16,
  },
  menuItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default Sidebar;

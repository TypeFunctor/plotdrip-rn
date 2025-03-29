import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
  currentView: string;
  onEdit?: () => void;
  onBackToLibrary: () => void;
  onBackToChapters?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onImport, 
  currentView, 
  onEdit, 
  onBackToLibrary,
  onBackToChapters
}) => {
  if (!isOpen) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.overlayBackground} onPress={onClose} />
      <View style={styles.sidebar}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Menu</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content}>
          {/* Library View Options */}
          {currentView === 'library' && (
            <View>
              <TouchableOpacity style={styles.menuItem} onPress={onImport}>
                <Text style={styles.menuItemText}>Import Book</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Chapter List View Options */}
          {currentView === 'chapters' && (
            <View>
              <TouchableOpacity style={styles.menuItem} onPress={onBackToLibrary}>
                <Text style={styles.menuItemText}>Back to Library</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={onImport}>
                <Text style={styles.menuItemText}>Import Book</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Reader View Options */}
          {currentView === 'reader' && (
            <View>
              {onBackToChapters && (
                <TouchableOpacity style={styles.menuItem} onPress={onBackToChapters}>
                  <Text style={styles.menuItemText}>Back to Chapters</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.menuItem} onPress={onBackToLibrary}>
                <Text style={styles.menuItemText}>Back to Library</Text>
              </TouchableOpacity>
              {onEdit && (
                <TouchableOpacity style={styles.menuItem} onPress={onEdit}>
                  <Text style={styles.menuItemText}>Edit Page</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.menuItem} onPress={onImport}>
                <Text style={styles.menuItemText}>Import Book</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Editor View Options */}
          {currentView === 'editor' && (
            <View>
              <TouchableOpacity style={styles.menuItem} onPress={onBackToLibrary}>
                <Text style={styles.menuItemText}>Back to Library</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    zIndex: 1000,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    width: 250,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    height: 60,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  menuItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
  },
});

export default Sidebar;

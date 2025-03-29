import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Book, Branch } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleEdit?: () => void;
  onImportBook: () => void;
  onBackToLibrary: () => void;
  book: Book | null;
  onSelectBranch: (branch: Branch | null) => void;
  activeBranch: Branch | null;
  onViewKnowledgeGraph?: () => void;
  onViewLiteraryDevices?: () => void;
  onOpenNovelPlanner?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onToggleEdit, 
  onImportBook, 
  onBackToLibrary,
  book,
  onSelectBranch,
  activeBranch,
  onViewKnowledgeGraph,
  onViewLiteraryDevices,
  onOpenNovelPlanner
}) => {
  // Render branches section if book has branches
  const renderBranches = () => {
    if (!book || !book.branches || book.branches.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Story Branches</Text>
        <TouchableOpacity 
          style={[
            styles.menuItem, 
            !activeBranch && styles.activeMenuItem
          ]} 
          onPress={() => onSelectBranch(null)}
        >
          <Text style={[
            styles.menuItemText,
            !activeBranch && styles.activeMenuItemText
          ]}>Main Storyline</Text>
        </TouchableOpacity>
        
        {book.branches.map(branch => (
          <TouchableOpacity 
            key={branch.id} 
            style={[
              styles.menuItem, 
              activeBranch?.id === branch.id && styles.activeMenuItem
            ]} 
            onPress={() => onSelectBranch(branch)}
          >
            <Text style={[
              styles.menuItemText,
              activeBranch?.id === branch.id && styles.activeMenuItemText
            ]}>{branch.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <TouchableOpacity 
          style={styles.overlay} 
          onPress={onClose}
          activeOpacity={1}
        />
      )}
      
      {/* Sidebar */}
      <View 
        style={[
          styles.sidebar,
          { transform: [{ translateX: isOpen ? 0 : 280 }] }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Navigation</Text>
            <TouchableOpacity style={styles.menuItem} onPress={onBackToLibrary}>
              <Text style={styles.menuItemText}>Back to Library</Text>
            </TouchableOpacity>
            
            {onToggleEdit && (
              <TouchableOpacity style={styles.menuItem} onPress={onToggleEdit}>
                <Text style={styles.menuItemText}>Toggle Edit Mode</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {renderBranches()}
          
          {book && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Book Tools</Text>
              
              {onOpenNovelPlanner && (
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={onOpenNovelPlanner}
                >
                  <Text style={styles.menuItemText}>Novel Planning</Text>
                </TouchableOpacity>
              )}
              
              {onViewLiteraryDevices && (
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={onViewLiteraryDevices}
                >
                  <Text style={styles.menuItemText}>Literary Devices</Text>
                </TouchableOpacity>
              )}
              
              {onViewKnowledgeGraph && (
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={onViewKnowledgeGraph}
                >
                  <Text style={styles.menuItemText}>Knowledge Graph</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Import</Text>
            <TouchableOpacity style={styles.menuItem} onPress={onImportBook}>
              <Text style={styles.menuItemText}>Import Book</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    zIndex: 1000,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 280,
    backgroundColor: 'white',
    zIndex: 1001,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
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
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  activeMenuItem: {
    backgroundColor: '#e1f0fa',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  activeMenuItemText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
});

export default Sidebar;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Branch } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
  onCreateNew: () => void;
  currentView: string;
  onEdit?: () => void;
  onPlan?: () => void;
  onBackToLibrary: () => void;
  onBackToBookInfo?: () => void;
  onBackToChapters?: () => void;
  onBackToChapterPages?: () => void;
  branches?: Branch[];
  onSelectBranch?: (branch: Branch) => void;
  activeBranchId?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onImport,
  onCreateNew,
  currentView,
  onEdit,
  onPlan,
  onBackToLibrary,
  onBackToBookInfo,
  onBackToChapters,
  onBackToChapterPages,
  branches = [],
  onSelectBranch,
  activeBranchId
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
        
        <ScrollView style={styles.content}>
          {/* Create New Book */}
          <TouchableOpacity style={styles.menuItem} onPress={onCreateNew}>
            <Text style={styles.menuItemText}>Create New Book</Text>
          </TouchableOpacity>
          
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
          
          {/* Plan Novel - only in book info view */}
          {onPlan && currentView === 'bookInfo' && (
            <TouchableOpacity style={styles.menuItem} onPress={onPlan}>
              <Text style={styles.menuItemText}>Plan Novel</Text>
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
          
          {/* Story Branches - only in reader view */}
          {currentView === 'reader' && branches.length > 0 && (
            <View style={styles.branchesSection}>
              <Text style={styles.branchesSectionTitle}>Story Branches</Text>
              
              {/* Main Timeline option */}
              <TouchableOpacity 
                style={[
                  styles.branchItem, 
                  !activeBranchId && styles.activeBranchItem
                ]} 
                onPress={() => onSelectBranch && onSelectBranch({
                  id: '',
                  name: 'Main Timeline',
                  branchPointPageIndex: 0,
                  content: []
                })}
              >
                <Text style={styles.branchItemText}>Main Timeline</Text>
              </TouchableOpacity>
              
              {/* Branch options */}
              {branches.map(branch => (
                <TouchableOpacity 
                  key={branch.id}
                  style={[
                    styles.branchItem, 
                    branch.id === activeBranchId && styles.activeBranchItem
                  ]} 
                  onPress={() => onSelectBranch && onSelectBranch(branch)}
                >
                  <Text style={styles.branchItemText}>{branch.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
    flex: 1,
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
  },
  branchesSection: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  branchesSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  branchItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  activeBranchItem: {
    backgroundColor: '#3498db',
  },
  branchItemText: {
    fontSize: 14,
    color: '#333',
  },
});

export default Sidebar;

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Branch } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: () => void;
  onCreateNew: () => void;
  currentView: string;
  onEdit?: () => void;
  onPlan?: () => void;
  onViewLiteraryDevices?: () => void;
  onBackToLibrary: () => void;
  onBackToBookInfo?: () => void;
  onBackToChapters?: () => void;
  onBackToChapterPages?: () => void;
  branches: Branch[];
  onSelectBranch: (branch: Branch) => void;
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
  onViewLiteraryDevices,
  onBackToLibrary,
  onBackToBookInfo,
  onBackToChapters,
  onBackToChapterPages,
  branches,
  onSelectBranch,
  activeBranchId
}) => {
  if (!isOpen) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={onBackToLibrary}>
            <Text style={styles.menuItemText}>Library</Text>
          </TouchableOpacity>
          
          {onBackToBookInfo && (
            <TouchableOpacity style={styles.menuItem} onPress={onBackToBookInfo}>
              <Text style={styles.menuItemText}>Book Info</Text>
            </TouchableOpacity>
          )}
          
          {onBackToChapters && (
            <TouchableOpacity style={styles.menuItem} onPress={onBackToChapters}>
              <Text style={styles.menuItemText}>Chapters</Text>
            </TouchableOpacity>
          )}
          
          {onBackToChapterPages && (
            <TouchableOpacity style={styles.menuItem} onPress={onBackToChapterPages}>
              <Text style={styles.menuItemText}>Chapter Pages</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          
          <TouchableOpacity style={styles.menuItem} onPress={onImport}>
            <Text style={styles.menuItemText}>Import Book</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} onPress={onCreateNew}>
            <Text style={styles.menuItemText}>Create New Book</Text>
          </TouchableOpacity>
          
          {onEdit && (
            <TouchableOpacity style={styles.menuItem} onPress={onEdit}>
              <Text style={styles.menuItemText}>Edit Content</Text>
            </TouchableOpacity>
          )}
          
          {onPlan && (
            <TouchableOpacity style={styles.menuItem} onPress={onPlan}>
              <Text style={styles.menuItemText}>Novel Planning</Text>
            </TouchableOpacity>
          )}
          
          {onViewLiteraryDevices && (
            <TouchableOpacity style={styles.menuItem} onPress={onViewLiteraryDevices}>
              <Text style={styles.menuItemText}>Literary Devices</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {branches.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Story Branches</Text>
            
            {branches.map(branch => (
              <TouchableOpacity 
                key={branch.id} 
                style={[
                  styles.menuItem, 
                  branch.id === activeBranchId && styles.activeMenuItem
                ]} 
                onPress={() => onSelectBranch(branch)}
              >
                <Text style={[
                  styles.menuItemText,
                  branch.id === activeBranchId && styles.activeMenuItemText
                ]}>
                  {branch.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    backgroundColor: 'white',
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activeMenuItem: {
    backgroundColor: '#e1f5fe',
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  activeMenuItemText: {
    fontWeight: 'bold',
    color: '#3498db',
  },
});

export default Sidebar;

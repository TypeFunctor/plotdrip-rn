import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
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
  const [animation] = useState(new Animated.Value(0));
  const screenWidth = Dimensions.get('window').width;
  const sidebarWidth = 280;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [sidebarWidth, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  const handleMenuItemPress = (action: () => void) => {
    action();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.overlay, { opacity }]} />
      </TouchableWithoutFeedback>
      
      {/* Sidebar */}
      <Animated.View 
        style={[
          styles.sidebar, 
          { transform: [{ translateX }] }
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Menu</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} bounces={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Navigation</Text>
            
            <TouchableOpacity 
              style={[styles.menuItem, currentView === 'library' && styles.activeMenuItem]} 
              onPress={() => handleMenuItemPress(onBackToLibrary)}
            >
              <Text style={[styles.menuItemText, currentView === 'library' && styles.activeMenuItemText]}>Library</Text>
            </TouchableOpacity>
            
            {onBackToBookInfo && (
              <TouchableOpacity 
                style={[styles.menuItem, currentView === 'bookInfo' && styles.activeMenuItem]} 
                onPress={() => handleMenuItemPress(onBackToBookInfo)}
              >
                <Text style={[styles.menuItemText, currentView === 'bookInfo' && styles.activeMenuItemText]}>Book Info</Text>
              </TouchableOpacity>
            )}
            
            {onBackToChapters && (
              <TouchableOpacity 
                style={[styles.menuItem, currentView === 'chapters' && styles.activeMenuItem]} 
                onPress={() => handleMenuItemPress(onBackToChapters)}
              >
                <Text style={[styles.menuItemText, currentView === 'chapters' && styles.activeMenuItemText]}>Chapters</Text>
              </TouchableOpacity>
            )}
            
            {onBackToChapterPages && (
              <TouchableOpacity 
                style={[styles.menuItem, currentView === 'chapterPages' && styles.activeMenuItem]} 
                onPress={() => handleMenuItemPress(onBackToChapterPages)}
              >
                <Text style={[styles.menuItemText, currentView === 'chapterPages' && styles.activeMenuItemText]}>Chapter Pages</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actions</Text>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleMenuItemPress(onImport)}
            >
              <Text style={styles.menuItemText}>Import Book</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => handleMenuItemPress(onCreateNew)}
            >
              <Text style={styles.menuItemText}>Create New Book</Text>
            </TouchableOpacity>
            
            {onEdit && (
              <TouchableOpacity 
                style={[styles.menuItem, currentView === 'editor' && styles.activeMenuItem]} 
                onPress={() => handleMenuItemPress(onEdit)}
              >
                <Text style={[styles.menuItemText, currentView === 'editor' && styles.activeMenuItemText]}>Edit Content</Text>
              </TouchableOpacity>
            )}
            
            {onPlan && (
              <TouchableOpacity 
                style={[styles.menuItem, currentView === 'planner' && styles.activeMenuItem]} 
                onPress={() => handleMenuItemPress(onPlan)}
              >
                <Text style={[styles.menuItemText, currentView === 'planner' && styles.activeMenuItemText]}>Novel Planning</Text>
              </TouchableOpacity>
            )}
            
            {onViewLiteraryDevices && (
              <TouchableOpacity 
                style={[styles.menuItem, currentView === 'literaryDevices' && styles.activeMenuItem]} 
                onPress={() => handleMenuItemPress(onViewLiteraryDevices)}
              >
                <Text style={[styles.menuItemText, currentView === 'literaryDevices' && styles.activeMenuItemText]}>Literary Devices</Text>
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
                  onPress={() => handleMenuItemPress(() => onSelectBranch(branch))}
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
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 1001,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 280,
    height: '100%',
    backgroundColor: 'white',
    zIndex: 1002,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 10,
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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Book, Chapter, LiteraryDevice, LiteraryDevicesByChapter, LiteraryDeviceCategory } from '../types';
import { sendLLMRequest } from '../utils/llmService';

interface LiteraryDevicesListProps {
  book: Book;
  onBackToBookInfo: () => void;
}

const LiteraryDevicesList: React.FC<LiteraryDevicesListProps> = ({ book, onBackToBookInfo }) => {
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});
  const [expandedDevices, setExpandedDevices] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<LiteraryDeviceCategory | 'all'>('all');
  
  // Initialize with first chapter expanded if there are literary devices
  useEffect(() => {
    if (book.chapters && book.chapters.length > 0) {
      const firstChapterId = book.chapters[0].id;
      setExpandedChapters({ [firstChapterId]: true });
    }
  }, [book.chapters]);
  
  const toggleChapter = (chapterId: string) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };
  
  const toggleDevice = (deviceId: string) => {
    setExpandedDevices(prev => ({
      ...prev,
      [deviceId]: !prev[deviceId]
    }));
  };
  
  const analyzeChapter = async (chapter: Chapter) => {
    if (isLoading[chapter.id]) return;
    
    setIsLoading(prev => ({ ...prev, [chapter.id]: true }));
    setError(null);
    
    try {
      const response = await sendLLMRequest({
        type: 'literary_device_analysis',
        book,
        context: chapter.id
      });
      
      if (response.success) {
        // Update the book with new literary devices
        const result = response.content;
        
        // Create or update the literary devices for this chapter
        const updatedDevicesByChapter = [...(book.literaryDevices || [])];
        
        // Find if this chapter already has devices
        const existingIndex = updatedDevicesByChapter.findIndex(
          item => item.chapterId === chapter.id
        );
        
        if (existingIndex >= 0) {
          // Update existing devices
          updatedDevicesByChapter[existingIndex] = {
            chapterId: chapter.id,
            devices: result.devices
          };
        } else {
          // Add new devices
          updatedDevicesByChapter.push({
            chapterId: chapter.id,
            devices: result.devices
          });
        }
        
        // Update the book (this would typically be done via a callback to parent)
        if (book.onUpdate) {
          book.onUpdate({
            ...book,
            literaryDevices: updatedDevicesByChapter
          });
        }
        
        // Expand this chapter to show the new devices
        setExpandedChapters(prev => ({ ...prev, [chapter.id]: true }));
      } else {
        setError(response.error || 'Failed to analyze chapter');
      }
    } catch (err) {
      setError('An error occurred while analyzing the chapter');
    } finally {
      setIsLoading(prev => ({ ...prev, [chapter.id]: false }));
    }
  };
  
  // Get literary devices for a specific chapter
  const getDevicesForChapter = (chapterId: string): LiteraryDevice[] => {
    if (!book.literaryDevices) return [];
    
    const chapterDevices = book.literaryDevices.find(item => item.chapterId === chapterId);
    if (!chapterDevices) return [];
    
    // Filter by active category if not 'all'
    if (activeCategory !== 'all') {
      return chapterDevices.devices.filter(device => device.category === activeCategory);
    }
    
    return chapterDevices.devices;
  };
  
  // Get character name by ID
  const getCharacterName = (characterId: string): string => {
    const character = book.characters?.find(c => c.id === characterId);
    return character ? character.name : 'Unknown Character';
  };
  
  // Get setting name by ID
  const getSettingName = (settingId: string): string => {
    const setting = book.settings?.find(s => s.id === settingId);
    return setting ? setting.name : 'Unknown Setting';
  };
  
  // Get event title by ID
  const getEventTitle = (eventId: string): string => {
    const event = book.events?.find(e => e.id === eventId);
    return event ? event.title : 'Unknown Event';
  };
  
  // Format device type for display
  const formatDeviceType = (type: string): string => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Format category for display
  const formatCategory = (category: string): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Get color for category
  const getCategoryColor = (category: LiteraryDeviceCategory): string => {
    const colors: Record<LiteraryDeviceCategory, string> = {
      'character': '#e74c3c',
      'plot': '#3498db',
      'setting': '#2ecc71',
      'perspective': '#9b59b6',
      'figurative_language': '#f39c12',
      'structure': '#1abc9c'
    };
    
    return colors[category] || '#95a5a6';
  };
  
  // Count devices by category
  const countDevicesByCategory = (): Record<LiteraryDeviceCategory | 'all', number> => {
    const counts: Record<LiteraryDeviceCategory | 'all', number> = {
      'all': 0,
      'character': 0,
      'plot': 0,
      'setting': 0,
      'perspective': 0,
      'figurative_language': 0,
      'structure': 0
    };
    
    if (!book.literaryDevices) return counts;
    
    book.literaryDevices.forEach(chapter => {
      chapter.devices.forEach(device => {
        counts[device.category]++;
        counts['all']++;
      });
    });
    
    return counts;
  };
  
  const deviceCounts = countDevicesByCategory();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Literary Devices by Chapter</Text>
      
      <View style={styles.categoryFilters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScrollView}>
          <TouchableOpacity 
            style={[
              styles.categoryButton, 
              activeCategory === 'all' && styles.activeCategoryButton
            ]} 
            onPress={() => setActiveCategory('all')}
          >
            <Text style={[
              styles.categoryButtonText, 
              activeCategory === 'all' && styles.activeCategoryButtonText
            ]}>
              All ({deviceCounts['all']})
            </Text>
          </TouchableOpacity>
          
          {Object.keys(deviceCounts).filter(key => key !== 'all').map((category) => (
            <TouchableOpacity 
              key={category}
              style={[
                styles.categoryButton, 
                activeCategory === category && styles.activeCategoryButton,
                { borderColor: getCategoryColor(category as LiteraryDeviceCategory) }
              ]} 
              onPress={() => setActiveCategory(category as LiteraryDeviceCategory)}
            >
              <Text style={[
                styles.categoryButtonText, 
                activeCategory === category && styles.activeCategoryButtonText,
                { color: activeCategory === category ? 'white' : getCategoryColor(category as LiteraryDeviceCategory) }
              ]}>
                {formatCategory(category)} ({deviceCounts[category as LiteraryDeviceCategory]})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {book.chapters && book.chapters.length > 0 ? (
          book.chapters.map(chapter => {
            const devices = getDevicesForChapter(chapter.id);
            const hasDevices = devices.length > 0;
            const isExpanded = expandedChapters[chapter.id];
            
            return (
              <View key={chapter.id} style={styles.chapterContainer}>
                <TouchableOpacity 
                  style={styles.chapterHeader} 
                  onPress={() => toggleChapter(chapter.id)}
                >
                  <View style={styles.chapterTitleContainer}>
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                    <Text style={styles.deviceCount}>
                      {hasDevices ? `${devices.length} device${devices.length !== 1 ? 's' : ''}` : 'No devices'}
                    </Text>
                  </View>
                  <Text style={styles.expandIcon}>{isExpanded ? '▼' : '►'}</Text>
                </TouchableOpacity>
                
                {isExpanded && (
                  <View style={styles.chapterContent}>
                    {hasDevices ? (
                      devices.map(device => {
                        const isDeviceExpanded = expandedDevices[device.id];
                        
                        return (
                          <View key={device.id} style={styles.deviceContainer}>
                            <TouchableOpacity 
                              style={[
                                styles.deviceHeader,
                                { backgroundColor: `${getCategoryColor(device.category)}20` }
                              ]} 
                              onPress={() => toggleDevice(device.id)}
                            >
                              <View style={styles.deviceTitleContainer}>
                                <View style={styles.deviceTypeRow}>
                                  <View style={[
                                    styles.categoryIndicator,
                                    { backgroundColor: getCategoryColor(device.category) }
                                  ]} />
                                  <Text style={styles.deviceCategory}>
                                    {formatCategory(device.category)}
                                  </Text>
                                </View>
                                <Text style={styles.deviceType}>
                                  {formatDeviceType(device.type)}
                                </Text>
                              </View>
                              <Text style={styles.expandIcon}>{isDeviceExpanded ? '▼' : '►'}</Text>
                            </TouchableOpacity>
                            
                            {isDeviceExpanded && (
                              <View style={styles.deviceContent}>
                                <Text style={styles.deviceDescription}>{device.description}</Text>
                                
                                {device.excerpt && (
                                  <View style={styles.excerptContainer}>
                                    <Text style={styles.excerptLabel}>Excerpt:</Text>
                                    <Text style={styles.excerpt}>{device.excerpt}</Text>
                                  </View>
                                )}
                                
                                {device.impact && (
                                  <View style={styles.impactContainer}>
                                    <Text style={styles.impactLabel}>Impact:</Text>
                                    <Text style={styles.impact}>{device.impact}</Text>
                                  </View>
                                )}
                                
                                {device.characters && device.characters.length > 0 && (
                                  <View style={styles.relatedElementsContainer}>
                                    <Text style={styles.relatedElementsLabel}>Characters Involved:</Text>
                                    <Text style={styles.relatedElements}>
                                      {device.characters.map(getCharacterName).join(', ')}
                                    </Text>
                                  </View>
                                )}
                                
                                {device.settings && device.settings.length > 0 && (
                                  <View style={styles.relatedElementsContainer}>
                                    <Text style={styles.relatedElementsLabel}>Settings Involved:</Text>
                                    <Text style={styles.relatedElements}>
                                      {device.settings.map(getSettingName).join(', ')}
                                    </Text>
                                  </View>
                                )}
                                
                                {device.events && device.events.length > 0 && (
                                  <View style={styles.relatedElementsContainer}>
                                    <Text style={styles.relatedElementsLabel}>Related Events:</Text>
                                    <Text style={styles.relatedElements}>
                                      {device.events.map(getEventTitle).join(', ')}
                                    </Text>
                                  </View>
                                )}
                                
                                {device.pageIndex !== undefined && (
                                  <Text style={styles.pageIndex}>
                                    Found on page {device.pageIndex + 1}
                                  </Text>
                                )}
                              </View>
                            )}
                          </View>
                        );
                      })
                    ) : (
                      <View style={styles.noDevicesContainer}>
                        <Text style={styles.noDevicesText}>No literary devices analyzed for this chapter yet.</Text>
                        <TouchableOpacity 
                          style={styles.analyzeButton}
                          onPress={() => analyzeChapter(chapter)}
                          disabled={isLoading[chapter.id]}
                        >
                          <Text style={styles.analyzeButtonText}>
                            {isLoading[chapter.id] ? 'Analyzing...' : 'Analyze Chapter'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No chapters found</Text>
            <Text style={styles.emptyStateSubtext}>This book doesn't have any chapters defined.</Text>
          </View>
        )}
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={onBackToBookInfo}>
          <Text style={styles.footerButtonText}>Back to Book Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryFilters: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
  },
  categoryScrollView: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  activeCategoryButton: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeCategoryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  chapterContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3498db',
  },
  chapterTitleContainer: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  deviceCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  expandIcon: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  chapterContent: {
    padding: 16,
  },
  deviceContainer: {
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  deviceTitleContainer: {
    flex: 1,
  },
  deviceTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  deviceCategory: {
    fontSize: 12,
    color: '#666',
  },
  deviceType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  deviceContent: {
    padding: 12,
  },
  deviceDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  excerptContainer: {
    marginBottom: 8,
  },
  excerptLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  excerpt: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  impactContainer: {
    marginBottom: 8,
  },
  impactLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  impact: {
    fontSize: 14,
    color: '#333',
  },
  relatedElementsContainer: {
    marginBottom: 8,
  },
  relatedElementsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  relatedElements: {
    fontSize: 14,
    color: '#333',
  },
  pageIndex: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  noDevicesContainer: {
    alignItems: 'center',
    padding: 16,
  },
  noDevicesText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  analyzeButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  analyzeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'white',
  },
  footerButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  footerButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LiteraryDevicesList;

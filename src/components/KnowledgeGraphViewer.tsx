import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Book, Character, Event, Setting, Relationship, Chapter } from '../types';
// Import directly from node_modules with explicit path
import { DataSet } from 'vis-data/standalone';
import { Network } from 'vis-network/standalone';

interface KnowledgeGraphViewerProps {
  book: Book;
  height?: number;
  width?: number;
  isInteractive?: boolean;
  showChapterProgression?: boolean;
}

const KnowledgeGraphViewer: React.FC<KnowledgeGraphViewerProps> = ({ 
  book, 
  height = 300, 
  width = '100%',
  isInteractive = true,
  showChapterProgression = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create nodes
    const nodes = new DataSet([]);
    const edges = new DataSet([]);
    
    // Get chapters for positioning
    const chapters = book.chapters || [];
    const chapterMap = new Map<string, Chapter>();
    chapters.forEach(chapter => {
      chapterMap.set(chapter.id, chapter);
    });
    
    // Calculate horizontal positions based on chapters
    const calculateHorizontalPosition = (chapterId?: string, positionInChapter: number = 0) => {
      if (!chapterId || !chapterMap.has(chapterId)) {
        return { x: 0, level: 0 };
      }
      
      const chapter = chapterMap.get(chapterId)!;
      const chapterIndex = chapters.findIndex(c => c.id === chapterId);
      
      // Base x position on chapter index (left to right progression)
      const x = (chapterIndex + 1) * 300; // 300px spacing between chapters
      
      // Level is based on position within chapter
      const level = chapter.pageIndex + positionInChapter;
      
      return { x, level };
    };
    
    // Add book node (central)
    nodes.add({ 
      id: 'book', 
      label: book.title,
      shape: 'box',
      color: {
        background: '#3498db',
        border: '#2980b9',
        highlight: { background: '#2980b9', border: '#1c6ea4' }
      },
      font: { color: 'white' },
      size: 25,
      fixed: { x: true, y: true }
    });
    
    // Add chapter nodes if showing chapter progression
    if (showChapterProgression && chapters.length > 0) {
      chapters.forEach((chapter, index) => {
        const x = (index + 1) * 300;
        nodes.add({
          id: `chapter_${chapter.id}`,
          label: chapter.title,
          shape: 'box',
          color: {
            background: '#34495e',
            border: '#2c3e50',
            highlight: { background: '#2c3e50', border: '#1a252f' }
          },
          font: { color: 'white' },
          x: x,
          y: -200, // Position chapters at the top
          fixed: { x: true, y: true }
        });
        
        // Connect book to chapter
        edges.add({
          from: 'book',
          to: `chapter_${chapter.id}`,
          color: { color: '#34495e', highlight: '#2c3e50' },
          width: 2,
          dashes: true
        });
      });
    }
    
    // Character nodes
    if (book.characters && book.characters.length > 0) {
      book.characters.forEach(character => {
        // Calculate position based on chapter
        const { x, level } = calculateHorizontalPosition(character.chapterId);
        
        const nodeOptions: any = {
          id: character.id,
          label: character.name,
          title: character.description || character.name,
          group: 'characters',
          shape: 'dot',
          color: {
            background: '#e74c3c',
            border: '#c0392b',
            highlight: { background: '#c0392b', border: '#a93226' }
          }
        };
        
        // If showing chapter progression and we have chapter info, position horizontally
        if (showChapterProgression && character.chapterId) {
          nodeOptions.x = x;
          nodeOptions.y = level * 20; // Spread vertically based on page index
          
          // Connect to chapter
          edges.add({
            from: `chapter_${character.chapterId}`,
            to: character.id,
            color: { color: '#e74c3c', highlight: '#c0392b' },
            width: 1,
            dashes: true
          });
        }
        
        nodes.add(nodeOptions);
        
        // Connect to book if not showing chapter progression
        if (!showChapterProgression) {
          edges.add({
            from: 'book',
            to: character.id,
            color: { color: '#e74c3c', highlight: '#c0392b' },
            width: 2,
            title: 'Character'
          });
        }
      });
    }
    
    // Event nodes
    if (book.events && book.events.length > 0) {
      book.events.forEach(event => {
        // Calculate position based on chapter
        const { x, level } = calculateHorizontalPosition(event.chapterId, event.chapterPosition);
        
        const nodeOptions: any = {
          id: event.id,
          label: event.title,
          title: event.description || event.title,
          group: 'events',
          shape: 'diamond',
          color: {
            background: '#f39c12',
            border: '#d35400',
            highlight: { background: '#d35400', border: '#a04000' }
          }
        };
        
        // If showing chapter progression and we have chapter info, position horizontally
        if (showChapterProgression && event.chapterId) {
          nodeOptions.x = x;
          nodeOptions.y = level * 20; // Spread vertically based on page index
          
          // Connect to chapter
          edges.add({
            from: `chapter_${event.chapterId}`,
            to: event.id,
            color: { color: '#f39c12', highlight: '#d35400' },
            width: 1,
            dashes: true
          });
        }
        
        nodes.add(nodeOptions);
        
        // Connect to book if not showing chapter progression
        if (!showChapterProgression) {
          edges.add({
            from: 'book',
            to: event.id,
            color: { color: '#f39c12', highlight: '#d35400' },
            width: 2,
            title: 'Event'
          });
        }
      });
    }
    
    // Setting nodes
    if (book.settings && book.settings.length > 0) {
      book.settings.forEach(setting => {
        // Calculate position based on chapter
        const { x, level } = calculateHorizontalPosition(setting.chapterId);
        
        const nodeOptions: any = {
          id: setting.id,
          label: setting.name,
          title: setting.description || setting.name,
          group: 'settings',
          shape: 'triangle',
          color: {
            background: '#2ecc71',
            border: '#27ae60',
            highlight: { background: '#27ae60', border: '#1e8449' }
          }
        };
        
        // If showing chapter progression and we have chapter info, position horizontally
        if (showChapterProgression && setting.chapterId) {
          nodeOptions.x = x;
          nodeOptions.y = level * 20; // Spread vertically based on page index
          
          // Connect to chapter
          edges.add({
            from: `chapter_${setting.chapterId}`,
            to: setting.id,
            color: { color: '#2ecc71', highlight: '#27ae60' },
            width: 1,
            dashes: true
          });
        }
        
        nodes.add(nodeOptions);
        
        // Connect to book if not showing chapter progression
        if (!showChapterProgression) {
          edges.add({
            from: 'book',
            to: setting.id,
            color: { color: '#2ecc71', highlight: '#27ae60' },
            width: 2,
            title: 'Setting'
          });
        }
      });
    }
    
    // Connect characters to events they're involved in
    if (book.events) {
      book.events
        .filter(event => event.characters && event.characters.length > 0)
        .forEach(event => 
          (event.characters || []).forEach(characterId => {
            edges.add({
              from: characterId,
              to: event.id,
              color: { color: '#9b59b6', highlight: '#8e44ad' },
              width: 1,
              dashes: true,
              title: 'Involved in'
            });
          })
        );
    }
    
    // Connect events to settings
    if (book.events) {
      book.events
        .filter(event => event.setting)
        .forEach(event => {
          edges.add({
            from: event.id,
            to: event.setting!,
            color: { color: '#1abc9c', highlight: '#16a085' },
            width: 1,
            dashes: true,
            title: 'Takes place in'
          });
        });
    }
    
    // Connect relationships between characters
    if (book.relationships) {
      book.relationships.forEach(relationship => {
        if (relationship.characters.length !== 2) return;
        
        // Calculate position based on chapter
        const { x, level } = calculateHorizontalPosition(relationship.chapterId);
        
        // For relationships, we might create a node to represent the relationship
        if (showChapterProgression && relationship.chapterId) {
          const relationshipNodeId = `rel_${relationship.id}`;
          
          // Add relationship node
          nodes.add({
            id: relationshipNodeId,
            label: relationship.type,
            title: relationship.description || relationship.type,
            shape: 'hexagon',
            color: {
              background: '#9b59b6',
              border: '#8e44ad',
              highlight: { background: '#8e44ad', border: '#6c3483' }
            },
            x: x,
            y: level * 20
          });
          
          // Connect to chapter
          edges.add({
            from: `chapter_${relationship.chapterId}`,
            to: relationshipNodeId,
            color: { color: '#9b59b6', highlight: '#8e44ad' },
            width: 1,
            dashes: true
          });
          
          // Connect characters to relationship node
          relationship.characters.forEach(charId => {
            edges.add({
              from: charId,
              to: relationshipNodeId,
              color: { color: '#9b59b6', highlight: '#8e44ad' },
              width: 1,
              title: relationship.type
            });
          });
        } else {
          // Direct connection between characters
          edges.add({
            from: relationship.characters[0],
            to: relationship.characters[1],
            color: { color: '#3498db', highlight: '#2980b9' },
            width: 2,
            title: relationship.type,
            label: relationship.type
          });
        }
      });
    }
    
    // Configure network options
    const options = {
      nodes: {
        borderWidth: 2,
        shadow: true,
        font: { size: 12 }
      },
      edges: {
        smooth: { type: 'continuous' },
        shadow: true,
        arrows: {
          to: { enabled: false },
          from: { enabled: false }
        }
      },
      physics: {
        enabled: !showChapterProgression, // Disable physics if showing chapter progression
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 150,
          springConstant: 0.04,
          damping: 0.09
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 100,
          fit: true
        }
      },
      interaction: {
        dragNodes: isInteractive,
        dragView: isInteractive,
        zoomView: isInteractive,
        selectable: isInteractive,
        hover: true
      },
      layout: {
        improvedLayout: true,
        hierarchical: {
          enabled: false
        }
      },
      groups: {
        characters: {
          shape: 'dot',
          color: {
            background: '#e74c3c',
            border: '#c0392b',
            highlight: { background: '#c0392b', border: '#a93226' }
          }
        },
        events: {
          shape: 'diamond',
          color: {
            background: '#f39c12',
            border: '#d35400',
            highlight: { background: '#d35400', border: '#a04000' }
          }
        },
        settings: {
          shape: 'triangle',
          color: {
            background: '#2ecc71',
            border: '#27ae60',
            highlight: { background: '#27ae60', border: '#1e8449' }
          }
        }
      }
    };
    
    // Create network
    networkRef.current = new Network(
      containerRef.current,
      { nodes, edges },
      options
    );
    
    // Center on the book node
    networkRef.current.once('stabilizationIterationsDone', () => {
      networkRef.current?.focus('book', {
        scale: 1.2,
        animation: true
      });
    });
    
    // Clean up on unmount
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [book, isInteractive, showChapterProgression]);
  
  return (
    <View style={[styles.container, { height, width }]}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden'
  }
});

export default KnowledgeGraphViewer;

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Book, Character, Event, Setting, Relationship } from '../types';
// Import directly from node_modules with explicit path
import { DataSet } from 'vis-data/standalone';
import { Network } from 'vis-network/standalone';

interface KnowledgeGraphViewerProps {
  book: Book;
  height?: number;
  width?: number;
  isInteractive?: boolean;
}

const KnowledgeGraphViewer: React.FC<KnowledgeGraphViewerProps> = ({ 
  book, 
  height = 300, 
  width = '100%',
  isInteractive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create nodes
    const nodes = new DataSet([
      // Book node (central)
      { 
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
      },
      
      // Character nodes
      ...(book.characters || []).map(character => ({
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
      })),
      
      // Event nodes
      ...(book.events || []).map(event => ({
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
      })),
      
      // Setting nodes
      ...(book.settings || []).map(setting => ({
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
      }))
    ]);
    
    // Create edges
    const edges = new DataSet([
      // Connect characters to book
      ...(book.characters || []).map(character => ({
        from: 'book',
        to: character.id,
        color: { color: '#e74c3c', highlight: '#c0392b' },
        width: 2,
        title: 'Character'
      })),
      
      // Connect events to book
      ...(book.events || []).map(event => ({
        from: 'book',
        to: event.id,
        color: { color: '#f39c12', highlight: '#d35400' },
        width: 2,
        title: 'Event'
      })),
      
      // Connect settings to book
      ...(book.settings || []).map(setting => ({
        from: 'book',
        to: setting.id,
        color: { color: '#2ecc71', highlight: '#27ae60' },
        width: 2,
        title: 'Setting'
      })),
      
      // Connect characters to events they're involved in
      ...(book.events || [])
        .filter(event => event.characters && event.characters.length > 0)
        .flatMap(event => 
          (event.characters || []).map(characterId => ({
            from: characterId,
            to: event.id,
            color: { color: '#9b59b6', highlight: '#8e44ad' },
            width: 1,
            dashes: true,
            title: 'Involved in'
          }))
        ),
      
      // Connect events to settings
      ...(book.events || [])
        .filter(event => event.setting)
        .map(event => ({
          from: event.id,
          to: event.setting!,
          color: { color: '#1abc9c', highlight: '#16a085' },
          width: 1,
          dashes: true,
          title: 'Takes place in'
        })),
      
      // Connect relationships between characters
      ...(book.relationships || [])
        .flatMap(relationship => {
          if (relationship.characters.length !== 2) return [];
          return [{
            from: relationship.characters[0],
            to: relationship.characters[1],
            color: { color: '#3498db', highlight: '#2980b9' },
            width: 2,
            title: relationship.type,
            label: relationship.type
          }];
        })
    ]);
    
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
        enabled: true,
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
  }, [book, isInteractive]);
  
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

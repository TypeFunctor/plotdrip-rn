import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useDropzone } from 'react-dropzone';
import { processFile } from '../utils/fileImport';
import { Book } from '../types';

interface ImportBooksProps {
  onImport: (book: Book) => void;
  onClose: () => void;
}

const ImportBooks: React.FC<ImportBooksProps> = ({ onImport, onClose }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/plain': ['.txt'],
      'application/epub+zip': ['.epub'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/rtf': ['.rtf']
    },
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      
      setIsProcessing(true);
      setError(null);
      
      try {
        const file = acceptedFiles[0];
        const book = await processFile(file);
        
        if (book) {
          onImport(book);
          onClose();
        } else {
          setError('Failed to process the file. Please try another file.');
        }
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsProcessing(false);
      }
    }
  });
  
  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Import a Book</Text>
          <Text style={styles.modalSubtitle}>
            Supported formats: TXT, EPUB, PDF, DOCX, RTF
          </Text>
          
          <View style={styles.dropzoneContainer}>
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {isProcessing ? (
                <Text style={styles.dropzoneText}>Processing file...</Text>
              ) : isDragActive ? (
                <Text style={styles.dropzoneText}>Drop the file here...</Text>
              ) : (
                <Text style={styles.dropzoneText}>
                  Drag & drop a file here, or click to select a file
                </Text>
              )}
            </div>
          </View>
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxWidth: 500,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  dropzoneContainer: {
    width: '100%',
    marginBottom: 24,
  },
  dropzoneText: {
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 16,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ImportBooks;

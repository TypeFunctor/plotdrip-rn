import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Book } from '../types';
import { deltaToHtml } from '../utils/formatConversion';

interface EditorProps {
  book: Book;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onSave: (updatedBook: Book) => void;
  onCancel?: () => void;
}

const Editor: React.FC<EditorProps> = ({ book, currentPage, setCurrentPage, onSave, onCancel }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isQuillLoaded, setIsQuillLoaded] = useState(false);

  // Load Quill dynamically
  useEffect(() => {
    // Load Quill CSS
    const quillCss = document.createElement('link');
    quillCss.rel = 'stylesheet';
    quillCss.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
    document.head.appendChild(quillCss);

    // Load Quill JS
    const quillScript = document.createElement('script');
    quillScript.src = 'https://cdn.quilljs.com/1.3.6/quill.min.js';
    quillScript.onload = () => setIsQuillLoaded(true);
    document.body.appendChild(quillScript);

    return () => {
      document.head.removeChild(quillCss);
      document.body.removeChild(quillScript);
    };
  }, []);

  // Initialize Quill editor once loaded
  useEffect(() => {
    if (isQuillLoaded && editorRef.current) {
      // @ts-ignore - Quill is loaded dynamically
      quillRef.current = new window.Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });

      // Set initial content
      if (book.deltaContent && book.deltaContent[currentPage]) {
        quillRef.current.setContents(book.deltaContent[currentPage]);
      } else if (book.htmlContent && book.htmlContent[currentPage]) {
        // If we only have HTML, we need to set the HTML content
        editorRef.current.querySelector('.ql-editor')!.innerHTML = book.htmlContent[currentPage];
      } else if (book.content && book.content[currentPage]) {
        // If we only have text, insert it
        quillRef.current.setText(book.content[currentPage]);
      }
    }
  }, [isQuillLoaded, book, currentPage]);

  const handleSave = () => {
    if (!quillRef.current) return;

    // Get the updated delta content
    const updatedDelta = quillRef.current.getContents();
    
    // Convert delta to HTML
    const htmlResult = deltaToHtml(updatedDelta);
    const updatedHtml = htmlResult.success ? htmlResult.content[0] : '';
    
    // Get plain text
    const updatedText = quillRef.current.getText().trim();
    
    // Create updated book with both formats
    const updatedBook = { ...book };
    
    // Update delta content
    if (!updatedBook.deltaContent) {
      updatedBook.deltaContent = [...book.content.map(() => null)];
    }
    updatedBook.deltaContent[currentPage] = updatedDelta;
    
    // Update HTML content
    if (!updatedBook.htmlContent) {
      updatedBook.htmlContent = [...book.content.map(() => '')];
    }
    updatedBook.htmlContent[currentPage] = updatedHtml;
    
    // Update plain text content
    updatedBook.content[currentPage] = updatedText;
    
    // Save the updated book
    onSave(updatedBook);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Editing: {book.title}</Text>
        <Text style={styles.pageInfo}>Page {currentPage + 1}</Text>
      </View>
      
      <View style={styles.editorContainer}>
        {!isQuillLoaded && <Text style={styles.loading}>Loading editor...</Text>}
        <div ref={editorRef} style={{ height: '100%', backgroundColor: 'white' }}></div>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pageInfo: {
    fontSize: 16,
    color: '#666',
  },
  editorContainer: {
    flex: 1,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  loading: {
    padding: 20,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginRight: 16,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Editor;

import { Book } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const sampleBooks: Book[] = [
  {
    id: uuidv4(),
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    coverUrl: 'https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg',
    content: [
      'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
      'However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.',
      '"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"'
    ],
    htmlContent: [
      '<h1>Chapter 1</h1><p>It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.</p>',
      '<h1>Chapter 2</h1><p>However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.</p>',
      '<h1>Chapter 3</h1><p>"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"</p>'
    ],
    deltaContent: [
      {"ops":[{"insert":"Chapter 1\n"},{"insert":"It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\n"}]},
      {"ops":[{"insert":"Chapter 2\n"},{"insert":"However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.\n"}]},
      {"ops":[{"insert":"Chapter 3\n"},{"insert":"\"My dear Mr. Bennet,\" said his lady to him one day, \"have you heard that Netherfield Park is let at last?\"\n"}]}
    ],
    format: 'txt',
    isEditable: true,
    chapters: [
      {
        id: uuidv4(),
        title: 'Chapter 1',
        pageIndex: 0
      },
      {
        id: uuidv4(),
        title: 'Chapter 2',
        pageIndex: 1
      },
      {
        id: uuidv4(),
        title: 'Chapter 3',
        pageIndex: 2
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverUrl: 'https://www.gutenberg.org/cache/epub/64317/pg64317.cover.medium.jpg',
    content: [
      'In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since.',
      '"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world have not had the advantages that you have had."',
      'He did not say any more, but we have always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.'
    ],
    htmlContent: [
      '<h1>Chapter 1</h1><p>In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since.</p>',
      '<h2>A New Day</h2><p>"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world have not had the advantages that you have had."</p>',
      '<h2>Reflections</h2><p>He did not say any more, but we have always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.</p>'
    ],
    deltaContent: [
      {"ops":[{"insert":"Chapter 1\n"},{"insert":"In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since.\n"}]},
      {"ops":[{"insert":"A New Day\n"},{"insert":"\"Whenever you feel like criticizing any one,\" he told me, \"just remember that all the people in this world have not had the advantages that you have had.\"\n"}]},
      {"ops":[{"insert":"Reflections\n"},{"insert":"He did not say any more, but we have always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.\n"}]}
    ],
    format: 'txt',
    isEditable: true,
    chapters: [
      {
        id: uuidv4(),
        title: 'Chapter 1',
        pageIndex: 0
      },
      {
        id: uuidv4(),
        title: 'A New Day',
        pageIndex: 1
      },
      {
        id: uuidv4(),
        title: 'Reflections',
        pageIndex: 2
      }
    ]
  }
];

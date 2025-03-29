import { Book } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Create character IDs for reuse
const prideAndPrejudiceCharacters = {
  elizabeth: uuidv4(),
  darcy: uuidv4(),
  bennet: uuidv4(),
  jane: uuidv4(),
  bingley: uuidv4()
};

const gatsbyCharacters = {
  gatsby: uuidv4(),
  nick: uuidv4(),
  daisy: uuidv4(),
  tom: uuidv4(),
  jordan: uuidv4()
};

const mobyDickCharacters = {
  ishmael: uuidv4(),
  ahab: uuidv4(),
  queequeg: uuidv4(),
  starbuck: uuidv4(),
  moby: uuidv4()
};

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
    ],
    characters: [
      {
        id: prideAndPrejudiceCharacters.elizabeth,
        name: 'Elizabeth Bennet',
        description: 'The second of the five Bennet daughters. She is intelligent and lively, with a strong independent streak.',
        traits: ['intelligent', 'witty', 'prejudiced', 'independent'],
        firstAppearance: 0
      },
      {
        id: prideAndPrejudiceCharacters.darcy,
        name: 'Fitzwilliam Darcy',
        description: 'A wealthy gentleman who initially appears proud and disdainful but reveals a generous and thoughtful nature.',
        traits: ['proud', 'wealthy', 'reserved', 'honorable'],
        firstAppearance: 1
      },
      {
        id: prideAndPrejudiceCharacters.bennet,
        name: 'Mr. Bennet',
        description: 'The patriarch of the Bennet family, known for his sarcastic humor and detachment.',
        traits: ['sarcastic', 'detached', 'intelligent'],
        firstAppearance: 2
      },
      {
        id: prideAndPrejudiceCharacters.jane,
        name: 'Jane Bennet',
        description: 'The eldest and most beautiful Bennet daughter, known for her kindness and optimism.',
        traits: ['beautiful', 'kind', 'optimistic'],
        firstAppearance: 1
      },
      {
        id: prideAndPrejudiceCharacters.bingley,
        name: 'Charles Bingley',
        description: 'A wealthy and amiable gentleman who falls in love with Jane Bennet.',
        traits: ['amiable', 'wealthy', 'good-natured'],
        firstAppearance: 1
      }
    ],
    settings: [
      {
        id: uuidv4(),
        name: 'Longbourn',
        description: 'The Bennet family home, a small estate in Hertfordshire.',
        firstAppearance: 0
      },
      {
        id: uuidv4(),
        name: 'Netherfield Park',
        description: 'A large estate near Longbourn, rented by Mr. Bingley.',
        firstAppearance: 2
      },
      {
        id: uuidv4(),
        name: 'Pemberley',
        description: 'Mr. Darcy\'s grand estate in Derbyshire.',
        firstAppearance: 1
      }
    ],
    events: [
      {
        id: uuidv4(),
        title: 'Netherfield Park is let',
        description: 'News arrives that Netherfield Park has been rented by a wealthy young man, causing excitement among the Bennet family.',
        pageIndex: 2,
        characters: [prideAndPrejudiceCharacters.bennet],
        importance: 'major'
      }
    ],
    relationships: [
      {
        id: uuidv4(),
        type: 'family',
        description: 'Father and daughter relationship',
        characters: [prideAndPrejudiceCharacters.bennet, prideAndPrejudiceCharacters.elizabeth],
        firstMentioned: 0
      },
      {
        id: uuidv4(),
        type: 'romantic',
        description: 'Developing romantic relationship despite initial prejudice and pride',
        characters: [prideAndPrejudiceCharacters.elizabeth, prideAndPrejudiceCharacters.darcy],
        firstMentioned: 1
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
      '\"Whenever you feel like criticizing any one,\" he told me, \"just remember that all the people in this world have not had the advantages that you have had.\"',
      'He did not say any more, but we have always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.'
    ],
    htmlContent: [
      '<h1>Chapter 1</h1><p>In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since.</p>',
      '<h2>A New Day</h2><p>"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world have not had the advantages that you have had."</p>',
      '<h2>Reflections</h2><p>He did not say any more, but we have always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.</p>',
      '<h1>Chapter 2: The Long Journey</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>',
      '<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
      '<p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>',
      '<p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>',
      '<p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>'
    ],
    deltaContent: [
      {"ops":[{"insert":"Chapter 1\n"},{"insert":"In my younger and more vulnerable years my father gave me some advice that I have been turning over in my mind ever since.\n"}]},
      {"ops":[{"insert":"A New Day\n"},{"insert":"\"Whenever you feel like criticizing any one,\" he told me, \"just remember that all the people in this world have not had the advantages that you have had.\"\n"}]},
      {"ops":[{"insert":"Reflections\n"},{"insert":"He did not say any more, but we have always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.\n"}]},
      {"ops":[{"insert":"Chapter 2: The Long Journey\n"},{"insert":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n"}]},
      {"ops":[{"insert":"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n"}]},
      {"ops":[{"insert":"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.\n"}]},
      {"ops":[{"insert":"Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.\n"}]},
      {"ops":[{"insert":"Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.\n"}]}
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
      },
      {
        id: uuidv4(),
        title: 'Chapter 2: The Long Journey',
        pageIndex: 3
      }
    ],
    characters: [
      {
        id: gatsbyCharacters.gatsby,
        name: 'Jay Gatsby',
        description: 'A mysterious and wealthy man known for his lavish parties, who is obsessed with Daisy Buchanan.',
        traits: ['mysterious', 'wealthy', 'obsessive', 'romantic'],
        firstAppearance: 3
      },
      {
        id: gatsbyCharacters.nick,
        name: 'Nick Carraway',
        description: 'The narrator of the story, a young man from the Midwest who moves to New York to learn the bond business.',
        traits: ['observant', 'reserved', 'honest'],
        firstAppearance: 0
      },
      {
        id: gatsbyCharacters.daisy,
        name: 'Daisy Buchanan',
        description: 'A beautiful young woman from a wealthy family, who was once in love with Gatsby.',
        traits: ['beautiful', 'wealthy', 'careless', 'shallow'],
        firstAppearance: 2
      }
    ],
    settings: [
      {
        id: uuidv4(),
        name: 'West Egg',
        description: 'A fictional area of Long Island where the nouveau riche live, including Gatsby and Nick.',
        firstAppearance: 1
      },
      {
        id: uuidv4(),
        name: 'East Egg',
        description: 'A fictional area of Long Island where the old-money aristocracy lives, including the Buchanans.',
        firstAppearance: 2
      }
    ],
    events: [
      {
        id: uuidv4(),
        title: 'Nick moves to West Egg',
        description: 'Nick Carraway moves to West Egg and rents a small house next to Gatsby\'s mansion.',
        pageIndex: 1,
        characters: [gatsbyCharacters.nick],
        importance: 'major'
      }
    ],
    relationships: [
      {
        id: uuidv4(),
        type: 'romantic',
        description: 'Past romance and ongoing obsession',
        characters: [gatsbyCharacters.gatsby, gatsbyCharacters.daisy],
        firstMentioned: 3
      }
    ]
  },
  {
    id: uuidv4(),
    title: 'Moby Dick',
    author: 'Herman Melville',
    coverUrl: 'https://www.gutenberg.org/cache/epub/2701/pg2701.cover.medium.jpg',
    content: [
      'Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.',
      'It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people\'s hats off—then, I account it high time to get to sea as soon as I can.',
      'Chapter 2: The Ship',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.',
      'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
      'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis ornare vel eu leo.',
      'Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
      'Chapter 3: The Voyage',
      'Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.',
      'Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Maecenas sed diam eget risus varius blandit sit amet non magna.',
      'Donec id elit non mi porta gravida at eget metus. Donec sed odio dui. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.'
    ],
    htmlContent: [
      '<h1>Chapter 1: Loomings</h1><p>Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.</p>',
      '<p>It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people\'s hats off—then, I account it high time to get to sea as soon as I can.</p>',
      '<h1>Chapter 2: The Ship</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.</p>',
      '<p>Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>',
      '<p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis ornare vel eu leo.</p>',
      '<p>Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>',
      '<h1>Chapter 3: The Voyage</h1><p>Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.</p>',
      '<p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Maecenas sed diam eget risus varius blandit sit amet non magna.</p>',
      '<p>Donec id elit non mi porta gravida at eget metus. Donec sed odio dui. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.</p>'
    ],
    deltaContent: [
      {"ops":[{"insert":"Chapter 1: Loomings\n"},{"insert":"Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.\n"}]},
      {"ops":[{"insert":"It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people's hats off—then, I account it high time to get to sea as soon as I can.\n"}]},
      {"ops":[{"insert":"Chapter 2: The Ship\n"},{"insert":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.\n"}]},
      {"ops":[{"insert":"Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.\n"}]},
      {"ops":[{"insert":"Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis ornare vel eu leo.\n"}]},
      {"ops":[{"insert":"Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.\n"}]},
      {"ops":[{"insert":"Chapter 3: The Voyage\n"},{"insert":"Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.\n"}]},
      {"ops":[{"insert":"Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Cras mattis consectetur purus sit amet fermentum. Maecenas sed diam eget risus varius blandit sit amet non magna.\n"}]},
      {"ops":[{"insert":"Donec id elit non mi porta gravida at eget metus. Donec sed odio dui. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam.\n"}]}
    ],
    format: 'txt',
    isEditable: true,
    chapters: [
      {
        id: uuidv4(),
        title: 'Chapter 1: Loomings',
        pageIndex: 0
      },
      {
        id: uuidv4(),
        title: 'Chapter 2: The Ship',
        pageIndex: 2
      },
      {
        id: uuidv4(),
        title: 'Chapter 3: The Voyage',
        pageIndex: 6
      }
    ],
    characters: [
      {
        id: mobyDickCharacters.ishmael,
        name: 'Ishmael',
        description: 'The narrator of the story, a sailor who signs up for a whaling voyage on the Pequod.',
        traits: ['observant', 'philosophical', 'experienced'],
        firstAppearance: 0
      },
      {
        id: mobyDickCharacters.ahab,
        name: 'Captain Ahab',
        description: 'The monomaniacal captain of the Pequod, obsessed with hunting the white whale Moby Dick.',
        traits: ['obsessive', 'vengeful', 'determined', 'mad'],
        firstAppearance: 2
      },
      {
        id: mobyDickCharacters.moby,
        name: 'Moby Dick',
        description: 'The great white whale that took Captain Ahab\'s leg in a previous encounter.',
        traits: ['powerful', 'mysterious', 'elusive'],
        firstAppearance: 3
      }
    ],
    settings: [
      {
        id: uuidv4(),
        name: 'The Pequod',
        description: 'The whaling ship on which most of the story takes place.',
        firstAppearance: 2
      },
      {
        id: uuidv4(),
        name: 'The Sea',
        description: 'The vast ocean where the hunt for Moby Dick takes place.',
        firstAppearance: 0
      }
    ],
    events: [
      {
        id: uuidv4(),
        title: 'Ishmael decides to go to sea',
        description: 'Ishmael decides to join a whaling voyage to escape his depression and see the world.',
        pageIndex: 0,
        characters: [mobyDickCharacters.ishmael],
        importance: 'pivotal'
      }
    ],
    relationships: [
      {
        id: uuidv4(),
        type: 'enemy',
        description: 'Obsessive hunt and revenge',
        characters: [mobyDickCharacters.ahab, mobyDickCharacters.moby],
        firstMentioned: 3
      }
    ]
  }
];

// Quick test to debug search functionality
console.log('Testing search functionality...');

// Mock data for testing
const mockBooks = [
  { _id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', language: 'English' },
  { _id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', language: 'English' },
  { _id: '3', title: '1984', author: 'George Orwell', language: 'English' },
  { _id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', language: 'English' },
];

// Test search functionality
const searchTerm = 'gatsby';
const searchTermLower = searchTerm.toLowerCase();

const filteredBooks = mockBooks.filter(book => {
  const titleMatch = book.title && book.title.toLowerCase().includes(searchTermLower);
  const authorMatch = book.author && book.author.toLowerCase().includes(searchTermLower);
  const languageMatch = book.language && book.language.toLowerCase().includes(searchTermLower);
  
  return titleMatch || authorMatch || languageMatch;
});

console.log('Search term:', searchTerm);
console.log('Filtered books:', filteredBooks);
console.log('Number of results:', filteredBooks.length);

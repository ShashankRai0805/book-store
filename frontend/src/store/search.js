import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    filteredBooks: [],
    allBooks: [],
    isSearching: false,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      const query = action.payload.trim();
      state.query = query;
      state.isSearching = query.length > 0;
      
      // Filter books when search is performed (on Enter key press)
      if (query.length > 0) {
        const searchTerm = query.toLowerCase();
        state.filteredBooks = state.allBooks.filter(book => {
          const titleMatch = book.title && book.title.toLowerCase().includes(searchTerm);
          const authorMatch = book.author && book.author.toLowerCase().includes(searchTerm);
          const languageMatch = book.language && book.language.toLowerCase().includes(searchTerm);
          
          return titleMatch || authorMatch || languageMatch;
        });
      } else {
        state.filteredBooks = [];
      }
    },
    setAllBooks: (state, action) => {
      state.allBooks = action.payload || [];
      console.log('All books set in Redux store:', state.allBooks.length);
      
      // If we have a pending search query, run the search now that we have books
      if (state.isSearching && state.query && state.allBooks.length > 0) {
        const searchTerm = state.query.toLowerCase();
        
        state.filteredBooks = state.allBooks.filter(book => {
          if (!book) return false;
          
          const titleMatch = book.title && book.title.toLowerCase().includes(searchTerm);
          const authorMatch = book.author && book.author.toLowerCase().includes(searchTerm);
          const languageMatch = book.language && book.language.toLowerCase().includes(searchTerm);
          
          return titleMatch || authorMatch || languageMatch;
        });
        
        console.log('Re-ran search after books loaded. Filtered books:', state.filteredBooks.length);
      }
    },
    clearSearch: (state) => {
      state.query = '';
      state.filteredBooks = [];
      state.isSearching = false;
    },
    performSearch: (state, action) => {
      const query = action.payload.trim();
      state.query = query;
      
      console.log('Search action dispatched with query:', query);
      console.log('Available books:', state.allBooks.length);
      
      if (query.length > 0) {
        state.isSearching = true;
        
        if (state.allBooks.length > 0) {
          const searchTerm = query.toLowerCase();
          
          state.filteredBooks = state.allBooks.filter(book => {
            if (!book) return false;
            
            const titleMatch = book.title && book.title.toLowerCase().includes(searchTerm);
            const authorMatch = book.author && book.author.toLowerCase().includes(searchTerm);
            const languageMatch = book.language && book.language.toLowerCase().includes(searchTerm);
            
            console.log(`Checking book: ${book.title} - Title match: ${titleMatch}, Author match: ${authorMatch}, Language match: ${languageMatch}`);
            
            return titleMatch || authorMatch || languageMatch;
          });
          
          console.log('Filtered books after search:', state.filteredBooks.length);
          console.log('Filtered books:', state.filteredBooks);
        } else {
          console.log('No books available for search yet - search will be performed when books load');
          state.filteredBooks = [];
        }
      } else {
        state.isSearching = false;
        state.filteredBooks = [];
      }
    },
  },
});

export const { setSearchQuery, setAllBooks, clearSearch, performSearch } = searchSlice.actions;
export default searchSlice.reducer;

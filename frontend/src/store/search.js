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
      
      if (query.length > 0) {
        state.isSearching = true;
        
        if (state.allBooks.length > 0) {
          const searchTerm = query.toLowerCase();
          
          state.filteredBooks = state.allBooks.filter(book => {
            if (!book) return false;
            
            const titleMatch = book.title && book.title.toLowerCase().includes(searchTerm);
            const authorMatch = book.author && book.author.toLowerCase().includes(searchTerm);
            const languageMatch = book.language && book.language.toLowerCase().includes(searchTerm);
            
            return titleMatch || authorMatch || languageMatch;
          });
        } else {
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

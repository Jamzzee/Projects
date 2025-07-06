import { Country } from './Country';

export type BookmarksContextType = {
  bookmarks: Country[];
  toggleBookmark: (country: Country) => void;
  clearBookmarks: () => void;
};

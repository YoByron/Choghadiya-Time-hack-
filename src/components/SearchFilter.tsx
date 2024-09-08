import React from 'react';
import { Input } from '@/components/ui/input';

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filter: string;
  setFilter: (filter: string) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({ searchTerm, setSearchTerm, filter, setFilter }) => {
  return (
    <div className="mb-4 flex items-center">
      <Input
        type="text"
        placeholder="Search periods..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mr-2"
      />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="all">All</option>
        <option value="Good">Good</option>
        <option value="Bad">Bad</option>
        <option value="Neutral">Neutral</option>
      </select>
    </div>
  );
};

export default SearchFilter;
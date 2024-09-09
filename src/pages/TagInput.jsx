import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { XCircleIcon } from 'lucide-react';

const TagInput = ({ allTags, selectedTags, setSelectedTags }) => {
  const [tagInput, setTagInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (tagInput.trim() !== '') {
      const matchedTags = allTags.filter(tag => 
        tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag)
      );
      setSuggestions(matchedTags);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [tagInput, allTags, selectedTags]);

  const handleTagSelection = (tag) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
    setTagInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const removeTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleCloseSuggestions = () => {
    setShowSuggestions(false);
  };

  return (
    <div className="mb-6 relative">
      <Input
        type="text"
        placeholder="Enter tags (e.g., #react #javascript)"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        ref={inputRef}
        className="mb-2 z-20 relative"
      />
      {showSuggestions && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
            onClick={handleCloseSuggestions}
          ></div>
          <div className="absolute z-20 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg">
            <div className="flex justify-between items-center p-2 border-b">
              <span className="font-semibold">Suggestions</span>
              <XCircleIcon 
                className="h-5 w-5 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={handleCloseSuggestions}
              />
            </div>
            {suggestions.map(tag => (
              <div
                key={tag}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleTagSelection(tag)}
              >
                {tag}
              </div>
            ))}
          </div>
        </>
      )}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTags.map(tag => (
          <Button
            key={tag}
            variant="outline"
            size="sm"
            onClick={() => removeTag(tag)}
            className="flex items-center"
          >
            {tag}
            <XCircleIcon className="ml-2 h-4 w-4" />
          </Button>
        ))}
      </div>
      {selectedTags.length > 0 && (
        <p className="text-sm text-gray-600">
          Filtering by: {selectedTags.join(', ')}
        </p>
      )}
    </div>
  );
};

export default TagInput;
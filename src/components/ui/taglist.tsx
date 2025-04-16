import React, { useState } from 'react'; //UseState hook
import './taglist.css'; 

const initialTags = ['React', 'TypeScript', 'CSS', 'JavaScript'];

const TagList: React.FC = () => {
  // search: stores the current text in the search input
  // setSearch: updates the search text
  const [search, setSearch] = useState('');
  // tags: stores the tag list; using state in case you want to make it dynamic later
  const [tags] = useState(initialTags);

  // Filter tags based on what the user types into the search input
  const filteredTags = tags.filter(tag =>
    tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="taglist-container">
      <input
        type="text"
        placeholder="Search tags..."
        value={search}
        onChange={(e) => setSearch(e.target.value)} // Updates the search state as you type
        className="taglist-search"
      />

      <div className="taglist-tags">
        {filteredTags.map((tag, index) => (
          <div key={index} className="taglist-tag">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagList;

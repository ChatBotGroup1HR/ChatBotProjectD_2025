import React, { useState } from 'react'; //UseState hook
import './taglist.css'; 

const initialTags = [
  'GraphQL', 'Next.js', 'Tailwind', 'Python', 'Vue', 'Svelte', 'Docker', 'Kubernetes',
  'Rust', 'GoLang', 'C++', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'SQLAlchemy',
  'Django', 'Flask', 'Swift', 'Kotlin', 'Flutter', 'Firebase', 'Supabase', 'Prisma',
  'Jest', 'Mocha', 'Cypress', 'Jenkins', 'AWS', 'Azure', 'GCP', 'Netlify',
  'Vercel', 'Figma', 'Photoshop', 'Blender', 'Unity', 'Unreal', 'Redux', 'Zustand'
];

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
             <div className="taglist-tag-inner">
              {tag}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagList;
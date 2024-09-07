import React from 'react';

interface CommunityForumProps {
  onClose: () => void;
}

const CommunityForum: React.FC<CommunityForumProps> = ({ onClose }) => {
  // Component implementation
  return (
    <div>
      <h2>Community Forum</h2>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default CommunityForum;
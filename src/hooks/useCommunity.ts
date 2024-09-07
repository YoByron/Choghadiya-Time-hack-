import { useState, useEffect } from 'react';

interface Post {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
}

export const useCommunity = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost = (content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      author: 'Current User', // Replace with actual user data when you have authentication
      timestamp: new Date(),
    };
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const fetchPosts = () => {
    // Implement actual API call here when you have a backend
    // For now, we'll just use some dummy data
    const dummyPosts: Post[] = [
      { id: '1', content: 'Welcome to the community!', author: 'Admin', timestamp: new Date() },
      { id: '2', content: 'How is everyone doing today?', author: 'User1', timestamp: new Date() },
    ];
    setPosts(dummyPosts);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, addPost };
};
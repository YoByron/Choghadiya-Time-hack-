import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface Post {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  likes: number;
}

const CommunityForum: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [username, setUsername] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, you would fetch posts from a backend API
    const mockPosts: Post[] = [
      { id: '1', author: 'AstroEnthusiast', content: 'Just had a great meditation during the Amrit period!', timestamp: new Date(), likes: 5 },
      { id: '2', author: 'ChoghadiyaLearner', content: 'Can someone explain the significance of the Labh period?', timestamp: new Date(), likes: 3 },
    ];
    setPosts(mockPosts);
  }, []);

  const handlePostSubmit = () => {
    if (newPost.trim() && username.trim()) {
      const newPostObj: Post = {
        id: Date.now().toString(),
        author: username,
        content: newPost,
        timestamp: new Date(),
        likes: 0,
      };
      setPosts([newPostObj, ...posts]);
      setNewPost('');
      toast({
        title: "Post Submitted",
        description: "Your post has been added to the forum.",
      });
    } else {
      toast({
        title: "Error",
        description: "Please enter both a username and post content.",
        variant: "destructive",
      });
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Community Forum</h2>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-2"
        />
        <Input
          type="text"
          placeholder="Share your thoughts or ask a question..."
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          className="mb-2"
        />
        <Button onClick={handlePostSubmit}>Post</Button>
      </div>
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <p className="font-bold">{post.author}</p>
            <p>{post.content}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">{post.timestamp.toLocaleString()}</span>
              <Button variant="outline" size="sm" onClick={() => handleLike(post.id)}>
                👍 {post.likes}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityForum;
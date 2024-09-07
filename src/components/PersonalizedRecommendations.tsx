import React, { useState, useEffect } from 'react';
import { useUserPreferences } from '../hooks/useUserPreferences';
import { analyzeUserActivity } from '../utils/activityAnalysis';

interface Recommendation {
  activity: string;
  period: string;
  reason: string;
}

interface PersonalizedRecommendationsProps {
  onClose: () => void;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ onClose }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const { preferences, activities } = useUserPreferences();

  useEffect(() => {
    const userRecommendations = analyzeUserActivity(preferences, activities);
    setRecommendations(userRecommendations);
  }, [preferences, activities]);

  return (
    <div className="recommendations">
      <h2>Personalized Recommendations</h2>
      <ul>
        {recommendations.map((rec, index) => (
          <li key={index}>
            <strong>{rec.activity}:</strong> Best during {rec.period} ({rec.reason})
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default PersonalizedRecommendations;
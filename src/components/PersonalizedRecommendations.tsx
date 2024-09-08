import React from 'react';
import { useVedicAstrology } from '../hooks/useVedicAstrology';

interface PersonalizedRecommendationsProps {
  currentPeriod: {
    name: string;
    effect: string;
    works: string;
  } | null;
  currentDate: Date;
  userPreferences: string[];
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ currentPeriod, currentDate, userPreferences }) => {
  const { planetaryPositions, nakshatras } = useVedicAstrology(currentDate);

  const getRecommendations = () => {
    const recommendations = [];

    if (currentPeriod) {
      if (currentPeriod.effect === 'Good') {
        recommendations.push(`This is a favorable ${currentPeriod.name} period. Consider ${currentPeriod.works}.`);
      } else if (currentPeriod.effect === 'Bad') {
        recommendations.push(`This ${currentPeriod.name} period may be challenging. Avoid ${currentPeriod.works} if possible.`);
      } else {
        recommendations.push(`The current ${currentPeriod.name} period is neutral. ${currentPeriod.works} are neither particularly favored nor discouraged.`);
      }
    } else {
      recommendations.push(`Unable to determine the current Choghadiya period for ${currentDate.toLocaleString()}. Please check your date and time settings.`);
    }

    if (userPreferences.includes('Meditation') && nakshatras.current === 'Pushya') {
      recommendations.push("The current Nakshatra is ideal for meditation practices.");
    }

    if (userPreferences.includes('Business') && planetaryPositions.some(p => p.name === 'Jupiter' && p.sign === 'Libra')) {
      recommendations.push("Jupiter's position is favorable for business negotiations.");
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Personalized Recommendations</h2>
      {recommendations.length > 0 ? (
        <ul className="list-disc pl-5">
          {recommendations.map((rec, index) => (
            <li key={index} className="mb-2">{rec}</li>
          ))}
        </ul>
      ) : (
        <p>No specific recommendations at this time.</p>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;
import React from 'react';

const VedicAstrologyInfo: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Vedic Astrology Information</h2>
      <div className="space-y-4">
        <section>
          <h3 className="text-xl font-semibold mb-2">What is Vedic Astrology?</h3>
          <p>Vedic astrology, also known as Jyotish, is an ancient Indian system of astrology that has been practiced for thousands of years. It is based on the sidereal zodiac and takes into account the precession of the equinoxes.</p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Key Concepts</h3>
          <ul className="list-disc pl-5">
            <li>Nakshatras: 27 lunar mansions or asterisms</li>
            <li>Grahas: 9 celestial bodies including the Sun, Moon, and planets</li>
            <li>Rashis: 12 zodiac signs</li>
            <li>Dashas: Planetary periods</li>
            <li>Yogas: Planetary combinations</li>
          </ul>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">How it Relates to Choghadiya</h3>
          <p>Choghadiya is a Vedic time division system that divides the day and night into 8 parts each. Each part is associated with a particular quality and is considered more or less auspicious for certain activities. The Choghadiya system is often used in conjunction with Vedic astrology to determine the most favorable times for various undertakings.</p>
        </section>
      </div>
    </div>
  );
};

export default VedicAstrologyInfo;
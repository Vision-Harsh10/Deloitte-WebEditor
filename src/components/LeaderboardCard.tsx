import { Trophy, Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Badge {
  name: string;
  icon: 'trophy' | 'award' | 'star';
  color: string;
}

interface LeaderboardCardProps {
  rank: number;
  name: string;
  points: number;
  image: string;
  badges: Badge[];
  activities: number;
  impact: number;
  isEditMode?: boolean;
}

const BadgeIcon = ({ type }: { type: Badge['icon'] }) => {
  switch (type) {
    case 'trophy':
      return <Trophy className="w-4 h-4" />;
    case 'award':
      return <Award className="w-4 h-4" />;
    case 'star':
      return <Star className="w-4 h-4" />;
  }
};

const BadgeModal = ({ badge, onClose }: { badge: Badge; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <motion.div 
        className="bg-white rounded-lg p-8 relative z-10 max-w-sm w-full text-center"
        layoutId={`badge-${badge.name}`}
      >
        <div className={`inline-block p-6 rounded-full mb-4 ${badge.color}`}>
          <BadgeIcon type={badge.icon} />
        </div>
        <h3 className="text-xl font-bold mb-2">{badge.name}</h3>
        <p className="text-gray-600 mb-4">
          Congratulations! You've earned this badge for your exceptional performance.
        </p>
        <button onClick={onClose} className="btn-primary">
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

const LeaderboardCard = ({ rank, name: initialName, points: initialPoints, image, badges, activities, impact, isEditMode = false }: LeaderboardCardProps) => {
  const [name, setName] = useState(initialName);
  const [editingName, setEditingName] = useState(false);
  const [points, setPoints] = useState(initialPoints);
  const [editingPoints, setEditingPoints] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card relative overflow-hidden transition-all duration-300 hover:shadow-xl"
        style={{ '--hover-color': '#f8f9fa' } as React.CSSProperties}
      >
        {rank <= 3 && (
          <div className="absolute top-0 right-0 bg-indigo-secondary text-white px-3 py-1 rounded-bl-lg">
            #{rank}
          </div>
        )}
        
        <div className="flex items-center mb-6">
          <img 
            src={image} 
            alt={name} 
            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-light"
          />
          <div className="ml-4">
            {isEditMode && editingName ? (
              <input
                className="font-semibold text-lg border-b border-blue-400"
                value={name}
                autoFocus
                onChange={e => setName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={e => { if (e.key === 'Enter') setEditingName(false); }}
              />
            ) : (
              <h3
                className={`font-semibold text-lg${isEditMode ? ' cursor-pointer' : ''}`}
                onClick={() => isEditMode && setEditingName(true)}
                tabIndex={isEditMode ? 0 : -1}
                onKeyDown={e => { if (isEditMode && (e.key === 'Enter' || e.key === ' ')) setEditingName(true); }}
              >
                {name}
              </h3>
            )}
            <div className="flex items-center text-indigo-secondary">
              <Trophy className="w-4 h-4 mr-1" />
              {isEditMode && editingPoints ? (
                <input
                  className="ml-1 border-b border-blue-400 w-16"
                  type="number"
                  value={points}
                  autoFocus
                  onChange={e => setPoints(Number(e.target.value))}
                  onBlur={() => setEditingPoints(false)}
                  onKeyDown={e => { if (e.key === 'Enter') setEditingPoints(false); }}
                />
              ) : (
                <span
                  className={isEditMode ? 'ml-1 cursor-pointer' : 'ml-1'}
                  onClick={() => isEditMode && setEditingPoints(true)}
                  tabIndex={isEditMode ? 0 : -1}
                  onKeyDown={e => { if (isEditMode && (e.key === 'Enter' || e.key === ' ')) setEditingPoints(true); }}
                >
                  {points.toLocaleString()} Points
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`flex items-center px-3 py-1 rounded-full text-sm ${badge.color}`}
                onClick={() => setSelectedBadge(badge)}
                layoutId={`badge-${badge.name}`}
              >
                <BadgeIcon type={badge.icon} />
                <span className="ml-1">{badge.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-indigo-light rounded-lg">
              <div className="text-lg font-semibold">{activities}</div>
              <div className="text-sm text-gray-600">Activities</div>
            </div>
            <div className="text-center p-3 bg-indigo-light rounded-lg">
              <div className="text-lg font-semibold">{impact}</div>
              <div className="text-sm text-gray-600">Students Impacted</div>
            </div>
          </div>

          <button className="btn-primary w-full">View Profile</button>
        </div>
      </motion.div>

      {selectedBadge && (
        <BadgeModal 
          badge={selectedBadge} 
          onClose={() => setSelectedBadge(null)} 
        />
      )}
    </>
  );
};

export default LeaderboardCard;
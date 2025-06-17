import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface LeaderboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Leader {
  id: string;
  name: string;
  imageUrl: string;
  points: number;
  badges: string[];
  title: string;
  link: string;
}

const defaultLeaders: Leader[] = [
  {
    id: '1',
    name: "Yash Desai",
    points: 15750,
    imageUrl: "https://d8it4huxumps7.cloudfront.net/uploads/profile/67c0d82bc7e36.png",
    badges: ['Top Performer'],
    title: 'Bharati Vidyapeeth College of Engineering',
    link: 'https://unstop.com/u/yashdesai2007'
  },
  {
    id: '2',
    name: "Sunil Kumar Mehta",
    points: 14200,
    imageUrl: "https://d8it4huxumps7.cloudfront.net/uploads/profile/68174ff0769c6.jpg",
    badges: ['Rising Star'],
    title: 'Lovely Professional University (LPU), Punjab',
    link: 'https://unstop.com/u/sunilmeh6124'
  },
  {
    id: '3',
    name: "Harshavardhan Bajoria",
    points: 13800,
    imageUrl: 'https://d8it4huxumps7.cloudfront.net/uploads/profile/63ca88f851750.jpg',
    badges: ['AI Enthusiast'],
    title: 'Amity University Kolkata',
    link: 'https://unstop.com/u/hvbajoria'
  },
  {
    id: '4',
    name: "Dilip R",
    points: 12500,
    imageUrl: "https://cdrdv2.intel.com/v1/dl/getContent/843764?explicitVersion=true&filename=dilip-r.custom.thumbnail-319-319.png",
    badges: ['Community Builder'],
    title: 'Intel Student Ambassador',
    link: '#'
  },
  {
    id: '5',
    name: "Muskan Goyal",
    points: 11900,
    imageUrl: "https://cdrdv2.intel.com/v1/dl/getContent/843687?explicitVersion=true&filename=MuskanGoyal.custom.thumbnail-319-319.png",
    badges: ['Innovator'],
    title: 'Intel Student Ambassador',
    link: '#'
  },
  {
    id: '6',
    name: "Sai Ethihas Chanda",
    points: 11900,
    imageUrl: "https://cdrdv2.intel.com/v1/dl/getContent/843686?explicitVersion=true&filename=SaiEthihasChanda.custom.thumbnail-319-319.png",
    badges: ['Tech Enthusiast'],
    title: 'Intel Student Ambassador',
    link: '#'
  }
];

const LeaderboardSidebar = ({ isOpen, onClose }: LeaderboardSidebarProps) => {
  const [leaders] = useState<Leader[]>(defaultLeaders);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold" style={{ color: '#032d42' }}>Overall Rankings</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {leaders.map((leader, index) => (
                  <motion.div
                    key={leader.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="w-8 font-bold text-indigo-secondary" style={{ color: "#2b333f" }}>
                      #{index + 1}
                    </div>
                    <img
                      src={leader.imageUrl}
                      alt={leader.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-4 flex-grow">
                      <h3 className="font-semibold">{leader.name}</h3>
                      <p className="text-sm text-gray-600">{leader.points.toLocaleString()} points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LeaderboardSidebar;
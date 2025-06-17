export interface Mentor {
  id: string;
  name: string;
  title: string;
  expertise: string[];
  imageUrl: string;
  description: string;
  link: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  imageUrl: string;
  attendees: number;
  impact: string;
  link: string;
  color?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
  level: string;
  link: string;
}

export interface Lab {
  id: string;
  title: string;
  description: string;
  type: 'virtual' | 'physical';
  imageUrl: string;
  difficulty: string;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: 'Competition' | 'Research' | 'Hackathon' | 'Workshop' | 'Training' | 'Campaign' ;
  location: string;
  deadline: string;
  link: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
}

export interface Article {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  author: string;
  link: string;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  imageUrl: string;
  points: number;
  badges: string[];
  title: string;
}
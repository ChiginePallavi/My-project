import dotenv from 'dotenv';
import Opportunity from './models/Opportunity.js';
import connectDB from './config/db.js';

dotenv.config();

const seedData = [
  {
    title: 'Frontend Developer Intern',
    company: 'TechNova',
    category: 'Internship',
    description: 'Work on responsive web interfaces for student-focused portals.',
    status: 'Open',
    eligibility: 'B.Tech Final Year',
    location: 'Hybrid - Bengaluru',
    deadline: '20 Jul 2026',
    package: '₹25k/month'
  },
  {
    title: 'Data Analyst Trainee',
    company: 'SkillBridge',
    category: 'Trainee',
    description: 'Analyze placement trends and build dashboards for readiness reports.',
    status: 'Open',
    eligibility: 'Any Engineering Stream',
    location: 'Remote',
    deadline: '25 Jul 2026',
    package: '₹30k/month'
  },
  {
    title: 'Software Engineer Placement Drive',
    company: 'CodeSprint Labs',
    category: 'Full Time',
    description: 'Join the engineering team to build scalable education products.',
    status: 'Upcoming',
    eligibility: 'CGPA 7.0+',
    location: 'Pune',
    deadline: '02 Aug 2026',
    package: '₹8 LPA'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await Opportunity.deleteMany({});
    await Opportunity.insertMany(seedData);
    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();

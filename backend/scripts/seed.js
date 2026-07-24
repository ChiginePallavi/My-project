import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Opportunity from '../models/opportunity.js';
import User from '../models/user.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedOpportunities = [
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
    await Opportunity.insertMany(seedOpportunities);
    console.log('Opportunity seed data inserted successfully.');

    // Seed test users
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const studentPassword = await bcrypt.hash('Student@123', 10);

    await User.deleteMany({ email: { $in: ['admin@placement.com', 'student@placement.com'] } });

    await User.create([
      {
        name: 'System Admin',
        email: 'admin@placement.com',
        password: adminPassword,
        role: 'admin',
        college: 'Placement Portal HQ',
        branch: 'Administration'
      },
      {
        name: 'Jane Student',
        email: 'student@placement.com',
        password: studentPassword,
        role: 'student',
        college: 'Tech University',
        branch: 'Computer Science',
        graduationYear: '2026',
        skills: 'React, Node.js, JavaScript'
      }
    ]);

    console.log('Test user accounts created:');
    console.log(' - Admin: admin@placement.com / Admin@123');
    console.log(' - Student: student@placement.com / Student@123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();

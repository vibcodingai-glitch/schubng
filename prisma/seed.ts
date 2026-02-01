import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const dummyUsers = [
    {
        email: 'adaeze.okonkwo@example.com',
        firstName: 'Adaeze',
        lastName: 'Okonkwo',
        headline: 'Senior Software Engineer at Paystack',
        summary: 'Passionate about building scalable fintech solutions for Africa.',
        location: 'Lagos, Nigeria',
        industry: 'Financial Technology',
        currentRole: 'Senior Software Engineer',
        currentCompany: 'Paystack',
        yearsOfExperience: '8',
        skills: ['TypeScript', 'Node.js', 'React', 'PostgreSQL', 'AWS'],
        trustScore: 85,
    },
    {
        email: 'chidi.eze@example.com',
        firstName: 'Chidi',
        lastName: 'Eze',
        headline: 'Product Manager at Flutterwave',
        summary: 'Driving product innovation in digital payments across Africa.',
        location: 'Lagos, Nigeria',
        industry: 'Financial Technology',
        currentRole: 'Product Manager',
        currentCompany: 'Flutterwave',
        yearsOfExperience: '6',
        skills: ['Product Strategy', 'Agile', 'User Research', 'Data Analysis'],
        trustScore: 72,
    },
    {
        email: 'ngozi.abubakar@example.com',
        firstName: 'Ngozi',
        lastName: 'Abubakar',
        headline: 'Certified Public Accountant | Finance Lead',
        summary: 'Helping businesses achieve financial excellence and compliance.',
        location: 'Abuja, Nigeria',
        industry: 'Accounting & Finance',
        currentRole: 'Finance Lead',
        currentCompany: 'MTN Nigeria',
        yearsOfExperience: '10',
        skills: ['ICAN', 'Financial Reporting', 'Tax Planning', 'Audit'],
        trustScore: 95,
    },
    {
        email: 'emeka.johnson@example.com',
        firstName: 'Emeka',
        lastName: 'Johnson',
        headline: 'Data Scientist | AI Researcher',
        summary: 'Leveraging data and AI to solve complex African challenges.',
        location: 'Port Harcourt, Nigeria',
        industry: 'Technology',
        currentRole: 'Senior Data Scientist',
        currentCompany: 'Andela',
        yearsOfExperience: '5',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
        trustScore: 68,
    },
    {
        email: 'funke.adeyemi@example.com',
        firstName: 'Funke',
        lastName: 'Adeyemi',
        headline: 'HR Director | People Operations Expert',
        summary: 'Building world-class teams and organizational culture.',
        location: 'Lagos, Nigeria',
        industry: 'Human Resources',
        currentRole: 'HR Director',
        currentCompany: 'Access Bank',
        yearsOfExperience: '12',
        skills: ['Talent Acquisition', 'Employee Relations', 'SHRM-CP', 'Leadership'],
        trustScore: 88,
    },
    {
        email: 'tunde.bakare@example.com',
        firstName: 'Tunde',
        lastName: 'Bakare',
        headline: 'Cybersecurity Analyst | CISSP Certified',
        summary: 'Protecting organizations from evolving cyber threats.',
        location: 'Lagos, Nigeria',
        industry: 'Cybersecurity',
        currentRole: 'Cybersecurity Lead',
        currentCompany: 'First Bank Nigeria',
        yearsOfExperience: '7',
        skills: ['CISSP', 'Penetration Testing', 'SIEM', 'Incident Response'],
        trustScore: 91,
    },
    {
        email: 'amina.mohammed@example.com',
        firstName: 'Amina',
        lastName: 'Mohammed',
        headline: 'UX/UI Designer | Design Thinking Advocate',
        summary: 'Creating user-centered digital experiences for African markets.',
        location: 'Kano, Nigeria',
        industry: 'Design',
        currentRole: 'Lead Product Designer',
        currentCompany: 'Kuda Bank',
        yearsOfExperience: '4',
        skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'],
        trustScore: 64,
    },
    {
        email: 'olu.williams@example.com',
        firstName: 'Olu',
        lastName: 'Williams',
        headline: 'Full Stack Developer | Open Source Contributor',
        summary: 'Building robust web applications with modern technologies.',
        location: 'Ibadan, Nigeria',
        industry: 'Technology',
        currentRole: 'Full Stack Developer',
        currentCompany: 'Piggyvest',
        yearsOfExperience: '3',
        skills: ['JavaScript', 'React', 'Next.js', 'MongoDB', 'Docker'],
        trustScore: 55,
    },
    {
        email: 'chioma.peters@example.com',
        firstName: 'Chioma',
        lastName: 'Peters',
        headline: 'Project Manager | PMP Certified',
        summary: 'Delivering complex projects on time and within budget.',
        location: 'Lagos, Nigeria',
        industry: 'Project Management',
        currentRole: 'Senior Project Manager',
        currentCompany: 'Dangote Group',
        yearsOfExperience: '9',
        skills: ['PMP', 'Agile', 'Scrum', 'Risk Management', 'Stakeholder Management'],
        trustScore: 82,
    },
    {
        email: 'yusuf.ibrahim@example.com',
        firstName: 'Yusuf',
        lastName: 'Ibrahim',
        headline: 'DevOps Engineer | Cloud Architect',
        summary: 'Automating infrastructure and enabling continuous delivery.',
        location: 'Abuja, Nigeria',
        industry: 'Technology',
        currentRole: 'DevOps Engineer',
        currentCompany: 'Interswitch',
        yearsOfExperience: '6',
        skills: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux'],
        trustScore: 78,
    },
];

async function main() {
    console.log('🌱 Seeding 10 dummy users...\n');

    // Default password for all dummy users
    const defaultPassword = await bcrypt.hash('Password123!', 10);

    for (const userData of dummyUsers) {
        const user = await prisma.user.upsert({
            where: { email: userData.email },
            update: {},
            create: {
                ...userData,
                passwordHash: defaultPassword,
                isPublic: true,
                plan: 'FREE',
                role: 'USER',
            },
        });
        console.log(`✅ Created user: ${user.firstName} ${user.lastName} (${user.email})`);
    }

    console.log('\n🎉 Seeding complete! 10 dummy users added.');
    console.log('📝 Default password for all users: Password123!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

// SOURCE OF TRUTH — Bryson Prakash Almeida
// Real projects synchronized directly with github.com/brysonnn1704

export const LINKS = {
  github: "https://github.com/brysonnn1704",
  youtube: "https://youtube.com/@sauceop8165",
  email: "brysoncollege12345@gmail.com",
  rakshaLive: "https://raksha-zone.vercel.app",
  rakshaRepo: "https://github.com/brysonnn1704/RAKSHA-ZONE",
  craveLive: "https://crave-food-delivery-rho.vercel.app",
  craveRepo: "https://github.com/brysonnn1704/crave-food-delivery",
  trainwiseLive: "https://trainwise-mumbai.vercel.app",
  trainwiseRepo: "https://github.com/brysonnn1704/trainwise-mumbai",
  royalLive: "https://react-royal-enfield-clone-10914-o0gn42gkk.vercel.app",
  royalRepo: "https://github.com/brysonnn1704/React-Royal-Enfield-Clone-10914",
  calorieLive: "https://calorie-tracker-10914.vercel.app",
  calorieRepo: "https://github.com/brysonnn1704/Calorie-Tracker-10914",
  resumePdf: "/Bryson_Prakash_Almeida_CV_Final.pdf",
};

export const SELECTED_PROJECTS = [
  {
    id: "raksha-zone",
    n: "01",
    title: "RAKSHA ZONE",
    category: "Full-Stack Web",
    badge: "Disaster Management • SIH",
    live: LINKS.rakshaLive,
    repo: LINKS.rakshaRepo,
    desc: "GIS decision-support system built for SIH (Ministry of Home Affairs / NDRF Disaster Management). Identifies multi-hazard red zones, evaluates shelter capacity, and models emergency lifeline resource allocation across risk-prone regions like Wayanad.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Leaflet GIS"],
    filter: "Web",
    featured: true,
  },
  {
    id: "crave-food",
    n: "02",
    title: "Crave — Food Delivery",
    category: "Full-Stack Web",
    badge: "Zomato-Inspired Platform",
    live: LINKS.craveLive,
    repo: LINKS.craveRepo,
    desc: "Comprehensive food ordering and restaurant discovery platform inspired by Zomato and Swiggy. Powered by 75 real restaurant records from OpenStreetMap Overpass API and 444 authentic menu items, featuring real-time cart and order workflows.",
    stack: ["React", "Vite", "OpenStreetMap API", "Tailwind CSS"],
    filter: "Web",
    featured: true,
  },
  {
    id: "trainwise-mumbai",
    n: "03",
    title: "TrainWise Mumbai",
    category: "Web Application",
    badge: "Transit Commuter App",
    live: LINKS.trainwiseLive,
    repo: LINKS.trainwiseRepo,
    desc: "Commuter transit web application inspired by m-Indicator for Mumbai's local train lines (Western, Central, Harbour), BEST bus routes, and Metro lines. Includes route schedules, status indicators, and local commute planning.",
    stack: ["React", "Vite", "Zustand", "Tailwind CSS"],
    filter: "Web",
    featured: true,
  },
  {
    id: "bankmancrce",
    n: "04",
    title: "BankMAN CRCE",
    category: "Desktop Software",
    badge: "JavaFX & OAuth",
    repo: "https://github.com/brysonnn1704/BankMANCRCE",
    desc: "Desktop banking system built with JavaFX and MySQL featuring Google OAuth login, customer balance tracking, deposits, withdrawals, and an administrative oversight dashboard to monitor all transactions.",
    stack: ["Java", "JavaFX", "MySQL", "Google OAuth", "JDBC"],
    filter: "Java",
    featured: true,
  },
  {
    id: "royal-enfield",
    n: "05",
    title: "Royal Enfield Showcase",
    category: "Frontend Experience",
    badge: "Digital Showroom",
    live: LINKS.royalLive,
    repo: LINKS.royalRepo,
    desc: "Interactive recreation of the Royal Enfield digital brand experience, showcasing motorcycle models with technical specs, responsive layouts, and dark atmospheric UI transitions.",
    stack: ["React", "Vite", "Modern CSS", "JavaScript"],
    filter: "Web",
  },
  {
    id: "digital-literacy",
    n: "06",
    title: "Digital Literacy Platform",
    category: "Full-Stack App",
    badge: "Accessibility & Education",
    repo: "https://github.com/brysonnn1704/digital-literacy-app",
    desc: "Accessible learning platform built for elderly and first-time smartphone users. Features interactive step-by-step phone lessons, scam awareness tutorials, progress tracking, and high-contrast touch targets.",
    stack: ["React", "Node.js", "Express", "MongoDB"],
    filter: "Web",
  },
  {
    id: "restaurant-billing",
    n: "07",
    title: "Restaurant POS & Billing",
    category: "Systems & Python",
    badge: "POS Terminal",
    repo: "https://github.com/brysonnn1704/Restaurant-Billing-System",
    desc: "Point-of-sale terminal and restaurant billing engine with dual workflows for diners and restaurant administrators. Handles table mapping, kitchen orders, tax computations, and itemized receipts.",
    stack: ["Python", "HTML", "Shell", "SQLite"],
    filter: "Systems",
  },
  {
    id: "calorie-tracker",
    n: "08",
    title: "Calorie Tracker",
    category: "Web Application",
    badge: "Health & Nutrition",
    repo: LINKS.calorieRepo,
    live: LINKS.calorieLive,
    desc: "Daily nutrition and calorie budgeting tool with macro ratio distribution (protein, carbohydrates, fats), persistent daily entries, and target intake progress arcs.",
    stack: ["JavaScript", "CSS3", "HTML5", "LocalStorage"],
    filter: "Web",
  },
  {
    id: "lab5-rds",
    n: "09",
    title: "Listmonk on EC2 + RDS",
    category: "Cloud Infrastructure",
    badge: "AWS VPC Architecture",
    repo: "https://github.com/brysonnn1704/lab5-rds-listmonk",
    desc: "Production cloud lab deploying Listmonk on an Amazon EC2 instance linked to an Amazon RDS PostgreSQL database isolated in private subnets with strict security groups and systemd automation.",
    stack: ["AWS EC2", "AWS RDS", "PostgreSQL", "Go", "Ubuntu Linux"],
    filter: "Systems",
  },
  {
    id: "assignment-dynamodb",
    n: "10",
    title: "DynamoDB Modeling & CRUD",
    category: "Cloud Database",
    badge: "AWS NoSQL",
    repo: "https://github.com/brysonnn1704/assignment2-dynamodb-crud",
    desc: "Implementation of single-table NoSQL design patterns in DynamoDB, optimizing partition keys and sort keys for high-efficiency reads/writes, with automated Python Boto3 data scripts.",
    stack: ["Python", "AWS DynamoDB", "Boto3", "AWS IAM"],
    filter: "Systems",
  },
];

export const CLOUD_LABS = [
  {
    title: "AWS EC2 + Amazon RDS Architecture",
    badge: "Multi-Tier Cloud",
    desc: "Configured Listmonk mailing software on an Amazon EC2 compute node connected to a managed Amazon RDS PostgreSQL database inside a custom VPC with public/private subnet segmentation and security group rules.",
    tech: ["AWS VPC", "EC2", "RDS PostgreSQL", "Ubuntu Linux", "systemd"],
    github: "https://github.com/brysonnn1704/lab5-rds-listmonk",
  },
  {
    title: "DynamoDB Single-Table Key Modeling",
    badge: "NoSQL Engineering",
    desc: "Structured partition keys (PK) and sort keys (SK) for single-table access patterns in AWS DynamoDB, automating batch write operations and query filters via Python Boto3.",
    tech: ["DynamoDB", "Python", "Boto3", "AWS IAM", "CloudWatch"],
    github: "https://github.com/brysonnn1704/assignment2-dynamodb-crud",
  },
  {
    title: "Site-to-Site IPsec VPN with strongSwan",
    badge: "Network Security",
    desc: "Established encrypted IKEv2 site-to-site IPsec VPN tunnels between on-premises virtual machine subnets and cloud gateways, configuring routing tables and packet filtering.",
    tech: ["Linux Ubuntu", "strongSwan", "IPsec", "IKEv2", "Routing"],
  },
];

export const TECH_TOOLKIT = [
  {
    category: "Languages",
    skills: ["Java", "Python", "JavaScript (ES6+)", "TypeScript", "C++", "SQL"],
  },
  {
    category: "Web & Frontend",
    skills: ["React", "Next.js", "Three.js / R3F", "Tailwind CSS", "HTML5 / CSS3", "Vite", "Zustand"],
  },
  {
    category: "Cloud & Infrastructure",
    skills: ["AWS (EC2, RDS, DynamoDB, S3)", "Google Cloud Platform", "Docker", "Linux (Ubuntu)", "VPC & Subnets", "IPsec VPN (strongSwan)"],
  },
  {
    category: "Backend & Databases",
    skills: ["Node.js", "Express", "MySQL", "PostgreSQL", "MongoDB", "SQLite"],
  },
  {
    category: "Tools & Creative",
    skills: ["Git & GitHub", "VS Code", "Vercel", "Premiere Pro", "After Effects", "DaVinci Resolve", "Photoshop"],
  },
];

export const YOUTUBE_VIDEOS = [];

export const CREATIVE_WORK = [
  {
    id: "short-form",
    title: "Short-Form Video & Reels",
    role: "Video Editor & Pacing",
    tools: ["Premiere Pro", "After Effects", "CapCut"],
    desc: "Editing high-retention vertical clips for YouTube Shorts and Instagram Reels with kinetic subtitles, sound design, and narrative flow.",
  },
  {
    id: "motion-graphics",
    title: "Motion Graphics & Promo Content",
    role: "Visual Creator",
    tools: ["After Effects", "Photoshop", "Premiere Pro"],
    desc: "Designing social media announcements, promotional teasers, and festive campaigns maintaining cohesive brand identity and typography.",
  },
  {
    id: "tech-demos",
    title: "Project Showreels & Teasers",
    role: "Content Creator",
    tools: ["DaVinci Resolve", "Premiere Pro"],
    desc: "Creating technical project demos, recording screen interactions, and mixing audio to showcase software workflows clearly.",
  },
];

export const EXPERIENCE = [
  {
    role: "Video Editor & Creative Assistant",
    org: "Chrisel Technolab",
    period: "May — July 2026",
    location: "Mumbai, India",
    points: [
      "Produced and edited short-form reels, festive visual campaigns, and promotional assets.",
      "Ensured brand consistency across social media channels and digital communications.",
      "Gained valuable exposure to corporate security awareness and collaborative teamwork in a technical firm.",
    ],
  },
];

export const EDUCATION = [
  {
    degree: "B.Tech in Computer Engineering",
    institution: "Fr. Conceicao Rodrigues College of Engineering (Fr. CRCE)",
    period: "2025 – Present",
    score: "Currently Pursuing",
    details: "Deepening knowledge in Computer Networks, Cloud Architectures, Operating Systems, Algorithms, and Distributed Computing.",
  },
  {
    degree: "Diploma in Cloud Computing & Big Data",
    institution: "Vidyavaridhi — Bhausaheb Vartak Polytechnic",
    period: "2022 – 2025",
    score: "89.47% Distinction",
    details: "Graduated with top marks specializing in cloud infrastructure, AWS foundations, Linux system administration, and relational database management.",
  },
];

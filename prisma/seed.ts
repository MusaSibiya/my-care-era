import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("password123", 12);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@mycareer.co.za" },
    update: {},
    create: {
      email: "demo@mycareer.co.za",
      name: "Thabo Mokoena",
      passwordHash,
      province: "Gauteng",
    },
  });

  console.log("Demo user created:", demoUser.email);

  // Universities
  const universities = await Promise.all([
    prisma.university.create({
      data: {
        name: "University of Cape Town",
        shortName: "UCT",
        slug: "uct",
        province: "Western Cape",
        city: "Cape Town",
        latitude: -33.9577,
        longitude: 18.4612,
        website: "https://www.uct.ac.za",
        description: "Africa's leading research university, ranked among the top universities globally. Known for excellence in teaching, learning, and research across a wide range of disciplines.",
        ranking: 1,
        type: "public",
        founded: 1829,
        students: 29000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of the Witwatersrand",
        shortName: "Wits",
        slug: "wits",
        province: "Gauteng",
        city: "Johannesburg",
        latitude: -26.1929,
        longitude: 28.0305,
        website: "https://www.wits.ac.za",
        description: "A world-class African university committed to academic excellence, cutting-edge research, and the social justice that underpins democratic societies.",
        ranking: 2,
        type: "public",
        founded: 1896,
        students: 40000,
      },
    }),
    prisma.university.create({
      data: {
        name: "Stellenbosch University",
        shortName: "SU",
        slug: "stellenbosch",
        province: "Western Cape",
        city: "Stellenbosch",
        latitude: -33.9321,
        longitude: 18.8602,
        website: "https://www.sun.ac.za",
        description: "One of Africa's leading research-intensive universities, known for its beautiful campus and academic excellence.",
        ranking: 3,
        type: "public",
        founded: 1866,
        students: 33000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of Pretoria",
        shortName: "UP",
        slug: "up",
        province: "Gauteng",
        city: "Pretoria",
        latitude: -25.7545,
        longitude: 28.2314,
        website: "https://www.up.ac.za",
        description: "A research-intensive university offering a diverse range of programmes and is one of the largest universities in South Africa.",
        ranking: 4,
        type: "public",
        founded: 1908,
        students: 53000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of KwaZulu-Natal",
        shortName: "UKZN",
        slug: "ukzn",
        province: "KwaZulu-Natal",
        city: "Durban",
        latitude: -29.8240,
        longitude: 31.0056,
        website: "https://www.ukzn.ac.za",
        description: "A university committed to being Africa's leading university, with a focus on engagement with the broader community.",
        ranking: 5,
        type: "public",
        founded: 2004,
        students: 47000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of Johannesburg",
        shortName: "UJ",
        slug: "uj",
        province: "Gauteng",
        city: "Johannesburg",
        latitude: -26.1825,
        longitude: 28.0100,
        website: "https://www.uj.ac.za",
        description: "A vibrant, pan-African, and transformative university that embraces technology and innovation.",
        ranking: 6,
        type: "public",
        founded: 2005,
        students: 50000,
      },
    }),
    prisma.university.create({
      data: {
        name: "North-West University",
        shortName: "NWU",
        slug: "nwu",
        province: "North West",
        city: "Potchefstroom",
        latitude: -26.6960,
        longitude: 27.0895,
        website: "https://www.nwu.ac.za",
        description: "A university that is home to more than 64,000 students across three campuses, offering a rich cultural experience.",
        ranking: 7,
        type: "public",
        founded: 2004,
        students: 64000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of the Free State",
        shortName: "UFS",
        slug: "ufs",
        province: "Free State",
        city: "Bloemfontein",
        latitude: -29.1016,
        longitude: 26.1761,
        website: "https://www.ufs.ac.za",
        description: "A university of choice in the heartland of South Africa, known for academic excellence and community engagement.",
        ranking: 8,
        type: "public",
        founded: 1904,
        students: 37000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of Limpopo",
        shortName: "UL",
        slug: "ulimpopo",
        province: "Limpopo",
        city: "Polokwane",
        latitude: -23.8861,
        longitude: 29.4643,
        website: "https://www.ul.ac.za",
        description: "A university focused on community engagement and producing graduates who are ready to contribute to development.",
        ranking: 9,
        type: "public",
        founded: 2005,
        students: 25000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of Fort Hare",
        shortName: "UFH",
        slug: "ufh",
        province: "Eastern Cape",
        city: "Alice",
        latitude: -32.7875,
        longitude: 26.8340,
        website: "https://www.ufh.ac.za",
        description: "A historically significant university that has produced many African leaders, including Nelson Mandela and Robert Sobukwe.",
        ranking: 10,
        type: "public",
        founded: 1916,
        students: 12000,
      },
    }),
    prisma.university.create({
      data: {
        name: "Rhodes University",
        shortName: "RU",
        slug: "rhodes",
        province: "Eastern Cape",
        city: "Makhanda",
        latitude: -33.3113,
        longitude: 26.5290,
        website: "https://www.ru.ac.za",
        description: "A small, research-intensive university known for excellent teaching and a vibrant campus culture.",
        ranking: 11,
        type: "public",
        founded: 1904,
        students: 8000,
      },
    }),
    prisma.university.create({
      data: {
        name: "Durban University of Technology",
        shortName: "DUT",
        slug: "dut",
        province: "KwaZulu-Natal",
        city: "Durban",
        latitude: -29.8463,
        longitude: 31.0198,
        website: "https://www.dut.ac.za",
        description: "A university of technology committed to quality education and producing work-ready graduates.",
        ranking: 12,
        type: "public",
        founded: 2002,
        students: 33000,
      },
    }),
    prisma.university.create({
      data: {
        name: "Tshwane University of Technology",
        shortName: "TUT",
        slug: "tut",
        province: "Gauteng",
        city: "Pretoria",
        latitude: -25.7461,
        longitude: 28.1881,
        website: "https://www.tut.ac.za",
        description: "One of the largest universities of technology in South Africa, with a focus on career-oriented education.",
        ranking: 13,
        type: "public",
        founded: 2004,
        students: 60000,
      },
    }),
    prisma.university.create({
      data: {
        name: "Cape Peninsula University of Technology",
        shortName: "CPUT",
        slug: "cput",
        province: "Western Cape",
        city: "Cape Town",
        latitude: -33.9410,
        longitude: 18.4541,
        website: "https://www.cput.ac.za",
        description: "The largest university in the Western Cape, focused on career-oriented education and applied research.",
        ranking: 14,
        type: "public",
        founded: 2005,
        students: 36000,
      },
    }),
    prisma.university.create({
      data: {
        name: "Mangosuthu University of Technology",
        shortName: "MUT",
        slug: "mut",
        province: "KwaZulu-Natal",
        city: "Umlazi",
        latitude: -29.9718,
        longitude: 30.8667,
        website: "https://www.mut.ac.za",
        description: "A university committed to providing quality education and producing graduates for the technology sector.",
        ranking: 15,
        type: "public",
        founded: 2007,
        students: 12000,
      },
    }),
    prisma.university.create({
      data: {
        name: "Central University of Technology",
        shortName: "CUT",
        slug: "cut",
        province: "Free State",
        city: "Bloemfontein",
        latitude: -29.0872,
        longitude: 26.1621,
        website: "https://www.cut.ac.za",
        description: "A university of technology focused on innovation and producing graduates who can contribute to economic growth.",
        ranking: 16,
        type: "public",
        founded: 2004,
        students: 11000,
      },
    }),
    prisma.university.create({
      data: {
        name: "Walter Sisulu University",
        shortName: "WSU",
        slug: "wsu",
        province: "Eastern Cape",
        city: "Mthatha",
        latitude: -31.5960,
        longitude: 28.7845,
        website: "https://www.wsu.ac.za",
        description: "A university committed to community engagement and producing graduates ready for the world of work.",
        ranking: 17,
        type: "public",
        founded: 2005,
        students: 25000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of Venda",
        shortName: "Univen",
        slug: "univen",
        province: "Limpopo",
        city: "Thohoyandou",
        latitude: -22.9736,
        longitude: 30.4511,
        website: "https://www.univen.ac.za",
        description: "A university located in the Vhembe district, serving communities in the Limpopo province.",
        ranking: 18,
        type: "public",
        founded: 1982,
        students: 16000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of Zululand",
        shortName: "Unizulu",
        slug: "unizulu",
        province: "KwaZulu-Natal",
        city: "Richards Bay",
        latitude: -28.7886,
        longitude: 32.0561,
        website: "https://www.unizulu.ac.za",
        description: "A comprehensive university offering a wide range of programmes in the KwaZulu-Natal province.",
        ranking: 19,
        type: "public",
        founded: 1960,
        students: 15000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of Mpumalanga",
        shortName: "UMP",
        slug: "ump",
        province: "Mpumalanga",
        city: "Mbombela",
        latitude: -25.4301,
        longitude: 30.9750,
        website: "https://www.ump.ac.za",
        description: "The newest university in South Africa, focused on serving the Mpumalanga province.",
        ranking: 20,
        type: "public",
        founded: 2014,
        students: 5000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of the Western Cape",
        shortName: "UWC",
        slug: "uwc",
        province: "Western Cape",
        city: "Cape Town",
        latitude: -33.9292,
        longitude: 18.5869,
        website: "https://www.uwc.ac.za",
        description: "A university committed to equity, with a strong tradition of social justice and community engagement.",
        ranking: 21,
        type: "public",
        founded: 1960,
        students: 22000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of South Africa",
        shortName: "UNISA",
        slug: "unisa",
        province: "Gauteng",
        city: "Pretoria",
        latitude: -25.7659,
        longitude: 28.2321,
        website: "https://www.unisa.ac.za",
        description: "The largest university in Africa and one of the biggest distance-learning institutions in the world.",
        ranking: 22,
        type: "public",
        founded: 1873,
        students: 400000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of Johannesburg",
        shortName: "UJ",
        slug: "uj-apk",
        province: "Gauteng",
        city: "Johannesburg",
        latitude: -26.1825,
        longitude: 28.0100,
        website: "https://www.uj.ac.za",
        description: "A transformation-focused university that embraces technology and innovation across disciplines.",
        ranking: 23,
        type: "public",
        founded: 2005,
        students: 50000,
      },
    }),
    prisma.university.create({
      data: {
        name: "Monash South Africa",
        shortName: "MSA",
        slug: "monash",
        province: "Gauteng",
        city: "Johannesburg",
        latitude: -26.0754,
        longitude: 27.8860,
        website: "https://www.monashsouthafrica.com",
        description: "An international university offering Australian-standard education on the African continent.",
        ranking: null,
        type: "private",
        founded: 2001,
        students: 4000,
      },
    }),
    prisma.university.create({
      data: {
        name: "University of the Witwatersrand",
        shortName: "Wits",
        slug: "wits-business-school",
        province: "Gauteng",
        city: "Johannesburg",
        latitude: -26.1929,
        longitude: 28.0305,
        website: "https://www.wits.ac.za",
        description: "A top-ranked African university excelling in research and academic excellence.",
        ranking: null,
        type: "public",
        founded: 1896,
        students: 40000,
      },
    }),
  ]);

  console.log(`Created ${universities.length} universities`);

  // Career Paths
  const careers = await Promise.all([
    prisma.careerPath.create({
      data: {
        name: "Software Engineer",
        slug: "software-engineer",
        description: "Design, develop, and maintain software applications. Work with programming languages, frameworks, and tools to create innovative solutions.",
        category: "Technology",
        avgSalaryMin: 350000,
        avgSalaryMax: 850000,
        demandLevel: "Very High",
        growthRate: "+18% (5yr)",
        workLife: "Good",
        keySkills: "Programming, Problem Solving, System Design, Git, Cloud Computing, Agile",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Medical Doctor",
        slug: "medical-doctor",
        description: "Diagnose and treat illnesses, injuries, and diseases. Work in hospitals, clinics, or private practice to improve patient health.",
        category: "Healthcare",
        avgSalaryMin: 500000,
        avgSalaryMax: 1200000,
        demandLevel: "High",
        growthRate: "+12% (5yr)",
        workLife: "Challenging",
        keySkills: "Medical Knowledge, Empathy, Communication, Decision Making, Stamina",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Civil Engineer",
        slug: "civil-engineer",
        description: "Design, build, and maintain infrastructure projects like roads, bridges, and buildings. Work on projects that shape communities.",
        category: "Engineering",
        avgSalaryMin: 320000,
        avgSalaryMax: 750000,
        demandLevel: "High",
        growthRate: "+14% (5yr)",
        workLife: "Good",
        keySkills: "CAD, Structural Analysis, Project Management, Mathematics, Communication",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Chartered Accountant",
        slug: "chartered-accountant",
        description: "Manage financial records, audit accounts, and provide financial advice to organizations and individuals.",
        category: "Business & Finance",
        avgSalaryMin: 350000,
        avgSalaryMax: 900000,
        demandLevel: "High",
        growthRate: "+10% (5yr)",
        workLife: "Moderate",
        keySkills: "Accounting, Tax, Audit, Financial Analysis, Attention to Detail",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Lawyer",
        slug: "lawyer",
        description: "Advise clients on legal matters, represent them in court, and help resolve disputes through the legal system.",
        category: "Law",
        avgSalaryMin: 280000,
        avgSalaryMax: 800000,
        demandLevel: "Moderate",
        growthRate: "+8% (5yr)",
        workLife: "Moderate",
        keySkills: "Legal Research, Communication, Analytical Thinking, Negotiation, Writing",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Data Scientist",
        slug: "data-scientist",
        description: "Analyze complex data sets to help organizations make informed decisions using statistics, machine learning, and programming.",
        category: "Technology",
        avgSalaryMin: 400000,
        avgSalaryMax: 900000,
        demandLevel: "Very High",
        growthRate: "+25% (5yr)",
        workLife: "Good",
        keySkills: "Python, Statistics, Machine Learning, SQL, Data Visualization, Critical Thinking",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Nurse",
        slug: "nurse",
        description: "Provide and coordinate patient care, educate patients about health conditions, and offer emotional support.",
        category: "Healthcare",
        avgSalaryMin: 200000,
        avgSalaryMax: 450000,
        demandLevel: "Very High",
        growthRate: "+16% (5yr)",
        workLife: "Challenging",
        keySkills: "Patient Care, Communication, Empathy, Attention to Detail, Stamina",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Architect",
        slug: "architect",
        description: "Design buildings and structures that are functional, safe, and aesthetically pleasing. Combine art and science.",
        category: "Design & Creative",
        avgSalaryMin: 280000,
        avgSalaryMax: 650000,
        demandLevel: "Moderate",
        growthRate: "+7% (5yr)",
        workLife: "Good",
        keySkills: "AutoCAD, Creativity, Problem Solving, Mathematics, Communication, Design",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Pharmacist",
        slug: "pharmacist",
        description: "Dispense medications, advise patients on proper drug use, and ensure safe and effective pharmaceutical care.",
        category: "Healthcare",
        avgSalaryMin: 350000,
        avgSalaryMax: 650000,
        demandLevel: "High",
        growthRate: "+11% (5yr)",
        workLife: "Good",
        keySkills: "Pharmacology, Attention to Detail, Communication, Patient Care, Ethics",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Teacher",
        slug: "teacher",
        description: "Educate students at various levels, develop lesson plans, assess student progress, and inspire learning.",
        category: "Education",
        avgSalaryMin: 180000,
        avgSalaryMax: 420000,
        demandLevel: "High",
        growthRate: "+9% (5yr)",
        workLife: "Good",
        keySkills: "Subject Knowledge, Communication, Patience, Creativity, Organization",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Mechanical Engineer",
        slug: "mechanical-engineer",
        description: "Design, develop, and test mechanical devices and systems. Work on everything from engines to manufacturing equipment.",
        category: "Engineering",
        avgSalaryMin: 320000,
        avgSalaryMax: 700000,
        demandLevel: "High",
        growthRate: "+10% (5yr)",
        workLife: "Good",
        keySkills: "CAD, Thermodynamics, Materials Science, Mathematics, Problem Solving",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Psychologist",
        slug: "psychologist",
        description: "Study human behavior and mental processes. Help individuals cope with mental health challenges and improve well-being.",
        category: "Healthcare",
        avgSalaryMin: 250000,
        avgSalaryMax: 600000,
        demandLevel: "Moderate",
        growthRate: "+14% (5yr)",
        workLife: "Good",
        keySkills: "Empathy, Communication, Research, Analytical Thinking, Patience",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Graphic Designer",
        slug: "graphic-designer",
        description: "Create visual concepts to communicate ideas. Combine art and technology to produce compelling visual content.",
        category: "Design & Creative",
        avgSalaryMin: 180000,
        avgSalaryMax: 450000,
        demandLevel: "Moderate",
        growthRate: "+6% (5yr)",
        workLife: "Good",
        keySkills: "Adobe Creative Suite, Creativity, Typography, Layout Design, Communication",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Electrical Engineer",
        slug: "electrical-engineer",
        description: "Design, develop, and test electrical equipment and systems. Work on power generation, electronics, and telecommunications.",
        category: "Engineering",
        avgSalaryMin: 330000,
        avgSalaryMax: 750000,
        demandLevel: "High",
        growthRate: "+12% (5yr)",
        workLife: "Good",
        keySkills: "Circuit Design, MATLAB, Power Systems, Problem Solving, Mathematics",
      },
    }),
    prisma.careerPath.create({
      data: {
        name: "Marketing Manager",
        slug: "marketing-manager",
        description: "Plan and execute marketing campaigns, manage brand identity, and drive customer acquisition and retention.",
        category: "Business & Finance",
        avgSalaryMin: 300000,
        avgSalaryMax: 700000,
        demandLevel: "Moderate",
        growthRate: "+8% (5yr)",
        workLife: "Good",
        keySkills: "Digital Marketing, Analytics, Communication, Strategy, Creativity, Leadership",
      },
    }),
  ]);

  console.log(`Created ${careers.length} career paths`);

  // Courses for each university (key programs)
  const courseData: Array<{
    universitySlug: string;
    name: string;
    slug: string;
    qualification: string;
    durationYears: number;
    apsMin: number;
    annualCost: number;
    description: string;
    careerPaths: string;
    faculty: string;
    nqfLevel: number;
    requirements: { subject: string; minLevel: number }[];
    careerSlugs: string[];
  }> = [
    // UCT
    {
      universitySlug: "uct", name: "Bachelor of Computer Science", slug: "bcs",
      qualification: "Bachelor's Degree", durationYears: 3, apsMin: 42, annualCost: 65000,
      description: "A rigorous programme covering computational theory, algorithms, programming, and AI.",
      careerPaths: "Software Engineer, Data Scientist, Systems Analyst",
      faculty: "Science", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 6 }, { subject: "Physical Sciences", minLevel: 4 }],
      careerSlugs: ["software-engineer", "data-scientist"],
    },
    {
      universitySlug: "uct", name: "Bachelor of Medicine and Surgery", slug: "mbchb",
      qualification: "Bachelor's Degree", durationYears: 6, apsMin: 48, annualCost: 75000,
      description: "UCT's flagship medical programme, producing top healthcare professionals for Africa.",
      careerPaths: "Medical Doctor, Surgeon, Specialist",
      faculty: "Health Sciences", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 6 }, { subject: "Physical Sciences", minLevel: 5 }, { subject: "Life Sciences", minLevel: 5 }, { subject: "English", minLevel: 5 }],
      careerSlugs: ["medical-doctor"],
    },
    {
      universitySlug: "uct", name: "Bachelor of Business Science", slug: "bbuscs",
      qualification: "Bachelor's Degree", durationYears: 4, apsMin: 43, annualCost: 70000,
      description: "A commerce-focused programme with strong analytical and quantitative skills development.",
      careerPaths: "Chartered Accountant, Financial Analyst, Investment Banker",
      faculty: "Commerce", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 6 }],
      careerSlugs: ["chartered-accountant"],
    },
    // Wits
    {
      universitySlug: "wits", name: "Bachelor of Science in Computer Science", slug: "bsc-cs",
      qualification: "Bachelor's Degree", durationYears: 3, apsMin: 40, annualCost: 58000,
      description: "World-class CS programme with exposure to AI, machine learning, and software engineering.",
      careerPaths: "Software Engineer, Data Scientist, Cybersecurity Analyst",
      faculty: "Science", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 6 }, { subject: "Physical Sciences", minLevel: 4 }],
      careerSlugs: ["software-engineer", "data-scientist"],
    },
    {
      universitySlug: "wits", name: "Bachelor of Engineering (Civil)", slug: "becivil",
      qualification: "Bachelor's Degree", durationYears: 4, apsMin: 42, annualCost: 62000,
      description: "Engineering programme focused on infrastructure development for Africa.",
      careerPaths: "Civil Engineer, Structural Engineer, Project Manager",
      faculty: "Engineering", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 6 }, { subject: "Physical Sciences", minLevel: 5 }],
      careerSlugs: ["civil-engineer"],
    },
    {
      universitySlug: "wits", name: "Bachelor of Medicine and Surgery", slug: "wits-mbchb",
      qualification: "Bachelor's Degree", durationYears: 6, apsMin: 47, annualCost: 68000,
      description: "One of SA's top medical schools with world-class clinical training facilities.",
      careerPaths: "Medical Doctor, Surgeon, Psychiatrist",
      faculty: "Health Sciences", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 5 }, { subject: "Physical Sciences", minLevel: 5 }, { subject: "Life Sciences", minLevel: 5 }],
      careerSlugs: ["medical-doctor"],
    },
    {
      universitySlug: "wits", name: "Bachelor of Accounting Science", slug: "bcompt",
      qualification: "Bachelor's Degree", durationYears: 3, apsMin: 38, annualCost: 55000,
      description: "Professional accounting programme accredited by SAICA for CA(SA) pathway.",
      careerPaths: "Chartered Accountant, Auditor, Tax Practitioner",
      faculty: "Commerce", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 5 }, { subject: "Accounting", minLevel: 4 }],
      careerSlugs: ["chartered-accountant"],
    },
    // Stellenbosch
    {
      universitySlug: "stellenbosch", name: "BSc Computer Science", slug: "sun-bsc-cs",
      qualification: "Bachelor's Degree", durationYears: 3, apsMin: 40, annualCost: 52000,
      description: "Strong theoretical foundation with practical applications in software development.",
      careerPaths: "Software Engineer, AI Researcher, Game Developer",
      faculty: "Science", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 6 }, { subject: "Physical Sciences", minLevel: 4 }],
      careerSlugs: ["software-engineer", "data-scientist"],
    },
    {
      universitySlug: "stellenbosch", name: "Bachelor of Engineering (Mechanical)", slug: "sun-bmech",
      qualification: "Bachelor's Degree", durationYears: 4, apsMin: 42, annualCost: 55000,
      description: "Engineering programme with focus on design, manufacturing, and energy systems.",
      careerPaths: "Mechanical Engineer, Design Engineer, Project Manager",
      faculty: "Engineering", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 6 }, { subject: "Physical Sciences", minLevel: 5 }],
      careerSlugs: ["mechanical-engineer"],
    },
    {
      universitySlug: "stellenbosch", name: "BA Law", slug: "sun-balaw",
      qualification: "Bachelor's Degree", durationYears: 3, apsMin: 36, annualCost: 50000,
      description: "Foundation for a career in law with strong critical thinking and legal reasoning.",
      careerPaths: "Lawyer, Legal Advisor, Human Rights Advocate",
      faculty: "Law", nqfLevel: 8,
      requirements: [{ subject: "English", minLevel: 5 }],
      careerSlugs: ["lawyer"],
    },
    // UP
    {
      universitySlug: "up", name: "BSc Computer Science", slug: "up-bsc-cs",
      qualification: "Bachelor's Degree", durationYears: 3, apsMin: 38, annualCost: 50000,
      description: "Comprehensive CS programme covering theory, systems, and applications.",
      careerPaths: "Software Engineer, Systems Analyst, IT Consultant",
      faculty: "Natural and Agricultural Sciences", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 6 }, { subject: "Physical Sciences", minLevel: 4 }],
      careerSlugs: ["software-engineer", "data-scientist"],
    },
    {
      universitySlug: "up", name: "B Engineering (Electrical)", slug: "up-belec",
      qualification: "Bachelor's Degree", durationYears: 4, apsMin: 42, annualCost: 54000,
      description: "Engineering programme focused on electrical systems, electronics, and power.",
      careerPaths: "Electrical Engineer, Electronics Engineer, Power Systems Engineer",
      faculty: "Engineering, Built Environment and IT", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 6 }, { subject: "Physical Sciences", minLevel: 5 }],
      careerSlugs: ["electrical-engineer"],
    },
    {
      universitySlug: "up", name: "BPharm", slug: "up-bpharm",
      qualification: "Bachelor's Degree", durationYears: 4, apsMin: 38, annualCost: 52000,
      description: "Pharmacy programme accredited by the South African Pharmacy Council.",
      careerPaths: "Pharmacist, Clinical Pharmacist, Pharmaceutical Researcher",
      faculty: "Health Sciences", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 4 }, { subject: "Physical Sciences", minLevel: 4 }, { subject: "Life Sciences", minLevel: 4 }],
      careerSlugs: ["pharmacist"],
    },
    // UKZN
    {
      universitySlug: "ukzn", name: "BSc Computer Science", slug: "ukzn-bsc-cs",
      qualification: "Bachelor's Degree", durationYears: 3, apsMin: 35, annualCost: 48000,
      description: "Solid CS education with emphasis on African context and innovation.",
      careerPaths: "Software Engineer, Web Developer, Data Analyst",
      faculty: "Science, Engineering and Technology", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 5 }, { subject: "Physical Sciences", minLevel: 4 }],
      careerSlugs: ["software-engineer", "data-scientist"],
    },
    {
      universitySlug: "ukzn", name: "MBChB", slug: "ukzn-mbchb",
      qualification: "Bachelor's Degree", durationYears: 6, apsMin: 44, annualCost: 55000,
      description: "Medical programme with strong community-based clinical training.",
      careerPaths: "Medical Doctor, Public Health Specialist, Researcher",
      faculty: "Health Sciences", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 5 }, { subject: "Physical Sciences", minLevel: 4 }, { subject: "Life Sciences", minLevel: 5 }],
      careerSlugs: ["medical-doctor"],
    },
    {
      universitySlug: "ukzn", name: "B Nursing", slug: "ukzn-bnursing",
      qualification: "Bachelor's Degree", durationYears: 4, apsMin: 30, annualCost: 42000,
      description: "Professional nursing programme with clinical placements across KZN.",
      careerPaths: "Nurse, Midwife, Clinical Specialist",
      faculty: "Health Sciences", nqfLevel: 8,
      requirements: [{ subject: "Life Sciences", minLevel: 4 }, { subject: "English", minLevel: 4 }],
      careerSlugs: ["nurse"],
    },
    // UJ
    {
      universitySlug: "uj", name: "BSc Information Technology", slug: "uj-bsc-it",
      qualification: "Bachelor's Degree", durationYears: 3, apsMin: 32, annualCost: 45000,
      description: "Practical IT programme focusing on software development and systems.",
      careerPaths: "Software Developer, IT Support, Systems Administrator",
      faculty: "Science", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 4 }, { subject: "Physical Sciences", minLevel: 3 }],
      careerSlugs: ["software-engineer"],
    },
    {
      universitySlug: "uj", name: "B Architectural Studies", slug: "uj-barch",
      qualification: "Bachelor's Degree", durationYears: 3, apsMin: 34, annualCost: 47000,
      description: "Design-focused programme combining creativity with technical skills.",
      careerPaths: "Architect, Urban Designer, Interior Designer",
      faculty: "Art, Design and Architecture", nqfLevel: 8,
      requirements: [{ subject: "Mathematics", minLevel: 4 }, { subject: "Visual Arts", minLevel: 3 }],
      careerSlugs: ["architect"],
    },
    // DUT
    {
      universitySlug: "dut", name: "Diploma in Information Technology", slug: "dut-dit",
      qualification: "Diploma", durationYears: 3, apsMin: 26, annualCost: 22000,
      description: "Practical diploma preparing students for the IT industry.",
      careerPaths: "IT Technician, Junior Developer, Help Desk Analyst",
      faculty: "Applied Sciences", nqfLevel: 6,
      requirements: [{ subject: "Mathematics", minLevel: 3 }],
      careerSlugs: ["software-engineer"],
    },
    {
      universitySlug: "dut", name: "Diploma in Graphic Design", slug: "dut-gd",
      qualification: "Diploma", durationYears: 3, apsMin: 25, annualCost: 21000,
      description: "Creative programme developing visual communication skills.",
      careerPaths: "Graphic Designer, Art Director, Brand Designer",
      faculty: "Arts and Design", nqfLevel: 6,
      requirements: [{ subject: "Visual Arts", minLevel: 3 }],
      careerSlugs: ["graphic-designer"],
    },
    // TUT
    {
      universitySlug: "tut", name: "Diploma in Engineering (Civil)", slug: "tut-dcivil",
      qualification: "Diploma", durationYears: 3, apsMin: 26, annualCost: 20000,
      description: "Practical engineering diploma in civil engineering technology.",
      careerPaths: "Civil Engineering Technician, Site Supervisor, Draughtsperson",
      faculty: "Engineering and the Built Environment", nqfLevel: 6,
      requirements: [{ subject: "Mathematics", minLevel: 4 }, { subject: "Physical Sciences", minLevel: 3 }],
      careerSlugs: ["civil-engineer"],
    },
    {
      universitySlug: "tut", name: "National Diploma in Marketing", slug: "tut-marketing",
      qualification: "Diploma", durationYears: 3, apsMin: 24, annualCost: 19000,
      description: "Marketing diploma with focus on digital and traditional marketing.",
      careerPaths: "Marketing Coordinator, Brand Manager, Sales Representative",
      faculty: "Management Sciences", nqfLevel: 6,
      requirements: [{ subject: "English", minLevel: 4 }],
      careerSlugs: ["marketing-manager"],
    },
  ];

  let courseCount = 0;
  for (const cd of courseData) {
    const uni = universities.find((u) => u.slug === cd.universitySlug);
    if (!uni) continue;

    const course = await prisma.course.upsert({
      where: { universityId_slug: { universityId: uni.id, slug: cd.slug } },
      update: {},
      create: {
        universityId: uni.id,
        name: cd.name,
        slug: cd.slug,
        qualification: cd.qualification,
        durationYears: cd.durationYears,
        apsMin: cd.apsMin,
        annualCost: cd.annualCost,
        description: cd.description,
        careerPaths: cd.careerPaths,
        faculty: cd.faculty,
        nqfLevel: cd.nqfLevel,
        requirements: {
          create: cd.requirements,
        },
      },
    });

    for (const cs of cd.careerSlugs) {
      const career = careers.find((c) => c.slug === cs);
      if (career) {
        await prisma.careerCourse.upsert({
          where: { careerPathId_courseId: { careerPathId: career.id, courseId: course.id } },
          update: {},
          create: { careerPathId: career.id, courseId: course.id },
        });
      }
    }
    courseCount++;
  }

  console.log(`Created ${courseCount} courses`);

  // Accommodations
  const accommodationData = [
    { universitySlug: "uct", name: "Fuller Hall", type: "Residence", priceMin: 35000, priceMax: 42000, distanceKm: 0.1 },
    { universitySlug: "uct", name: "Tugwell Hall", type: "Residence", priceMin: 32000, priceMax: 38000, distanceKm: 0.2 },
    { universitySlug: "uct", name: "Rondebosch Student Village", type: "Student Housing", priceMin: 4500, priceMax: 7000, distanceKm: 1.5 },
    { universitySlug: "wits", name: "Jacobs Residence", type: "Residence", priceMin: 30000, priceMax: 36000, distanceKm: 0.1 },
    { universitySlug: "wits", name: "Medicampus Private Student Housing", type: "Private", priceMin: 5000, priceMax: 9000, distanceKm: 0.5 },
    { universitySlug: "stellenbosch", name: "Helshoogte Residences", type: "Residence", priceMin: 28000, priceMax: 34000, distanceKm: 0.3 },
    { universitySlug: "stellenbosch", name: "Stellenbosch Student Accommodation", type: "Private", priceMin: 4000, priceMax: 6500, distanceKm: 1.0 },
    { universitySlug: "up", name: "Kollege", type: "Residence", priceMin: 26000, priceMax: 32000, distanceKm: 0.2 },
    { universitySlug: "up", name: "Akasia Student Village", type: "Student Housing", priceMin: 3800, priceMax: 6000, distanceKm: 2.0 },
    { universitySlug: "ukzn", name: "Residence Campus", type: "Residence", priceMin: 22000, priceMax: 28000, distanceKm: 0.1 },
    { universitySlug: "uj", name: "APK Residence", type: "Residence", priceMin: 24000, priceMax: 30000, distanceKm: 0.1 },
    { universitySlug: "uj", name: "Kensington Private Student Res", type: "Private", priceMin: 3500, priceMax: 5500, distanceKm: 3.0 },
  ];

  for (const acc of accommodationData) {
    const uni = universities.find((u) => u.slug === acc.universitySlug);
    if (!uni) continue;
    await prisma.accommodation.create({
      data: {
        universityId: uni.id,
        name: acc.name,
        type: acc.type,
        priceMin: acc.priceMin,
        priceMax: acc.priceMax,
        distanceKm: acc.distanceKm,
      },
    });
  }

  console.log("Created accommodations");

  // Safety Data
  const safetyData = [
    { universitySlug: "uct", areaName: "Rondebosch", safetyScore: 82, crimeRate: "Low", wellLitStreets: true, campusSecurity: true, nearbyPolice: true, emergencyContacts: "UCT Campus Security: 021 650 2222" },
    { universitySlug: "uct", areaName: "Mowbray", safetyScore: 75, crimeRate: "Moderate", wellLitStreets: true, campusSecurity: true, nearbyPolice: true, emergencyContacts: "SAPS Mowbray: 021 685 3200" },
    { universitySlug: "wits", areaName: "Braamfontein", safetyScore: 65, crimeRate: "Moderate", wellLitStreets: true, campusSecurity: true, nearbyPolice: true, emergencyContacts: "Wits Security: 011 488 2211" },
    { universitySlug: "wits", areaName: "Parktown", safetyScore: 78, crimeRate: "Low", wellLitStreets: true, campusSecurity: true, nearbyPolice: true, emergencyContacts: "SAPS Parktown: 011 488 2211" },
    { universitySlug: "stellenbosch", areaName: "Central Stellenbosch", safetyScore: 80, crimeRate: "Low", wellLitStreets: true, campusSecurity: true, nearbyPolice: true, emergencyContacts: "SU Security: 021 808 4444" },
    { universitySlug: "up", areaName: "Hatfield", safetyScore: 70, crimeRate: "Moderate", wellLitStreets: true, campusSecurity: true, nearbyPolice: true, emergencyContacts: "UP Security: 012 420 3111" },
    { universitySlug: "ukzn", areaName: "Westville", safetyScore: 72, crimeRate: "Moderate", wellLitStreets: true, campusSecurity: true, nearbyPolice: true, emergencyContacts: "UKZN Security: 031 260 2222" },
    { universitySlug: "uj", areaName: "APK Campus Area", safetyScore: 68, crimeRate: "Moderate", wellLitStreets: true, campusSecurity: true, nearbyPolice: true, emergencyContacts: "UJ Security: 011 559 2222" },
  ];

  for (const s of safetyData) {
    const uni = universities.find((u) => u.slug === s.universitySlug);
    if (!uni) continue;
    await prisma.safetyData.create({
      data: {
        universityId: uni.id,
        areaName: s.areaName,
        safetyScore: s.safetyScore,
        crimeRate: s.crimeRate,
        wellLitStreets: s.wellLitStreets,
        campusSecurity: s.campusSecurity,
        nearbyPolice: s.nearbyPolice,
        emergencyContacts: s.emergencyContacts,
      },
    });
  }

  console.log("Created safety data");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

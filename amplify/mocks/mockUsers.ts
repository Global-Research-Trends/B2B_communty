// Mock Users Data
// Simulates real user data from DynamoDB
// Each user has different fields filled/null to produce different completion percentages
// Replace this with real DynamoDB queries later — calculation logic stays the same

export interface UserProfile {
  userId: string;
  identity: {
    name: string | null;
    age: number | null;
    educationLevel: string | null;
    fieldOfStudy: string | null;
    graduationYear: number | null;
    occupationStatus: string | null;
    roleLevel: string | null;
    yearsOfExperience: string | null;
    province: string | null;
    city: string | null;
  };
  contact: {
    email: string | null;
    phone: string | null;
    languages: string[];
    preferredContact: string | null;
  };
  documents: {
    organizationType: string | null;
    industry: string | null;
    department: string | null;
    hobbies: string[];
    researchConsent: string | null;
  };
}

export const mockUsers: UserProfile[] = [
  {
    // ~85% complete — almost everything filled
    userId: "USER#001",
    identity: {
      name: "Zain Ali",
      age: 28,
      educationLevel: "Master's Degree",
      fieldOfStudy: "Computer Science",
      graduationYear: 2019,
      occupationStatus: "Employed Full-time",
      roleLevel: "Senior Professional",
      yearsOfExperience: "6-10 years",
      province: "Punjab",
      city: "Lahore",
    },
    contact: {
      email: "zain@gmail.com",
      phone: "+92-300-1234567",
      languages: ["English", "Arabic"],
      preferredContact: null, // missing
    },
    documents: {
      organizationType: "Private Sector",
      industry: "Technology / Software / IT Services",
      department: null, // missing
      hobbies: ["Reading", "Travel"],
      researchConsent: "Yes, willing to participate",
    },
  },

  {
    // ~60% complete — about half filled
    userId: "USER#002",
    identity: {
      name: "Ahmed Raza",
      age: 34,
      educationLevel: "Bachelor's Degree",
      fieldOfStudy: "Business Administration",
      graduationYear: 2012,
      occupationStatus: "Self-employed / Entrepreneur",
      roleLevel: null, // missing
      yearsOfExperience: null, // missing
      province: null, // missing
      city: null, // missing
    },
    contact: {
      email: "ahmed@gmail.com",
      phone: "+92-321-9876543",
      languages: ["English", "Urdu"],
      preferredContact: "Email",
    },
    documents: {
      organizationType: null, // missing
      industry: null, // missing
      department: null, // missing
      hobbies: [], // empty = missing
      researchConsent: null, // missing
    },
  },

  {
    // ~35% complete — very little filled (brand new user)
    userId: "USER#003",
    identity: {
      name: "Sara Malik",
      age: 22,
      educationLevel: null, // missing
      fieldOfStudy: null, // missing
      graduationYear: null, // missing
      occupationStatus: "Student",
      roleLevel: null, // missing
      yearsOfExperience: null, // missing
      province: null, // missing
      city: null, // missing
    },
    contact: {
      email: "sara@gmail.com",
      phone: null, // missing
      languages: [], // empty = missing
      preferredContact: null, // missing
    },
    documents: {
      organizationType: null, // missing
      industry: null, // missing
      department: null, // missing
      hobbies: [], // empty = missing
      researchConsent: null, // missing
    },
  },

  {
    // 100% complete — everything filled
    userId: "USER#004",
    identity: {
      name: "Omar Siddiqui",
      age: 45,
      educationLevel: "Master's Degree",
      fieldOfStudy: "Finance",
      graduationYear: 2002,
      occupationStatus: "Business Owner",
      roleLevel: "C-Level Executive (CEO)",
      yearsOfExperience: "More than 25 years",
      province: "Sindh",
      city: "Karachi",
    },
    contact: {
      email: "omar@gmail.com",
      phone: "+92-333-5556666",
      languages: ["English", "Arabic", "Urdu"],
      preferredContact: "Video call (Zoom, Teams, etc.)",
    },
    documents: {
      organizationType: "Multinational Corporation",
      industry: "Finance / Banking / Insurance",
      department: "Executive / Senior Management",
      hobbies: ["Investing / Personal Finance", "Travel / Exploration"],
      researchConsent: "Yes, and I am available for follow-up interviews",
    },
  },
];
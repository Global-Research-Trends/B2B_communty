// Profile Fields Config
// Defines which fields belong to which category
// If you add or remove a field, only update this file — calculation logic stays the same

export const profileFields = {
  IDENTITY: [
    "name",
    "age",
    "educationLevel",
    "fieldOfStudy",
    "graduationYear",
    "occupationStatus",
    "roleLevel",
    "yearsOfExperience",
    "province",
    "city",
  ],

  CONTACT: [
    "email",
    "phone",
    "languages",
    "preferredContact",
  ],

  DOCUMENTS: [
    "organizationType",
    "industry",
    "department",
    "hobbies",
    "researchConsent",
  ],
} as const;

// Total number of fields across all categories
export const TOTAL_FIELDS = Object.values(profileFields).flat().length; // 19
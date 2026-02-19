// calculateProfile.ts
// Takes a user object, calculates profile completion percentage and incomplete categories

import { profileFields, TOTAL_FIELDS } from "./profileFields";
import { UserProfile } from '../mocks/mockUsers';

// Helper to check if a field is filled
function isFilled(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

export function calculateProfile(user: UserProfile): {
  percentage: number;
  incompleteCategories: string[];
} {
  let filledCount = 0;
  const incompleteCategories: string[] = [];

  // Loop through each category
  for (const [category, fields] of Object.entries(profileFields)) {
    let categoryComplete = true;

    for (const field of fields) {
      // Get the value from the correct nested object
      const section = getCategorySection(user, category);
      const value = section?.[field as keyof typeof section];

      if (isFilled(value)) {
        filledCount++;
      } else {
        categoryComplete = false;
      }
    }

    if (!categoryComplete) {
      incompleteCategories.push(category);
    }
  }

  const percentage = Math.round((filledCount / TOTAL_FIELDS) * 100);

  return {
    percentage,
    incompleteCategories,
  };
}

// Maps category name to the correct section in the user object
function getCategorySection(user: UserProfile, category: string) {
  switch (category) {
    case "IDENTITY":
      return user.identity;
    case "CONTACT":
      return user.contact;
    case "DOCUMENTS":
      return user.documents;
    default:
      return null;
  }
}
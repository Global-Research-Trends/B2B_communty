import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  QuestionnaireResponse: a
    .model({
      owner: a.string().required(),

      // Step 1: Your Role
      roleLevel: a.string(),         // job title
      seniorityLevel: a.string(),
      department: a.string(),

      // Step 2: Your Company
      organizationType: a.string(),
      industry: a.string(),          // JSON array of selected values
      yearsExperience: a.string(),
      companySize: a.string(),
      annualRevenue: a.string(),
      primaryMarket: a.string(),

      // Step 3: Your Goals
      joinReason: a.string(),
      biggestChallenge: a.string(),
      contentPreference: a.string(), // JSON array of selected values

      // Step 4: Background & Location
      educationLevel: a.string(),
      fieldOfStudy: a.string(),
      graduationYear: a.string(),
      occupationStatus: a.string(),
      country: a.string(),
      provinceState: a.string(),
      city: a.string(),

      // Step 5: Preferences & Consent
      languages: a.string(),        // JSON array of selected values
      hobbies: a.string(),          // JSON array of selected values
      participationConsent: a.string(),
      contactPreference: a.string(),

      // Metadata
      completedAt: a.datetime(),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});

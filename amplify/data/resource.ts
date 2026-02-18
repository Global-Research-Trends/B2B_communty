import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  QuestionnaireResponse: a
    .model({
      owner: a.string().required(),

      // Section A: Educational Background
      educationLevel: a.string(),
      fieldOfStudy: a.string(),
      graduationYear: a.string(),

      // Section B: Occupation & Employment
      occupationStatus: a.string(),
      organizationType: a.string(),
      industry: a.string(),       // JSON array of selected values
      department: a.string(),
      roleLevel: a.string(),
      yearsExperience: a.string(),

      // Section C: Personal Information
      provinceState: a.string(),
      city: a.string(),

      // Section D: Hobbies & Interests
      hobbies: a.string(),        // JSON array of selected values

      // Section E: Additional Information
      languages: a.string(),      // JSON array of selected values

      // Section F: Research Participation
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

import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  storage,
});

// Use Cognito alias sign-in so users can authenticate with either username or email.
backend.auth.resources.cfnResources.cfnUserPool.usernameAttributes = undefined;
backend.auth.resources.cfnResources.cfnUserPool.aliasAttributes = ['email'];

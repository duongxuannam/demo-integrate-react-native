import * as Sentry from "@sentry/react-native";

import systemConfig from "../config/system";

Sentry.init({ 
  dsn: 'https://c94f3d2c6b624cb98e91fffc836426c4@sentry.io/1465078', 
});

// Sentry.setTagsContext({
//   environment: systemConfig.ENVIRONMENT,
//   react: true
// });

export * from "@sentry/react-native";
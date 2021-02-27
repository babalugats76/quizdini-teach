const generateMutations = (type, update = false) => ({
  FETCH: `${type}_FETCH`,
  SUCCESS: `${type}_SUCCESS`,
  FAILURE: `${type}_FAILURE`,
  PENDING: `${type}_PENDING`,
  ...(update && { UPDATE: `${type}_UPDATE` }),
});

export const ACCOUNT = generateMutations("ACCOUNT", true);
export const AUTH = generateMutations("AUTH");
export const COUNTRIES = generateMutations("COUNTRIES");
export const STATES = generateMutations("STATES");
export const TOGGLE_LOADING = "TOGGLE_LOADING";

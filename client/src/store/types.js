const generateMutations = (type) => ({
  FETCH: `${type}_FETCH`,
  SUCCESS: `${type}_SUCCESS`,
  FAILURE: `${type}_FAILURE`,
  PENDING: `${type}_PENDING`,
});

export const AUTH = generateMutations("AUTH");
export const TOGGLE_LOADING = "TOGGLE_LOADING";

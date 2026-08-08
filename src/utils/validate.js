const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const isValidEmail = (value) =>
  isNonEmptyString(value) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isArrayOfStrings = (value) =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isValidRole = (value) => value === 'user' || value === 'admin';

export { isNonEmptyString, isValidEmail, isArrayOfStrings, isValidRole };
export const assertNotNull = <T>(
  val: T,
  errorMessage = `Expected 'val' to be defined, but received ${val}`,
): asserts val is NonNullable<T> => {
  if (val === undefined || val === null) {
    throw new Error(errorMessage);
  }
};

export const requireNotNull = <T>(val: T, errorMessage = `Expected 'val' to be defined, but received ${val}`): NonNullable<T> => {
  if (val === undefined || val === null) {
    throw new Error(errorMessage);
  }

  return val;
};

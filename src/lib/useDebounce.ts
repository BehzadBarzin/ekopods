import { useEffect, useState } from "react";

/**
 * Custom hook to handle debouncing.
 *
 * Description:
 * this custom hook delays updating the value until a certain amount of time
 * has passed without any new updates, which is a common technique used to
 * optimize performance in scenarios like search inputs or other user inputs
 * where rapid changes are expected.
 *
 *
 * @param value
 * @param delay
 * @returns
 */
export const useDebounce = <T>(value: T, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncedValue;
};

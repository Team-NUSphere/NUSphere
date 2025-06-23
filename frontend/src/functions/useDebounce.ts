import { useEffect, useState } from "react";

export default function useDebounce<T>(value: T, delay: number): T {
  const [debounceValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const debounceHandler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(debounceHandler);
  }, [value, delay]);

  return debounceValue;
}

import { useCallback, useState } from "react";

export const useFetch = <T extends object[]>(
  url: string,
  options: object
): [
  VoidFunction,
  { data: T | null; loading: boolean; error: string | null }
] => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (data != null) return;
    try {
      setLoading(true);
      const response = await fetch(url, options);
      const result = await response.json();
      setData(result);
    } catch (err: unknown) {
      setError((err as Error).message);
      throw new Error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [data, url, options]);

  return [fetchData, { data, error, loading }];
};

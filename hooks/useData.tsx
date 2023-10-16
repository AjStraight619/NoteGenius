import { fetcher } from "@/lib/fetcher";
import useSWR from "swr";

export default function useData(key: string, options = {}) {
  const { data, error, isLoading } = useSWR(key, () => fetcher(key, options));

  return {
    data,
    isLoading: isLoading,
    isError: error,
  };
}

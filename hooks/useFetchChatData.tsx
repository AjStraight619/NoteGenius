import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

export default function useFetchChatData() {
  const { data, error, isLoading } = useSWR("api/get-chatlogs", fetcher);

  return {
    chats: data,
    isLoading: !error && !data,
    isError: error,
  };
}

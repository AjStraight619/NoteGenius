import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

//TODO: implement this in replce of useEffect fetching in client components

export default function useFetchChatData() {
  const { data, error, isLoading } = useSWR("api/get-chatlogs", fetcher);

  return {
    chats: data,
    isLoading: !error && !data,
    isError: error,
  };
}

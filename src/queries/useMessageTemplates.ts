import { useQuery } from "@tanstack/react-query";
import { fetchMessageTemplates } from "@/apis/messageService";

export const useMessageTemplates = () => {
  return useQuery({
    queryKey: ["messageTemplates"],
    queryFn: fetchMessageTemplates,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

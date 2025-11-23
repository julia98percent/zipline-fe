import { useQuery } from "@tanstack/react-query";
import { fetchMessageTemplates } from "@/apis/messageService";

export const useMessageTemplates = () => {
  return useQuery({
    queryKey: ["messageTemplates"],
    queryFn: fetchMessageTemplates,
  });
};

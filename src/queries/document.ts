import { getRequest } from "@/config/base-query";
import { QueryTagEnums } from "@/config/query-enums";
import { Document } from "@/types";
import { useQuery } from "@tanstack/react-query";

const BASE_URL = "documents";

export const useGetDocumentsQuery = ({
  params,
}: {
  params: { userId?: string };
}) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QueryTagEnums.DOCUMENT, params?.userId],
    queryFn: async () => {
      return await getRequest<Document[]>({
        endpoint: `${BASE_URL}/`,
        config: { params },
      });
    },
  });

  return { data, isLoading, error, refetch };
};

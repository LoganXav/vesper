import { getRequest, deleteRequest, postRequest } from "@/config/base-query";
import { QueryTagEnums } from "@/config/query-enums";
import { Document } from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "documents";

export const useGetDocumentsQuery = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QueryTagEnums.DOCUMENTS],
    queryFn: async () => {
      return await getRequest<Document[]>({
        endpoint: `${BASE_URL}/`,
      });
    },
  });

  return { data, isLoading, error, refetch };
};

export const useGetDocumentQuery = ({ documentId }: { documentId: string }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QueryTagEnums.DOCUMENTS, documentId],
    queryFn: async () => {
      return await getRequest<Document>({
        endpoint: `${BASE_URL}/${documentId}`,
      });
    },
  });

  return { data, isLoading, error, refetch };
};

export const useDeleteDocumentMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteDocumentMutate,
    isPending: deleteDocumentPending,
    error: deleteDocumentError,
  } = useMutation({
    mutationFn: async ({ documentId }: { documentId: string }) => {
      return await deleteRequest({
        endpoint: `${BASE_URL}/${documentId}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryTagEnums.DOCUMENTS],
      });
    },
  });

  return {
    deleteDocumentMutate,
    deleteDocumentPending,
    deleteDocumentError,
  };
};

export const useCreateDocumentMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createDocumentMutate,
    isPending: createDocumentPending,
    error: createDocumentError,
  } = useMutation({
    mutationFn: async ({ title }: { title: string }) => {
      return await postRequest<Document>({
        endpoint: `${BASE_URL}/`,
        payload: { title },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryTagEnums.DOCUMENTS],
      });
    },
  });

  return {
    createDocumentMutate,
    createDocumentPending,
    createDocumentError,
  };
};

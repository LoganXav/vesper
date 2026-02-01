import { deleteRequest, getRequest, postRequest } from "@/config/base-query";
import { QueryTagEnums } from "@/config/query-enums";
import { Chat } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = "chat";

export const useGetChatsQuery = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QueryTagEnums.CHATS],
    queryFn: async () => {
      return await getRequest<Chat[]>({ endpoint: `${BASE_URL}/` });
    },
  });

  return { data, isLoading, error, refetch };
};

export const useGetChatQuery = ({ chatId }: { chatId: string }) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [QueryTagEnums.CHATS, chatId],
    queryFn: async () => {
      return await getRequest<Chat>({ endpoint: `${BASE_URL}/${chatId}` });
    },
  });
  return { data, isLoading, error, refetch };
};

export const useCreateChatMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createChatMutate,
    isPending: createChatPending,
    error: createChatError,
  } = useMutation({
    mutationFn: async ({ title }: { title: string }) => {
      return await postRequest<Chat>({
        endpoint: `${BASE_URL}/`,
        payload: { title },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryTagEnums.CHATS],
      });
    },
  });

  return { createChatMutate, createChatPending, createChatError };
};

export const useDeleteChatMutation = () => {
  const queryClient = useQueryClient();

  const {
    mutate: deleteChatMutate,
    isPending: deleteChatPending,
    error: deleteChatError,
  } = useMutation({
    mutationFn: async ({ chatId }: { chatId: string }) => {
      return await deleteRequest({ endpoint: `${BASE_URL}/${chatId}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryTagEnums.CHATS],
      });
    },
  });

  return {
    deleteChatMutate,
    deleteChatPending,
    deleteChatError,
  };
};

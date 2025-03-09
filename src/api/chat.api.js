import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState()?.auth?.token;
            if (token) {
                headers.append("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Chats", "ChatDetails"],  // Define tag for caching
    endpoints: (builder) => ({
        createGroupChat: builder.mutation({
            query: (body) => ({
                url: "chats/group",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Chats"],  // Invalidate cache to refresh chats
        }),
        createOneToOneChat: builder.mutation({
            query: (userId) => ({
                url: `chats/one-to-one/${userId}`,
                method: "POST",
            }),
            invalidatesTags: ["Chats"],
        }),
        addMembers: builder.mutation({
            query: ({ chatId, body }) => {
                return ({
                    url: `chats/add-participants/${chatId}`,
                    method: "POST",
                    body
                })
            },
            invalidatesTags: (result, error, { chatId }) => [
                "Chats",
                { type: "ChatDetails", id: chatId },
            ],
        }),
        removeMembers: builder.mutation({
            query: ({ chatId, body }) => {
                return ({
                    url: `chats/remove-participants/${chatId}`,
                    method: "POST",
                    body
                })
            },
            invalidatesTags: (result, error, { chatId }) => [
                "Chats",
                { type: "ChatDetails", id: chatId },
            ],
        }),
        addAdmin: builder.mutation({
            query: ({ chatId, body }) => {
                return ({
                    url: `chats/add-admin/${chatId}`,
                    method: "POST",
                    body
                })
            },
            invalidatesTags: (result, error, { chatId }) => [
                "Chats",
                { type: "ChatDetails", id: chatId },
            ],
        }),
        removeAdmin: builder.mutation({
            query: ({ chatId, body }) => {
                return ({
                    url: `chats/remove-admin/${chatId}`,
                    method: "POST",
                    body
                })
            },
            invalidatesTags: (result, error, { chatId }) => [
                "Chats",
                { type: "ChatDetails", id: chatId },
            ],
        }),
        getAllChats: builder.query({
            query: (params) => ({
                url: "chats/all",
                params,
            }),
            providesTags: ["Chats"],
            keepUnusedDataFor: 10,
        }),
        getChatDetails: builder.query({
            query: (chatId) => ({
                url: `chats/details/${chatId}`,
            }),
            providesTags: (result, error, chatId) => [{ type: "ChatDetails", id: chatId }],
            keepUnusedDataFor: 10,
        }),

    }),
});

export const {
    useCreateGroupChatMutation,
    useCreateOneToOneChatMutation,
    useRemoveMembersMutation,
    useAddMembersMutation,
    useGetAllChatsQuery,
    useGetChatDetailsQuery,
    useAddAdminMutation,
    useRemoveAdminMutation
} = chatApi;

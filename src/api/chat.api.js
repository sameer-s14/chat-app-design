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
    tagTypes: ["Chats"],  // Define tag for caching
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
        getAllChats: builder.query({
            query: (params) => ({
                url: "chats/all",
                params, 
            }),
            providesTags: ["Chats"],
            keepUnusedDataFor: 10,
        }),
    }),
});

export const {
    useCreateGroupChatMutation,
    useCreateOneToOneChatMutation,
    useGetAllChatsQuery
} = chatApi;

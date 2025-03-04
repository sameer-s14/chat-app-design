import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config";

export const chatApi = createApi({
    reducerPath: "chatApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL, prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        createGroupChat: builder.mutation({
            query: (body) => ({
                url: "chats/group",
                method: "POST",
                body,
            }),
        }),
        createOneToOneChat: builder.mutation({
            query: (userId) => ({
                url: `chats/one-to-one/${userId}`,
                method: "POST",
                body,
            }),
        }),
        getAllChats: builder.query({
            query: () => "chats/all",
        }),
    }),
});

export const { useCreateGroupChatMutation, useCreateOneToOneChatMutation, useGetAllChatsQuery } = chatApi;

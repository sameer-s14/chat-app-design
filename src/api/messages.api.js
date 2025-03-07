import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config";

export const messagesApi = createApi({
    reducerPath: "messagesApi",
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
    tagTypes: ["Messages"],
    endpoints: (builder) => ({
        getMessages: builder.query({
            query: (chatId, params = {}) => ({
                url: `messages/${chatId}`,
                params,
            }),
            keepUnusedDataFor: 10,
        }),

    }),
});

export const {
    useGetMessagesQuery,
} = messagesApi;

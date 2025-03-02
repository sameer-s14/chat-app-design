import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config";

export const contactsApi = createApi({
    reducerPath: "contactsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Contacts"],
    endpoints: (builder) => ({
        getUserContacts: builder.query({
            query: () => "contacts",
            providesTags: ["Contacts"],
        }),
        addUserContact: builder.mutation({
            query: (newContact) => ({
                url: "contacts",
                method: "POST",
                body: newContact,
            }),
            invalidatesTags: ["Contacts"],
        }),
    }),
});

export const { useGetUserContactsQuery, useAddUserContactMutation } = contactsApi;

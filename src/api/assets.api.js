import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config";

export const assetsApi = createApi({
    reducerPath: 'assetsApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    prepareHeaders: (headers, { getState }) => {
        const token = getState()?.auth?.token;
        if (token) {
            headers.append("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
    endpoints: (builder) => ({
        uploadDirectFiles: builder.mutation({
            query: (formData) => ({
                url: "assets/upload",
                method: "POST",
                body: formData,
            }),
        }),
        deleteFile: builder.mutation({
            query: (url) => ({
                url: `assets/delete?url=${url}`,
                method: "DELETE",
            }),
        }),
    }),
})

export const { useUploadDirectFilesMutation, useDeleteFileMutation } = assetsApi;
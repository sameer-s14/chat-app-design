import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as tus from 'tus-js-client';
import { BASE_URL } from '../config';
import { updateUploadProgress } from '../redux/uploadSlice';

export const uploadApi = createApi({
    reducerPath: 'uploadApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    prepareHeaders: (headers, { getState }) => {
        const token = getState()?.auth?.token;
        if (token) {
            headers.append("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
    endpoints: (builder) => ({
        uploadFile: builder.mutation({
            async queryFn(file, { dispatch, getState }) {
                return new Promise((resolve, reject) => {
                    const upload = new tus.Upload(file.blob, {
                        endpoint: `${BASE_URL}/files/`,
                        retryDelays: [0, 3000, 5000, 10000],
                        metadata: {
                            name: btoa(file.filename),
                            type: btoa(file.filetype),
                        },
                        // resume: true,
                        onProgress: (bytesUploaded, bytesTotal) => {
                            const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                            dispatch(updateUploadProgress({ percentage }));
                        },
                        onSuccess: () => {
                            console.log("✅ Upload completed:", upload.url);
                            resolve({ data: { url: upload.url } });
                        },
                        onError: (error) => {
                            console.error("❌ Upload failed:", error);
                            reject({ error: error.message || "Upload failed" });
                        }
                    });

                    upload.start();
                });
            }
        }),
        finalizeUpload: builder.mutation({
            query: (body) => ({
                url: `/files/finalize`,
                method: 'POST',
                body
            }),
        }),
    })
});

export const { useUploadFileMutation,useFinalizeUploadMutation } = uploadApi;

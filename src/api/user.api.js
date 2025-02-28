import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../config';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }), 
  endpoints: (builder) => ({
    updateUserProfile: builder.mutation({
      query: ({ phone, countryCode }) => ({
        url: 'user/profile',
        method: 'PUT',
        body: { phone, countryCode },
      }),
    }),
   
    getUserProfile: builder.query({
      query: () => ({
        url: 'user/profile',
        method: 'GET',
        headers: (headers, { getState }) => {
          const token = getState().auth.token;
          if (token) headers.set('Authorization', `Bearer ${token}`);
          return headers;
        },
      }),
    }),
  }),
});

export const {useGetUserProfileQuery, useUpdateUserProfileMutation } = userApi;

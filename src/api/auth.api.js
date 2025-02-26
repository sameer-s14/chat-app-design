import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../config";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    loginWithPhone: builder.mutation({
      query: ({ phone, countryCode }) => ({
        url: "auth/login",
        method: "POST",
        body: { phone, countryCode },
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ phone, countryCode, otp }) => ({
        url: "auth/verify-otp",
        method: "POST",
        body: { phone, countryCode, otp },
      }),
    }),
  }),
});

export const { useLoginWithPhoneMutation, useVerifyOtpMutation } = authApi;

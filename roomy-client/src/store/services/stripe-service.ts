import { apiSlice } from "../baseApiSlice";


interface SubscriptionStatus {
  active: boolean;
}

const striptApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createCheckoutSession: build.mutation<any, void>({
      query: () => ({
        url: "payments/create-stripe-session-subscription",
        method: "POST",
      }),
    }),
    getActiveSubscription: build.query<SubscriptionStatus, void>({
      query: () => ({
        url: "payments/get-active-subscription",
      }),
      transformResponse: (response: any) => {
        const active: SubscriptionStatus = {
          active: response.success,
        };
        return active;
      },
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useGetActiveSubscriptionQuery,
  useLazyGetActiveSubscriptionQuery,
} = striptApi;

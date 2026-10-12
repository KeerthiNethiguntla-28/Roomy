import { apiSlice } from "../baseApiSlice";


export interface User {
  _id: string;
  email: string;
  name: string;
  phone: string;
}
export interface UpdateUserReq {
  name: string;
  phone: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<User, void>({
      query: () => ({
        url: "/users/context",
      }),
      transformResponse: (response: User) => {
        const resTrans: User = {
          _id: response._id,
          email: response.email,
          name: response.name,
          phone: response.phone,
        };
        return resTrans;
      },
    }),
    updateUser: build.mutation<any, UpdateUserReq>({
      query: (body) => ({
        url: "/users/update",
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = userApi;

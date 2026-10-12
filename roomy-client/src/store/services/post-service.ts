import { apiSlice } from "../baseApiSlice";
import { FilterInitialState } from "../slices/postFilter-slice";


export interface Post {
  title: string;
  phoneNumber: string;
  streetAddress: string;
  unitNo: string;
  city: string;
  stateCode: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  startDateRange: Date;
  price: number;
  bedCount: number;
  bathCount: number;
  utilities?: string[];
}
interface CompletePostDetails extends Post {
  _id: string;
  active: boolean;
  photos: Photo[];
}
interface UserPosts extends CompletePostDetails {
  approved: boolean;
}
interface Photo {
  url: string;
  _id: string;
}

export const postApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getPosts: build.query<CompletePostDetails[], FilterInitialState>({
      query: (filterDetails) => ({
        url: "/posts",
        params: {
          city: filterDetails.city,
          bathCount: filterDetails.bathCount,
          bedCount: filterDetails.bedCount,
          priceMax: filterDetails.priceMax,
          priceMin: filterDetails.priceMin,
          startDateRange: filterDetails.startDateRange,
        },
      }),
      transformResponse: (response: any) => {
        const data = "data";
        return response.map((post: any) => ({
          _id: post._id,
          title: post.title,
          phoneNumber: post.phoneNumber,
          streetAddress: post.streetAddress,
          unitNo: post.unitNo,
          city: post.city,
          stateCode: post.stateCode,
          zipCode: post.zipCode,
          latitude: post.latitude,
          longitude: post.longitude,
          startDateRange: new Date(post.startDateRange),
          price: post.price,
          bedCount: post.bedCount,
          bathCount: post.bathCount,
          active: post.active,
          photos: post.photos,
        })) as CompletePostDetails[];
      },
    }),
    createPost: build.mutation<any, FormData>({
      query: (body) => ({
        url: "/posts/create",
        method: "POST",
        body,
        formdata: true,
      }),
    }),
    getPostById: build.query<CompletePostDetails, string>({
      query: (id) => ({
        url: `/posts/${id}`,
      }),
      transformResponse: (response: any) => {
        console.log(response, "response");
        return {
          _id: response._id,
          title: response.title,
          phoneNumber: response.phoneNumber,
          streetAddress: response.streetAddress,
          unitNo: response.unitNo,
          city: response.city,
          stateCode: response.stateCode,
          zipCode: response.zipCode,
          latitude: response.latitude,
          longitude: response.longitude,
          startDateRange: new Date(response.startDateRange),
          price: response.price,
          bedCount: response.bedCount,
          bathCount: response.bathCount,
          active: response.active,
          photos: response.photos,
          utilities: response.utilities,
        } as CompletePostDetails;
      },
    }),
    getMyPosts: build.query<UserPosts[], void>({
      query: () => ({
        url: "/posts/user-posts",
      }),
      transformResponse: (response: any) => {
        return response.map((post: any) => ({
          _id: post._id,
          title: post.title,
          phoneNumber: post.phoneNumber,
          streetAddress: post.streetAddress,
          unitNo: post.unitNo,
          city: post.city,
          stateCode: post.stateCode,
          zipCode: post.zipCode,
          latitude: post.latitude,
          longitude: post.longitude,
          startDateRange: new Date(post.startDateRange),
          price: post.price,
          bedCount: post.bedCount,
          bathCount: post.bathCount,
          active: post.active,
          photos: post.photos,
          approved: post.approved,
        })) as UserPosts[];
      },
      providesTags: ["Post"],
    }),
    deletePost: build.mutation<any, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetMyPostsQuery,
  useDeletePostMutation,
} = postApi;

import { apiSlice } from "../baseApiSlice";

export type Address = {
  streetAddress: string;
  unitNo: string;
  city: string;
  stateCode: string;
  zipCode: string;
  latitude: number;
  longitude: number;
};

export interface TomTomDetailsPopup {
  latitute: number;
  longitude: number;
  key: string;
  title: string;
  description: string;
  price: string;
  imageSrc: string;
}

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAddress: build.query<any, string>({
      query: (value: string) => ({
        url: `https://api.tomtom.com/search/2/search/${encodeURIComponent(value)}.json?key=${process.env.NEXT_PUBLIC_TOMTOM_KEY || ""}&countrySet=US&limit=5`,
      }),
      transformResponse: (responseData: any) => {
        return responseData.results.map(
          (result: any): Address => ({
            streetAddress: `${result.address.freeformAddress || ""}`.trim(),
            unitNo: result.address.municipalitySubdivision || "",
            city: result.address.municipality || "",
            stateCode: result.address.countrySubdivision || "",
            zipCode: result.address.postalCode || "",
            latitude: result.position.lat,
            longitude: result.position.lon,
          })
        );
      },
    }),
  }),
});

export const { useGetAddressQuery, useLazyGetAddressQuery } = addressApi;

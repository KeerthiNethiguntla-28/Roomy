"use client";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { createRoot } from "react-dom/client";
import { useSelector } from "react-redux";
import { postApi } from "@/store/services/post-service";
import { PropertyCard } from "./PropertyCard";
import { Skeleton } from "../ui/skeleton";
import { createSelector } from "@reduxjs/toolkit";
import { TomTomDetailsPopup } from "@/store/services/address-service";
import { useAppSelector } from "@/store/store";
import { useSearchParams } from "next/navigation";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const MarkerComponent = ({ id }: { id: string }) => (
  <div
    style={{
      backgroundColor: "black",
      width: "40px",
      height: "30px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
    }}
  >
    {`$${id}`}
  </div>
);

export default function TomTomMap() {
  const cityName = useSearchParams().get("city");
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(-71.101037);
  const [lat, setLat] = useState(42.334155);
  const [zoom, setZoom] = useState(9);

  const filterDetails = useAppSelector((state) => state.postFilterSlice);
  const dataNew = postApi.endpoints.getPosts.select({ ...filterDetails, city: cityName || "" });
  const selectTomTomData = createSelector(dataNew, (postsResult) => {
    const { data, ...rest } = postsResult;
    const extractedData = data?.map((post) => ({
      key: post._id,
      title: post.title,
      description: `${post.bedCount || 0} bedrooms, ${post.bathCount || 0} baths`,
      price: post.price?.toString() || "0",
      imageSrc: post.photos[0]?.url || "/next.svg",
      latitute: post.latitude || 0,
      longitude: post.longitude || 0,
    })) as TomTomDetailsPopup[];
    return { ...rest, data: extractedData };
  });
  const addressData = useSelector(selectTomTomData);

  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
    const roots: ReturnType<typeof createRoot>[] = [];
    if (!addressData.isLoading && addressData.data) {
      addressData?.data.forEach((marker) => {
        const markerEl = document.createElement("div");
        markerEl.className = "marker";
        const markerRoot = createRoot(markerEl);
        roots.push(markerRoot);
        markerRoot.render(<MarkerComponent id={marker.price} />);

        const popupEl = document.createElement("div");
        const popupRoot = createRoot(popupEl);
        roots.push(popupRoot);
        popupRoot.render(
          <div style={{ width: "200px", height: "100px" }}>
            <PropertyCard
              key={marker.key}
              title={marker.title}
              description={marker.description}
              price={`$${marker.price || 0} per month`}
              imageSrc={marker.imageSrc || "/next.svg"}
              propertyId={marker.key}
            />
          </div>
        );

        new mapboxgl.Marker(markerEl, { offset: [0, -20] })
          .setLngLat([marker.longitude, marker.latitute])
          .setPopup(new mapboxgl.Popup().setDOMContent(popupEl))
          .addTo(map.current!);
      });

      map.current.flyTo({
        center: [addressData.data[0]?.longitude || lng, addressData.data[0]?.latitute || lat],
        zoom: 12,
        essential: true,
      });

      return () => {
        roots.forEach(root => root.unmount());
        if (map.current) {
          map.current.remove();
        }
      };
    }
  }, [lng, lat, zoom, addressData]);

  if (!mapboxgl.accessToken) return <p>Map unavailable.</p>;

  if (addressData.isLoading)
    return (
      <div className="flex items-center space-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  return (
    <div
      style={{
        width: "40%",
        height: "667px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

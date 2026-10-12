import { useEffect, useRef } from 'react';
import { Image } from '@phosphor-icons/react/dist/ssr';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

import { Card, CardContent, CardHeader, Typography } from '@mui/material';
import ReactDOM from 'react-dom';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

const MarkerComponent = ({ price }: { price: number }) => (
  <div
    style={{
      backgroundColor: 'black',
      width: '40px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
    }}
  >
    {`$${price}`}
  </div>
);

export interface PropertyMapProps {
  latitute: number;
  longitude: number;
  price: number;
}

export default function PropertyMap({ mapsInfo }: { mapsInfo: PropertyMapProps }) {
  const mapContainerRef = useRef(null);
  console.log(mapsInfo, 'mapsInfo');

  useEffect(() => {
    if (!mapContainerRef.current || !mapboxgl.accessToken) return;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [mapsInfo.longitude, mapsInfo.latitute],
      zoom: 16,
    });
    const markerEl = document.createElement('div');
    markerEl.className = 'marker';
    ReactDOM.render(<MarkerComponent price={mapsInfo.price} />, markerEl);
    new mapboxgl.Marker(markerEl, { offset: [0, -20] }).setLngLat([mapsInfo.longitude, mapsInfo.latitute]).addTo(map);

    return () => map.remove();
  }, [mapsInfo]);

  if (!mapboxgl.accessToken) return <p>Map unavailable.</p>;

  return (
    <section className="w-full px-4 md:px-6 mt-6">
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            color="primary"
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Image size={24} style={{ marginRight: '8px' }} /> Map Location
          </Typography>
          <div ref={mapContainerRef} style={{ width: '100%', height: '400px' }} />
        </CardContent>
      </Card>
    </section>
  );
}

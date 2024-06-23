import React, { useEffect, useState } from "react";
import styles from "./Map.module.css";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import {
  LatLngTuple,
  LeafletEventHandlerFnMap,
  LeafletMouseEvent,
} from "leaflet";
import { useCityContext } from "../contexts/CitiesContextProvider";
import useGeolocation from "../hooks/useGeolocation";
import Button from "./Button";
import useURLPosition from "../hooks/useURLPosition";

const ChangeCenter: React.FC<{ position: LatLngTuple }> = ({ position }) => {
  const map = useMap();
  map.setView(position);
  return null;
};

const DetectClick: React.FC = () => {
  const navigate = useNavigate();
  useMapEvent<keyof LeafletEventHandlerFnMap>("click", (e: LeafletMouseEvent) =>
    navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  );
  return null;
};

const Map: React.FC = () => {
  const [lat, lng] = useURLPosition();
  const { cities } = useCityContext();
  const {
    isLoading: isLoadingPositon,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation();
  const [mapPosition, setMapPosition] = useState<LatLngTuple>([51.505, -0.09]);

  useEffect(() => {
    if (lat && lng) {
      setMapPosition([Number(lat), Number(lng)]);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPositon ? <p>Loading</p> : <p>Use Your Location</p>}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={false}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city, i) => (
          <Marker position={[city.position.lat, city.position.lng]} key={i}>
            <Popup>
              {city.emoji} <br /> {city.cityName}.
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
      </MapContainer>
    </div>
  );
};

export default Map;

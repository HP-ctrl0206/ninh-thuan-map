// src/DistrictMap.js
import React, { useEffect, useState } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

function FitBounds({ data }) {
  const map = useMap();
  useEffect(() => {
    if (data) {
      const layer = L.geoJSON(data);
      map.fitBounds(layer.getBounds());
    }
  }, [data, map]);
  return null;
}

function DistrictMap({ districtKey, onBack }) {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch(`/data/xas/${districtKey}.geojson`)
      .then((res) => res.json())
      .then(setGeoData)
      .catch((err) => console.error("Lỗi tải dữ liệu xã:", err));
  }, [districtKey]);

  return (
    <div>
      <button className="back-button" onClick={onBack}>
        ← Quay lại bản đồ tỉnh
      </button>

      <div className="district-map-frame">
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          center={[11.73, 108.9]}
          zoom={11.5}
          scrollWheelZoom={true}
        >
          {geoData && (
            <>
              <FitBounds data={geoData} />
              <GeoJSON
                data={geoData}
                style={{
                  fillColor: "#a5d6a7",
                  color: "#2e7d32",
                  weight: 1,
                  fillOpacity: 0.7,
                }}
                onEachFeature={(feature, layer) => {
                  const name = feature.properties.NAME_3 || "Xã";
                  layer.bindTooltip(name, {
                    permanent: true,
                    direction: "center",
                    className: "district-label",
                  });
                }}
              />
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default DistrictMap;

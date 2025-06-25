// src/DistrictMap.js
import React, { useEffect, useState } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import XaHistoryTable from "./components/XaHistoryTable";

// ✅ Fit bounds map
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
  const [xaHistoryData, setXaHistoryData] = useState({});
  const [selectedXa, setSelectedXa] = useState(null);

  // ✅ Tải geojson + dữ liệu lịch sử xã
  useEffect(() => {
    fetch(`/data/xas/${districtKey}_xa.geojson`)
      .then((res) => res.json())
      .then(setGeoData)
      .catch((err) => console.error("Lỗi tải GeoJSON xã:", err));

    import(`./data/xaHistory/${districtKey}_xaHistory.js`)
      .then((module) => setXaHistoryData(module.default || {}))
      .catch((err) => {
        console.error("Không thể tải file xaHistory:", err);
        setXaHistoryData({});
      });
  }, [districtKey]);

  // ✅ Khi click vào xã trên bản đồ
  const onEachFeature = (feature, layer) => {
    const name = feature.properties.NAME_3;
    layer.bindTooltip(name, {
      permanent: true,
      direction: "center",
      className: "district-label",
    });

    layer.on("click", () => {
      const info = xaHistoryData[name];
      if (info) {
        setSelectedXa({ ...info, name });
      } else {
        setSelectedXa({
          name,
          description: "Không có dữ liệu lịch sử cho xã này.",
        });
      }
    });
  };

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
                onEachFeature={onEachFeature}
              />
            </>
          )}
        </MapContainer>

        {/* ✅ Hộp thông tin xã khi click */}
        {selectedXa && (
          <div className="xa-info-box">
            <button className="close-btn" onClick={() => setSelectedXa(null)}>
              ×
            </button>
            <h3>{selectedXa.name}</h3>
            {selectedXa.image && (
              <img src={selectedXa.image} alt={selectedXa.name} />
            )}
            <p>{selectedXa.description}</p>

            {selectedXa.timeline && (
              <div>
                <h4>Lịch sử tên gọi:</h4>
                <ul>
                  {selectedXa.timeline.map((entry, idx) => (
                    <li key={idx}>
                      <strong>{entry.period}:</strong> {entry.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ Bảng tổng hợp lịch sử tên gọi các xã */}
      <div style={{ marginTop: "20px" }}>
        <XaHistoryTable xaHistoryData={xaHistoryData} />
      </div>
    </div>
  );
}

export default DistrictMap;

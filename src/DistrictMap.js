import React, { useEffect, useState } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";
import XaHistoryTable from "./components/XaHistoryTable";

// ✅ Tự động zoom vừa khung dữ liệu
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

// ✅ Hàm chuẩn hóa tên để khớp dữ liệu
const normalizeName = (str) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .toLowerCase();

function DistrictMap({ districtKey, onBack }) {
  const [geoData, setGeoData] = useState(null);
  const [xaHistoryData, setXaHistoryData] = useState({});
  const [popupInfoData, setPopupInfoData] = useState({});
  const [selectedXa, setSelectedXa] = useState(null);
  const [dataReady, setDataReady] = useState(false); // ✅ Cờ kiểm tra

  // ✅ Load dữ liệu xã, popup, lịch sử
  useEffect(() => {
    setDataReady(false); // reset khi districtKey thay đổi
    let loaded = 0;

    const checkReady = () => {
      loaded++;
      if (loaded === 3) setDataReady(true);
    };

    fetch(`/data/xas/${districtKey}_xa.geojson`)
      .then((res) => res.json())
      .then((data) => {
        setGeoData(data);
        checkReady();
      })
      .catch(() => checkReady());

    import(`./data/xaHistory/${districtKey}_xaHistory.js`)
      .then((m) => {
        setXaHistoryData(m.default || {});
        checkReady();
      })
      .catch(() => {
        setXaHistoryData({});
        checkReady();
      });

    import(`./data/xaPopupInfo/${districtKey}_popup.js`)
      .then((m) => {
        setPopupInfoData(m.default || {});
        checkReady();
      })
      .catch(() => {
        setPopupInfoData({});
        checkReady();
      });
  }, [districtKey]);

  // ✅ Gắn sự kiện vào từng xã
  const onEachFeature = (feature, layer) => {
    const rawName = feature.properties.NAME_3 || "Xã";
    const displayName = rawName.replace(/([a-z])([A-Z])/g, "$1 $2");
    const nameKey = normalizeName(displayName);

    const popupEntry = Object.entries(popupInfoData).find(
      ([key]) => normalizeName(key) === nameKey
    );
    const historyEntry = Object.entries(xaHistoryData).find(
      ([key]) => normalizeName(key) === nameKey
    );

    const popupInfo = popupEntry ? popupEntry[1] : {};
    const historyInfo = historyEntry ? historyEntry[1] : {};

    layer.bindTooltip(displayName, {
      permanent: true,
      direction: "center",
      className: "district-label",
    });

    layer.on("click", () => {
      setSelectedXa({
        name: popupEntry?.[0] || historyEntry?.[0] || displayName,
        ...popupInfo,
        ...historyInfo,
      });
    });
  };

  return (
    <div>
      <button className="back-button" onClick={onBack}>
        ← Quay lại bản đồ tỉnh
      </button>

      <div className="district-map-frame">
        <MapContainer
          style={{ width: "100%", height: "100%" }}
          center={[11.73, 108.9]}
          zoom={11.5}
          scrollWheelZoom={true}
        >
          {geoData && dataReady && (
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

        {/* ✅ Hiển thị popup khi nhấn vào xã */}
        {selectedXa && (
          <div className="xa-info-box">
            <button className="close-btn" onClick={() => setSelectedXa(null)}>
              ×
            </button>
            <h3>{selectedXa.title || selectedXa.name}</h3>

            {selectedXa.image && (
              <img
                src={selectedXa.image}
                alt={selectedXa.name}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  marginBottom: "10px",
                }}
              />
            )}

            {selectedXa.description && (
              <p style={{ whiteSpace: "pre-line", marginBottom: "10px" }}>
                {selectedXa.description}
              </p>
            )}

            {selectedXa.landmark && (
              <p style={{ fontStyle: "italic", color: "#333" }}>
                <strong>📍 Địa danh, hoạt động nổi bật:</strong>{" "}
                {selectedXa.landmark}
              </p>
            )}

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

      {/* ✅ Bảng tổng hợp tên xã */}
      <div style={{ marginTop: "20px" }}>
        <XaHistoryTable xaHistoryData={xaHistoryData} />
      </div>
    </div>
  );
}

export default DistrictMap;

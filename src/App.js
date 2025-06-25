import React, { useEffect, useState } from 'react';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';
import districtHistory from './data/districtHistory';
import DistrictMap from './DistrictMap'; // ✅ file bản đồ cấp xã

const COLORS = ['#e76f51', '#2a9d8f', '#f4a261', '#e9c46a', '#264653', '#8ecae6', '#90be6d'];

// ✅ Component hiển thị tên huyện
function DistrictLabels({ geoData }) {
  const map = useMap();

  useEffect(() => {
    if (!geoData || !map) return;

    geoData.features.forEach((feature) => {
      const name = feature.properties.NAME_2;
      const center = L.geoJSON(feature).getBounds().getCenter();
      const label = L.divIcon({
        html: `<div class="district-label">${name}</div>`,
        className: '',
      });
      L.marker(center, { icon: label }).addTo(map);
    });
  }, [geoData, map]);

  return null;
}

function App() {
  const [geoData, setGeoData] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [viewDistrictKey, setViewDistrictKey] = useState(null); // ✅ Để chuyển giao diện

  useEffect(() => {
    fetch('./data/ninh_thuan_huyen_2024.geojson')
      .then((res) => res.json())
      .then((data) => setGeoData(data));
  }, []);

  const styleFeature = (feature, index) => ({
    fillColor: COLORS[index % COLORS.length],
    weight: 1,
    opacity: 1,
    color: '#fff',
    fillOpacity: 0.8,
  });

  const onEachDistrict = (feature, layer) => {
    const name = feature.properties.NAME_2;
    layer.on('click', () => {
      const info = districtHistory[name];
      if (info) setSelectedDistrict(info);
    });
  };

  // ✅ Nhấn nút "Xem bản đồ huyện này"
  const handleViewDistrictMap = (districtName) => {
    const key = districtName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") // xóa dấu
      .replace(/[^a-z0-9]/g, '') + '_xa'; // → bacai_xa
    setViewDistrictKey(key);
  };

  // ✅ Giao diện bản đồ cấp xã (DistrictMap)
  if (viewDistrictKey) {
    return <DistrictMap districtKey={viewDistrictKey} onBack={() => setViewDistrictKey(null)} />;
  }

  // ✅ Giao diện bản đồ cấp tỉnh
  return (
    <div className="app-container">
      <h1 className="header-title">Tìm lại tên gọi xưa - Ninh Thuận thời gian</h1>
      <button className="explore-button">Khám phá hành trình thời gian</button>

      <div className="map-frame">
        <MapContainer
          style={{ width: '100%', height: '100%' }}
          center={[11.73, 108.9]}
          zoom={10}
          zoomControl={false}
        >
          {geoData && (
            <>
              <GeoJSON
                data={geoData}
                style={(feature) => {
                  const index = geoData.features.findIndex(
                    (f) => f.properties.NAME_2 === feature.properties.NAME_2
                  );
                  return styleFeature(feature, index);
                }}
                onEachFeature={onEachDistrict}
              />
              <DistrictLabels geoData={geoData} />
            </>
          )}
        </MapContainer>
      </div>

      {/* ✅ Hộp thông tin huyện */}
      {selectedDistrict && (
        <div className="district-info-box">
          <button className="close-btn" onClick={() => setSelectedDistrict(null)}>×</button>
          <h2>{selectedDistrict.name}</h2>
          <img src={selectedDistrict.image} alt={selectedDistrict.name} />
          <pre>{selectedDistrict.history}</pre>
          <button
            className="view-district-button"
            onClick={() => handleViewDistrictMap(selectedDistrict.name)}
          >
            Xem bản đồ huyện này
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

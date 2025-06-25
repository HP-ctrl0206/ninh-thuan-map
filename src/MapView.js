import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function MapView() {
  // Tạo khung ranh giới Ninh Thuận
  const bounds = [
    [11.3, 108.6],  // Góc dưới bên trái
    [11.85, 109.3]  // Góc trên bên phải
  ];

  return (
    <MapContainer
      center={[11.5656, 108.9903]}   // Tọa độ trung tâm Ninh Thuận
      zoom={10}                      // Zoom mặc định khi mở
      minZoom={9}
      maxZoom={14}
      maxBounds={bounds}            // Không cho kéo ra ngoài Ninh Thuận
      maxBoundsViscosity={1.0}      // "dính chặt" vào ranh giới
      scrollWheelZoom={true}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© OpenStreetMap contributors'
      />
    </MapContainer>
  );
}

export default MapView;

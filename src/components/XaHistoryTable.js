import React from "react";
import "./XaHistoryTable.css"; // bạn có thể tạo CSS riêng nếu muốn

function XaHistoryTable({ xaHistoryData, selectedXa }) {
  if (!xaHistoryData.entries || xaHistoryData.entries.length === 0) {
    return <p style={{ textAlign: "center", marginTop: "1em" }}>Không có dữ liệu lịch sử xã.</p>;
  }

  let xaList = xaHistoryData.entries;
  if (selectedXa) {
    xaList = xaList.filter((row) => row.name === selectedXa);
  }

  return (
    <div style={{ padding: "20px", maxWidth: "960px", margin: "auto" }}>
      <h3 style={{ textAlign: "center", color: "#523f2d" }}>
        {selectedXa ? `Lịch sử tên gọi xã "${selectedXa}"` : "Lịch sử tên gọi các xã"}
      </h3>
      <table className="xa-history-table">
        <thead>
          <tr>
            <th>Tên xã hiện nay</th>
            <th>Tên gọi từ 1975 đến nay</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {xaList.map((row, i) => (
            <tr key={i}>
              <td><strong>{row.name}</strong></td>
              <td>{row.history}</td>
              <td>{row.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default XaHistoryTable;

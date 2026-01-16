import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_AUTH } from "../../config";
const EPI = ({ orgUnitId, year, onRowCount, Eventstatus }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({});
  const [rowCount, setRowCount] = useState(0);

  const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=FQGIR6wmBWZ.x2SHCEu9PAk&dimension=FQGIR6wmBWZ.Vb7fspxnk9C&dimension=FQGIR6wmBWZ.HZxJziI710Y&dimension=FQGIR6wmBWZ.cadhpfc552z&dimension=FQGIR6wmBWZ.YmOuSL8j03k&dimension=FQGIR6wmBWZ.D2WuLIJa8sg&dimension=FQGIR6wmBWZ.TF0Dkl68JpA&dimension=FQGIR6wmBWZ.tiF0aOGN1mC&dimension=FQGIR6wmBWZ.fwL5qZQl6hF&dimension=FQGIR6wmBWZ.w33QZtCIVdE&dimension=FQGIR6wmBWZ.j1hB2lmJddI&dimension=FQGIR6wmBWZ.H45XFcl92ZS&stage=FQGIR6wmBWZ&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false&outputIdScheme=UID`;

  // Configuration for EPI equipment
  const equipmentConfig = [
    { key: "Vaccine_refrigerator", label: "1. ຕູ້ເຢັນສະເພາະເພື່ອເກັບຮັກສາວັກຊີນ (Vaccine refrigerator)", imgId: "O0Mn5Npwa16", numbervalue: 27, damagevalue: 30 },
    { key: "Vaccine_carrier", label: "2. ຖົງພາຍວັກຊີນ (Vaccine carrier)", imgId: "iIAUf4qrYn4", numbervalue: 29, damagevalue: 31 },
    { key: "Cold_box", label: "3. ຫີບເຢັນ (Cold box)", imgId: "S5YoXhfmjSm", numbervalue: 22, damagevalue: 24 },
    { key: "AEFI_kit", label: "4. ຊຸດແກ້ໄຂສຸກເສີນ ຫປພຊ (ທີ່ມີຢາ ແລະ ອຸປະກອນຄົບ) (AEFI kit)", imgId: "thEbxL4v29o", numbervalue: 21, damagevalue: 28 },
    { key: "Icepacks", label: "5. ບັ້ງນໍ້າກ້ອນ (Icepacks)", imgId: "kXzUinqxUS3", numbervalue: 26, damagevalue: 32 },
    { key: "Thermometer", label: "6. ເຄື່ອງວັດແທກອຸນຫະພູມຕູ້ເຢັນ (Fridge Tag or Thermometer)", imgId: "fRbHYb63xeq", numbervalue: 23, damagevalue: 25 },

  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // const res = await axios.get(url);
        const res = await axios.get(url, { auth: API_AUTH });

        const eventRows = res.data.rows || [];
        if (onRowCount) {
          onRowCount(eventRows.length);   // ✅ SEND ROW COUNT TO PARENT
        }


        // ✅ VALIDATION: Check row count
        setRowCount(eventRows.length);
               if (!eventRows.length && Eventstatus) {
          Eventstatus("");
                    Eventdate("")

        }
        if (eventRows.length > 0 && Eventstatus) {
          const eventStatus = eventRows[0][19];   // Get directly from original rows
          Eventstatus(eventStatus);
          console.log("Event Status Sent epi:", eventStatus);
        }

        // Map rows dynamically
        const mappedRows = eventRows.map(apiRow => {
          return equipmentConfig.reduce((acc, eq) => {
            acc[`${eq.key}_number`] = apiRow[eq.numbervalue] || "";
            acc[`${eq.key}_damagevalue`] = apiRow[eq.damagevalue] || "";
            return acc;
          }, {});
        });
        setRows(mappedRows);

        if (eventRows.length > 0) {
          const eventUid = eventRows[0][0];

          const fetchImage = async (dataElementUid) => {
            try {
              const res = await axios.get(
                `https://hfml.gov.la/hfml/api/events/files?eventUid=${eventUid}&dataElementUid=${dataElementUid}`,
                { auth: API_AUTH, responseType: 'blob' }
                // {responseType: 'blob' }

              );
              return URL.createObjectURL(res.data);
            } catch {
              return null;
            }
          };

          const imagesObj = {};
          await Promise.all(equipmentConfig.map(async eq => {
            imagesObj[eq.key] = await fetchImage(eq.imgId);
          }));
          setImages(imagesObj);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgUnitId, year]);


  if (loading) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>ກຳລັງໂຫຼດຂໍ້ມູນ ອຸປະກອນ ສໍາລັບວຽກງານ ສັກຢາກັນພະຍາດ (EPI)...</p>
      </div>
    );
  }
  if (!rows.length) return <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
    <h4 className="mb-3">3.3. ຈໍານວນອຸປະກອນສໍາລັບ ວຽກງານສັກຢາກັນພະຍາດ (EPI)</h4>
    <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
  </div>;

  return (
    <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h4 className="mb-3">3.3. ຈໍານວນອຸປະກອນສໍາລັບ ວຽກງານສັກຢາກັນພະຍາດ (EPI)</h4>
      <div className="table-responsive">
    <table className="table">
                        <thead className="table-light">
            <tr>
              <th>ຮູບອຸປະກອນ</th>
              <th>ປະເພດອຸປະກອນ</th>
              <th>ໃຊ້ໄດ້ປົກະຕິ</th>
              <th>ເສຍຫາຍບາງສ່ວນ</th>
            </tr>
          </thead>
 <tbody>
  {rows.map((row, idx) =>
    equipmentConfig.map(eq => (
      <tr key={`${idx}-${eq.key}`}>
        {/* Display Image */}
        <td>
          {images[eq.key] ? (
            <img
              src={images[eq.key]}
              alt={eq.label}
              style={{ width: 80, marginBottom: 20 }}
            />
          ) : (
            <span style={{ color: "red" }}>ບໍ່ມີຮູບ</span>
          )}
        </td>

        {/* Display Label */}
        <td>{eq.label}</td>

        {/* Display Number Value or color it red if below threshold */}
        <td
          style={{
            color:
              eq.key === "Icepacks" &&
              (Number(row[`${eq.key}_number`]) < 8) || (Number(row[`${eq.key}_number`]) ==0) 
                ? "red"
                : "black",
          }}
        >
          {row[`${eq.key}_number`] }
        </td>

        {/* Display Damage Value */}
        <td
          
        >
          {row[`${eq.key}_damagevalue`]}
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default EPI;

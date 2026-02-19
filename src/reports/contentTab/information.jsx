import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
// import { API_AUTH } from "../../config";

const info = ({ orgUnitId, year,onRowCount,Eventstatus }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({});
  const [codeNameMap, setCodeNameMap] = useState({}); // ← NEW state
const [rowCount, setRowCount] = useState(0);
const [apiError, setApiError] = useState(null);


  const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=ZOMnNIWsrX7.T6lMVJitIUM&dimension=ZOMnNIWsrX7.oVmVDoqT8HZ&dimension=ZOMnNIWsrX7.O7cJLIKPknD&dimension=ZOMnNIWsrX7.YlyG4OiR8h8&dimension=ZOMnNIWsrX7.gTWZK4S28jH&dimension=ZOMnNIWsrX7.IPVXRMKjXGK&dimension=ZOMnNIWsrX7.b8eicE9ogrb&dimension=ZOMnNIWsrX7.yXeBNJ4lS3A&dimension=ZOMnNIWsrX7.DUI7h9EBTWN&dimension=ZOMnNIWsrX7.tKUezh4lk7d&stage=ZOMnNIWsrX7&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&pageSize=100&page=1`;

  const equipmentConfig = [
    { key: "printer", label: "5. ເຄື່ອງພິມເອກະສານທີ່ໃຊ້ໄດ້",numbervalue: 28},
    { key: "tv", label: "1. ໜ້າຈໍ ໂທລະພາບ",numbervalue: 23,damagevalue:26,hasDamage: true},
    { key: "microphone", label: "2. ໄມໂຄຣໂຟນ ເຄື່ອນທີ່",hasDamage: true,numbervalue: 22,damagevalue:25},
    { key: "speaker", label: "3. ລໍາໂພງ ເຄື່ອນທີ່",hasDamage: true,numbervalue: 30,damagevalue:21},
    { key: "broad", label: "4. ກະດານດຳ/ກະດານຂາວ",hasDamage: true ,numbervalue: 27,damagevalue:29},
    { key: "storage", label: "5. ບ່ອນເກັບມ້ຽນອຸປະກອນສື່ສານ (ເຊັ່ນ ຕູ້, ຊັ້ນວາງ)",hasDamage: false,yesnovalue: 24 },

    
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // const res = await axios.get(url, { auth: API_AUTH });
        const res = await axios.get(url);

        const eventRows = res.data.rows || [];
const metaItems = res.data.metaData?.items || {};
  if (onRowCount) {
  onRowCount(eventRows.length);   // ✅ SEND ROW COUNT TO PARENT
}

   if (!eventRows.length && Eventstatus) {
        Eventstatus("");
      }

if (eventRows.length > 0 && Eventstatus) {

  const eventStatus = eventRows[0][19];   // Get directly from original rows
  Eventstatus(eventStatus);
  console.log("Event Status Sent mwdicine:", eventStatus);
}
      // ✅ VALIDATION: Check row count
      setRowCount(eventRows.length);
const codeMap = Object.fromEntries(
  Object.entries(metaItems)
    .filter(([_, item]) => item.name)
    .map(([uid, item]) => [uid, item.name])
);

setCodeNameMap(codeMap);



        const mappedRows = eventRows.map(apiRow => {
          return equipmentConfig.reduce((acc, eq) => {
            acc[`${eq.key}_number`] = apiRow[eq.numbervalue] || "";
            acc[`${eq.key}_damagenumber`] = apiRow[eq.damagevalue] || "";
            acc[`${eq.key}_yesnovalue`] = apiRow[eq.yesnovalue] || "";

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
                // { auth: API_AUTH, responseType: 'blob' }
                { responseType: 'blob' }

              );
              return URL.createObjectURL(res.data);
            } catch {
              return null;
            }
          };

          const imagesObj = {};
          await Promise.all(equipmentConfig.map(async eq => {
            if (eq.imgId) imagesObj[eq.key] = await fetchImage(eq.imgId);
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
        <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>ກຳລັງໂຫຼດຂໍ້ມູນ ອຸປະກອນສໍາລັບວຽກງານ ສື່ສານມວນຊົນ...</p>
      </div>
    );
  }
  if (!rows.length) return <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
    <h4 className="mb-3">ອຸປະກອນສໍາລັບວຽກງານ ສື່ສານມວນຊົນ</h4>
    <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
  </div>;

  return (
    <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h4 className="mb-3">ອຸປະກອນສໍາລັບວຽກງານ ສື່ສານມວນຊົນ</h4>
      <div className="table-responsive">
    <table className="table">
                        <thead className="table-light">
            <tr>
              <th>ປະເພດອຸປະກອນ</th>
              <th>ໃຊ້ໄດ້ປົກະຕິ</th>
              <th>ເສຍຫາຍບາງສ່ວນ</th>
            </tr>
          </thead>
<tbody>
  {rows.map((row, idx) =>
    equipmentConfig.map(eq => (
      <tr key={`${idx}-${eq.key}`}>
        <td>{eq.label}</td>

        {/* Normal number */}
    <td>
  {row[`${eq.key}_number`]
    ? row[`${eq.key}_number`]   // ✅ show number first
    : row[`${eq.key}_yesnovalue`]
      ? codeNameMap[row[`${eq.key}_yesnovalue`]]
          || row[`${eq.key}_yesnovalue`]
          || ""
      : ""
  }
</td>


        {/* Damage number */}
        <td>
          {eq.hasDamage
            ? row[`${eq.key}_damagenumber`] || ""
            : "-"
          }
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

export default info;

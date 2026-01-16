import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_AUTH } from "../../config";
import "react-toastify/dist/ReactToastify.css";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import '../validate/print.css'

const Medicine = ({ orgUnitId, year, onRowCount, Eventstatus,Eventdate }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({});
  const [codeNameMap, setCodeNameMap] = useState({}); // ← NEW state

  const [rowCount, setRowCount] = useState(0);
  const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=iMBvvWzdbHs.hoDo6jrqW3E&dimension=iMBvvWzdbHs.n6EI7sgyic6&dimension=iMBvvWzdbHs.gULy8WQcOjh&dimension=iMBvvWzdbHs.GtI1qfnR8fi&dimension=iMBvvWzdbHs.f6kvwtVMZ3P&dimension=iMBvvWzdbHs.WPyPKHKSPyq&dimension=iMBvvWzdbHs.RjsctZCJGfN&dimension=iMBvvWzdbHs.Jne77734RQ3&dimension=iMBvvWzdbHs.uLrUYGguTtA&dimension=iMBvvWzdbHs.CGZkIu1XSNz&dimension=iMBvvWzdbHs.owut2F1GZpP&dimension=iMBvvWzdbHs.C9LsLNcD8aY&dimension=iMBvvWzdbHs.Ef2SB0rzAGC&dimension=iMBvvWzdbHs.ivvJ7CCtplB&dimension=iMBvvWzdbHs.Fpb6YUYgzMN&dimension=iMBvvWzdbHs.CZI8s5Uy8QT&stage=iMBvvWzdbHs&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;

  const equipmentConfig = [
    { key: "tray", label: "1. ຖາດນັບຢາ (Pill Counting Tray)", imgId: "sP9J0AwGr0H", hasDamage: false, numbervalue: 24, YesNovalue: 21 },
    { key: "IndoorThermomete", label: "2. ເຄື່ອງວັດແທກອຸນຫະພຸມຂອງຫ້ອງ  (Indoor Thermometer)", imgId: "yYRgkNLvTts", hasDamage: true, numbervalue: 33, YesNovalue: 29, useplace: 36, other: 30 },
    { key: "ambubagchild2", label: "3. ເຄື່ອງວັດແທກຄວາມຊຸ່ມຂອງຫ້ອງ (Indoor Hygrometer)", imgId: "LI8matximN9", hasDamage: true, numbervalue: 27, YesNovalue: 25, useplace: 23, other: 22 },
    { key: "ambubagchild", label: "4. ຕູ້/ຖ້ານ ເກັບຢາ (Medicine Cabinet / Shelf)", imgId: "COYo5UqZ5JX", hasDamage: true, numbervalue: 32, YesNovalue: 35, useplace: 28, other: 31 },
    { key: "Hemodialysis", label: "5. ຕູ້ເກັບຢາເຢັນ (Pharmaceutical Refrigerator)", hasDamage: false, numbervalue: 34, YesNovalue: 26 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(url, { auth: API_AUTH });
        // const res = await axios.get(url);

        const eventRows = res.data.rows || [];
        const metaData = res.data.metaData;
        if (onRowCount) {
          onRowCount(eventRows.length);   // ✅ SEND ROW COUNT TO PARENT
        }


        // ✅ VALIDATION: Check row count
        setRowCount(eventRows.length);
        if (!eventRows.length && Eventstatus) {
          Eventstatus("");
                    Eventdate("")

        }
            if (eventRows.length > 0 && Eventstatus && Eventdate) {
          const eventStatus = eventRows[0][19]; // Get directly from original rows
          const eventdate = eventRows[0][2]; // Get directly from original rows
          Eventdate(eventdate)
          Eventstatus(eventStatus);
        }
        // ✅ SAFETY CHECK
        if (!Array.isArray(eventRows)) {
          throw new Error("Invalid API response structure");
        }
        // Save codeNameMap to state
        const codeMap = Object.fromEntries(
          Object.entries(metaData.items)
            .filter(([key, item]) => item.code)
            .map(([key, item]) => [item.code, item.name])
        );
        setCodeNameMap(codeMap);

        // Map rows
        const mappedRows = eventRows.map(apiRow => {
          return equipmentConfig.reduce((acc, eq) => {
            acc[`${eq.key}_number`] = apiRow[eq.numbervalue] || "";
            acc[`${eq.key}_yesno`] = apiRow[eq.YesNovalue] || "";
            acc[`${eq.key}_other`] = eq.other !== undefined ? apiRow[eq.other] || "" : "";
            acc[`${eq.key}_use`] = eq.hasDamage && eq.useplace !== undefined ? apiRow[eq.useplace] || "" : "-";
            return acc;
          }, {});
        });

        setRows(mappedRows);

        // Fetch images
        if (eventRows.length > 0) {
          const eventUid = eventRows[0][0];
          const fetchImage = async (dataElementUid) => {
            try {
              const res = await axios.get(
                `https://hfml.gov.la/hfml/api/events/files?eventUid=${eventUid}&dataElementUid=${dataElementUid}`,
                { auth: API_AUTH, responseType: 'blob' }
                // { responseType: 'blob' }

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
        <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>ກຳລັງໂຫຼດຂໍ້ມູນ ອຸປະກອນການຢາ..</p>
      </div>
    );
  }

  if (!rows.length) return (
    <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h4 className="mb-3">3.4. ຈໍານວນອຸປະກອນສໍາລັບ ວຽກງານການຢາ (EMT)</h4>
      <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
    </div>
  );

  return (
    <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h4 className="mb-3">3.4. ຈໍານວນອຸປະກອນສໍາລັບ ວຽກງານການຢາ (EMT)</h4>
      <div className="table-responsive">
    <table className="table">
                        <thead className="table-light">
            <tr>
              <th>ຮູບອຸປະກອນ</th>
              <th>ປະເພດອຸປະກອນ</th>
              <th>ຈໍານວນ ທີ່ນໍາໃຊ້ໄດ້</th>
              <th>ພຽງພໍບໍ່</th>
              <th>ການໃຊ້ງານ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => equipmentConfig.map(eq => (
              <tr key={`${idx}-${eq.key}`}>
                <td>
                  {images[eq.key]
                    ? <img src={images[eq.key]} alt={eq.label} style={{ width: 80, marginBottom: 20 }} />
                    : <span style={{ color: "red" }}>ບໍ່ມີຮູບ</span>}
                </td>
                <td>{eq.label}</td>
                <td>{row[`${eq.key}_number`]}</td>
                <td>
                  {row[`${eq.key}_yesno`] === "1" ? <CheckCircleOutlineIcon style={{ color: "green" }} /> : <HighlightOffIcon style={{ color: "red" }} />}
                </td>
                <td>
                  {row[`${eq.key}_use`] ? codeNameMap[row[`${eq.key}_use`]] || row[`${eq.key}_use`] : ""}
                  {row[`${eq.key}_other`] ? ` / ${codeNameMap[row[`${eq.key}_other`]] || row[`${eq.key}_other`]}` : ""}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Medicine;

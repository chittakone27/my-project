import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_AUTH } from "../../config";
const MCH = ({ orgUnitId, year,onRowCount,Eventstatus }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({});
const [rowCount, setRowCount] = useState(0);


  const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=FQGIR6wmBWZ.E4LgLRcer1T&dimension=FQGIR6wmBWZ.xKQNwzbVcp8&dimension=FQGIR6wmBWZ.YufAR7l6iMd&dimension=FQGIR6wmBWZ.DiNZw4CAiGW&dimension=FQGIR6wmBWZ.y2WKfOse3Q3&dimension=FQGIR6wmBWZ.sIVa4XMuh2P&dimension=FQGIR6wmBWZ.TCJRo52KTmj&dimension=FQGIR6wmBWZ.I2qQThEJBtZ&dimension=FQGIR6wmBWZ.NLmciquYBtA&dimension=FQGIR6wmBWZ.tH0RZuet4SQ&dimension=FQGIR6wmBWZ.dq7StRq2IYF&dimension=FQGIR6wmBWZ.JMhufeXTXtJ&dimension=FQGIR6wmBWZ.qz0RYFSqR36&dimension=FQGIR6wmBWZ.ncCBoKCq9ne&dimension=FQGIR6wmBWZ.prNkyfjJ45f&dimension=FQGIR6wmBWZ.UVB85154Q7J&dimension=FQGIR6wmBWZ.nhnzelgD6OD&dimension=FQGIR6wmBWZ.zxMdn4JiOvD&dimension=FQGIR6wmBWZ.zW1ir3f3KFN&stage=FQGIR6wmBWZ&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;

  const equipmentConfig = [
    { key: "MechanicalweighingA", label: "1. ຊິງສັ່ງນ້ຳໜັກ ຜູ້ໃຫຍ່ ແບບເຂັມໜ້າປັດ ຫຼື ລູກກິ້ງ (Mechanical weighing scale for adult)", imgId: "iJvxiturOfJ",damagevalue:27,numbervalue:38, hasDamage: true },
    { key: "DigitalweighingA", label: "2. ຊິງສັ່ງນ້ຳໜັກ ຜູ້ໃຫຍ່ ແບບດິຈິຕອນ (Digital weighing scale for adult)", imgId: "hzdH5tYXp6i", hasDamage: true ,numbervalue:34,damagevalue:21},
    { key: "MechanicalweighingN", label: "3. ຊິງສັ່ງນ້ຳໜັກ ເດັກນ້ອຍ/ເດັກເກີດໃໝ່ ແບບເຂັມໜ້າປັດ ຫຼື ລູກກີ້ງ (Mechanical weighing scale for newborn / infant)", imgId: "dBVnxaRt1H9", hasDamage: true,damagevalue:22,numbervalue:36 },
    { key: "DigitalweighingN", label: "4. ຊິງສັ່ງນ້ຳໜັກ ເດັກນ້ອຍ/ເດັກເກີດໃໝ່ ແບບດິຈິຕອນ (Digital weighing scale for newborn / infant)", imgId: "iP8Bb0JioYR", hasDamage: true,damagevalue:25,numbervalue:32 },
    { key: "HeightA", label: "5. ເຄື່ອງວັດແທກລວງສູງ ຜູ້ໃຫຍ່ (Height measure for adult)", imgId: "tgv37RgQ5fx", hasDamage: true },
    { key: "HeightN", label: "6. ເຄື່ອງວັດແທກລວງຍາວ ເດັກນ້ອຍ/ເດັກເກີດໃໝ່ (Length measurement for newborn)", imgId: "ryt0IOxj0IT", hasDamage: true,damagevalue:24,numbervalue:23 },
    { key: "Doppler", label: "7. ກ້ອງຟັງສຽງຫົວໃຈເດັກໃນທ້ອງ (Fetus Stethoscope / Traube / Doppler)", imgId: "RBtRSzaPLN3", hasDamage: true ,damagevalue:37,numbervalue:35},
    { key: "Autoclave", label: "8. ຕູ້ອົບຂ້າເຊື້ອ ອຸປະກອນການແພດ (Autoclave for medical sterilization or dried heat sterilization oven)", imgId: "cuMKqPxtNcs", hasDamage: true,damagevalue:29,numbervalue:31 },
    { key: "MUAC", label: "9. ເຊືອກວັດແທກຮອບແຂນ (MUAC measure tape)", imgId: "YpynxWhRad7", hasDamage: true ,damagevalue:39,numbervalue:33 },
    { key: "pinkBook", label: "10. ປຶ້ມບົວ (ປຶ້ມຕິດຕາມສຸຂະພາບແມ່ ແລະ ເດັກ) ຫົວໃໝ່ ທີ່ຍັງເຫຼືອຢູ່ (New MCH Pink Book remaining)", imgId: "", hasDamage: false,numbervalue:30 }, // No damage
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(url, { auth: API_AUTH });
        // const res = await axios.get(url);

        const eventRows = res.data.rows || [];
              if (onRowCount) {
  onRowCount(eventRows.length);   // ✅ SEND ROW COUNT TO PARENT
}


      // ✅ VALIDATION: Check row count
      setRowCount(eventRows.length);

const mappedRows = eventRows.map(apiRow => {
  return equipmentConfig.reduce((acc, eq) => {
    acc[`${eq.key}_number`] = apiRow[eq.numbervalue] || "";
    acc[`${eq.key}_damagevalue`] = apiRow[eq.damagevalue] || "";
    return acc;
  }, {});
});

        setRows(mappedRows);
               if (!eventRows.length && Eventstatus) {
          Eventstatus("");
                    Eventdate("")

        }
if (eventRows.length > 0 && Eventstatus) {
  const eventStatus = eventRows[0][19];   // Get directly from original rows
  Eventstatus(eventStatus);
  console.log("Event Status Sent MCH:", eventStatus);
}

        if (eventRows.length > 0) {
          const eventUid = eventRows[0][0];
          const fetchImage = async (dataElementUid) => {
            try {
              const res = await axios.get(
                `https://hfml.gov.la/hfml/api/events/files?eventUid=${eventUid}&dataElementUid=${dataElementUid}`,
                // { responseType: 'blob' }
                { auth: API_AUTH, responseType: 'blob' }

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
        <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>ກຳລັງໂຫຼດຂໍ້ມູນ ອຸປະກອນ ສໍາລັບວຽກງານ ແມ່ ແລະ ເດັກ (MCH)...</p>
      </div>
    );
  }
  if (!rows.length) return <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
    <h4 className="mb-3">3.2. ຈໍານວນອຸປະກອນສໍາລັບ ວຽກງານ ແມ່ ແລະ ເດັກ (MCH)</h4>
    <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
  </div>;

  return (
    <div style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h4 className="mb-3">3.2. ຈໍານວນອຸປະກອນສໍາລັບ ວຽກງານ ແມ່ ແລະ ເດັກ (MCH)</h4>
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
  {rows.map((row, index) =>
    equipmentConfig.map((item) => (
      <tr key={`${index}-${item.key}`}>
        {/* Display Image */}
        <td>
          {images[item.key] ? (
            <img
              src={images[item.key]}
              alt={item.label}
              style={{ width: 80, marginBottom: 20 }}
            />
          ) : (
            <span style={{ color: "red" }}>ບໍ່ມີຮູບ</span>
          )}
        </td>

        {/* Display Label */}
        <td>{item.label}</td>

        {/* Display Number Value or Damage Value */}
        <td
          style={{
            color:
              
                (item.key === "pinkBook" && Number(row[`${item.key}_number`]) < 12|| Number(row[`${item.key}_number`]) === 0)
                ? "red"
                : "black",
          }}
        >
          {row[`${item.key}_number`] !== "" ? row[`${item.key}_number`] : ""}
        </td>

        {/* Display Damage Value */}
      <td
    
        >
          {item.key === "pinkBook" ? "-" : row[`${item.key}_damagevalue`] !== ""
            ? row[`${item.key}_damagevalue`]
            : ""}
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

export default MCH;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MCH from "./MCH";
import EPI from "./EPI";
import '../validate/print.css'

  import { API_AUTH } from "../../config";

const ClinicalEquipment = ({ orgUnitId, orgUnitLabel, year, onRowCount,onMissingImage,Eventstatus,Eventdate  }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState({}); // Store all image URLs in one object

const [rowCount, setRowCount] = useState(0);
const [apiError, setApiError] = useState(null);


  const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=FQGIR6wmBWZ.k6STi37BjK9&dimension=FQGIR6wmBWZ.NykhziIHZHH&dimension=FQGIR6wmBWZ.OtgdEr2qwQo&dimension=FQGIR6wmBWZ.r1QYYSEXNQk&dimension=FQGIR6wmBWZ.zBZ6m4ta6Vo&dimension=FQGIR6wmBWZ.SMxb3OSjeOU&dimension=FQGIR6wmBWZ.oGJe86IoO1F&dimension=FQGIR6wmBWZ.h12djK5TrqY&dimension=FQGIR6wmBWZ.L5npEph6Ma4&dimension=FQGIR6wmBWZ.cJ7H5LeVezT&dimension=FQGIR6wmBWZ.idf7CX1IHEn&dimension=FQGIR6wmBWZ.YUD4SAQhiJk&dimension=FQGIR6wmBWZ.F4XQkx6tIOZ&dimension=FQGIR6wmBWZ.WNhuDD4EY3i&dimension=FQGIR6wmBWZ.PMJfqiytHz9&dimension=FQGIR6wmBWZ.qhL2JRvNmBj&dimension=FQGIR6wmBWZ.qz0RYFSqR36&dimension=FQGIR6wmBWZ.ncCBoKCq9ne&dimension=FQGIR6wmBWZ.wFgAFRsIKF9&dimension=FQGIR6wmBWZ.Stl24YMrVhY&dimension=FQGIR6wmBWZ.S0ZKr1tEd04&dimension=FQGIR6wmBWZ.yX8OvmJjpco&dimension=FQGIR6wmBWZ.lZAqGYJYMWS&dimension=FQGIR6wmBWZ.pQr0WPezsQo&dimension=FQGIR6wmBWZ.VPvZAg55M28&dimension=FQGIR6wmBWZ.HopiuuO0aYX&dimension=FQGIR6wmBWZ.QQLKL3boten&dimension=FQGIR6wmBWZ.R6c6GyfWTxN&dimension=FQGIR6wmBWZ.VEpdy4pHf8h&dimension=FQGIR6wmBWZ.mvXsDvz4CDZ&dimension=FQGIR6wmBWZ.xE2AQ5qbwkF&dimension=FQGIR6wmBWZ.gGb2bmpFh5l&dimension=FQGIR6wmBWZ.Yw9knrdMLU0&dimension=FQGIR6wmBWZ.osX9NYLl0Lr&dimension=FQGIR6wmBWZ.NZr3tWOJWsq&stage=FQGIR6wmBWZ&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setApiError(null);

    try {
      const res = await axios.get(url, { auth: API_AUTH });
      // const res = await axios.get(url);

      const eventRows = res.data?.rows || [];
      if (onRowCount) {
  onRowCount(eventRows.length);   // ✅ SEND ROW COUNT TO PARENT
}


      // ✅ VALIDATION: Check row count
      setRowCount(eventRows.length);


      // ✅ SAFETY CHECK
      if (!Array.isArray(eventRows)) {
        throw new Error("Invalid API response structure");
      }

      const mappedRows = eventRows.map((row) => ({
        oxy: row[46],
        oxy_damaged: row[51],
        ambubagAdult: row[23],
        ambubagAdult_damaged: row[45],
        ambubagchild: row[25],
        ambubagchild_damaged: row[33],
        Hemodialysis: row[27],
        Hemodialysis_damaged: row[34],
        cbc: row[29],
        cbc_damaged: row[31],
        Adultsphygmomanometer: row[43],
        Adultsphygmomanometer_damaged: row[54],
        Glucometer: row[44],
        Glucometer_damaged: row[26],
        Adultstethoscope: row[42],
        Adultstethoscope_damaged: row[22],
        Pediatricstethoscope: row[47],
        Pediatricstethoscope_damaged: row[48],
        clinicalthermometerMercury: row[32],
        clinicalthermometerMercury_damaged: row[21],
        digitalclinicalthermometer: row[49],
        digitalclinicalthermometer_damaged: row[24],
        raw: row,
      }));

      setRows(mappedRows);
             if (!eventRows.length && Eventstatus) {
          Eventstatus("");
                    Eventdate("")

        }
    if (eventRows.length > 0 && Eventstatus && Eventdate) {
          const eventStatus = eventRows[0][19]; // Get directly from original rows
          const eventdate = eventRows[0][2]; // Get directly from original rows
          Eventdate(eventdate)
          Eventstatus(eventStatus);
        }    // ✅ IMAGE FETCH ONLY IF DATA EXISTS
      if (eventRows.length > 0) {
        const eventUid = eventRows[0][0];

        const dataElements = {
          oxy: "VPvZAg55M28",
          ambubagAdult: "HopiuuO0aYX",
          ambubagchild: "QQLKL3boten",
          Hemodialysis: "R6c6GyfWTxN",
          Hemoglobinometer: "VEpdy4pHf8h",
          Adultsphygmomanometer: "mvXsDvz4CDZ",
          Adultstethoscope: "gGb2bmpFh5l",
          Pediatricstethoscope: "Yw9knrdMLU0",
          clinicalthermometerMercury: "osX9NYLl0Lr",
          digitalclinicalthermometer: "NZr3tWOJWsq",
          Glucometer: "xE2AQ5qbwkF",
        };

        const fetchImage = async (uid) => {
          try {
            const res = await axios.get(
              `https://hfml.gov.la/hfml/api/events/files?eventUid=${eventUid}&dataElementUid=${uid}`,
              { auth: API_AUTH, responseType: "blob" }
              // {responseType: "blob" }

            );
            return URL.createObjectURL(res.data);
          } catch {
            return null;
          }
        };

         const imagesFetched = await Promise.all(
            Object.entries(dataElements).map(async ([key, uid]) => [key, await fetchImage(uid)])
          );

          const finalImages = Object.fromEntries(imagesFetched);
          setImages(finalImages);

          // ✅ Notify parent if any image is missing
          const hasMissing = Object.values(finalImages).some((img) => !img);
          if (hasMissing && onMissingImage) onMissingImage(true);
          else if (onMissingImage) onMissingImage(false);
        }
      } catch (err) {
        console.error("API Error:", err);
        setApiError("Failed to load data");
        toast.error("ດຶງຂໍ້ມູນບໍ່ສຳເລັດ!");
      } finally {
        setLoading(false);
      }
    };

  fetchData();
}, [orgUnitId, year]);
useEffect(() => {
  const missing = Object.values(images).some((img) => !img);
  if (onMissingImage) onMissingImage(missing);
}, [images]);


  if (loading) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>ກຳລັງໂຫຼດຂໍ້ມູນ ອຸປະກອນການແພດພື້ນຖານ...</p>
      </div>
    );
  }

  if (!rows.length)
    return (
      <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h4 className="mb-3">3. ອຸປະກອນການແພດ
</h4>
        <h4 className="mb-3">
3.1. ຈໍານວນ ອຸປະກອນການແພດພື້ນຖານ
</h4>
        <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
      </div>
    );

  const tableConfig = [
    { key: "oxy", label: "1. ເຄື່ອງຜະລິດອົກຊີ (Oxygen concentrator)" },
    { key: "ambubagAdult", label: "2.1. ເຄື່ອງເຊີດຊູ ສໍາລັບຜູ້ໃຫຍ່ (Ambu bag for adult)" },
    { key: "ambubagchild", label: "2.2. ເຄື່ອງເຊີດຊູ ສໍາລັບເດັກນ້ອຍ (Ambu bag for child or infant" },
    { key: "Hemodialysis", label: "3. ເຄື່ອງຟອກໝາກໄຂ່ຫຼັງ (Hemodialysis unit)" },
    { key: "cbc", label: "4. ເຄື່ອງກວດເລືອດ (ຢ່າງໜ້ອຍກວດ CBC ໄດ້ ຫຼື ກວດໄດ້ຫຼາຍກວ່ານັ້ນ) (Hemoglobinometer)" },
    { key: "Adultsphygmomanometer", label: "5. ເຄື່ອງແທກຄວາມດັນເລືອດຜູ້ໃຫຍ່ (Adult sphygmomanometer)" },
    { key: "Glucometer", label: "6. ເຄື່ອງວັດແທກນໍ້າຕານໃນເລືອດ (Glucometer)" },
    { key: "Adultstethoscope", label: "7. ກ້ອງຟັງສໍາລັບຜູ້ໃຫຍ່ (Adult stethoscope)" },
    { key: "Pediatricstethoscope", label: "8. ກ້ອງຟັງສໍາລັບເດັກນ້ອຍ (Pediatric stethoscope)" },
    { key: "clinicalthermometerMercury", label: "9. ບາຫຼອດແບບນໍ້າບາ (Mercury-in-glass clinical thermometer)" },
    { key: "digitalclinicalthermometer", label: "10. ບາຫຼອດດິຈິຕອນ (Digital clinical thermometer)" },
  ];

  return (
    <div>

      <div className="container mt-3" style={{ 
        backgroundColor: "#fff",
        fontFamily: "'Noto Sans Lao', sans-serif",
       }}>

        <h4 className="mb-3">3. ອຸປະກອນການແພດ
</h4>
        <h4 className="mb-3">
3.1. ຈໍານວນ ອຸປະກອນການແພດພື້ນຖານ
</h4>
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
                tableConfig.map((item) => (
                  <tr key={`${index}-${item.key}`}>
                    <td>
                      {images[item.key] ? (
                        <img src={images[item.key]} alt={item.label} style={{ width: 80, marginBottom: 20 }} />
                      ) : (
                        <span style={{ color: "red" }}>ບໍ່ມີຮູບ</span>
                      )}
                    </td>
                    <td>{item.label}</td>
                    <td style={{ color: Number(row[item.key]) === 0 ? 'red' : 'black' }}>
  {row[item.key]}
</td>

                    <td>{row[`${item.key}_damaged`]}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <MCH orgUnitId={orgUnitId} year={year}/>

        </div>
      </div>
      <EPI orgUnitId={orgUnitId} year={year}/>

    </div>
  );
};

export default ClinicalEquipment;

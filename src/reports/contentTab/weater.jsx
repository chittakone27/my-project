import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_AUTH } from "../../config";
import '../validate/print.css'

const Weater = ({ orgUnitId, year, onRowCount, Eventstatus, Eventdate }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=BVTaSDRqTdN.gA11lj9MzAJ&dimension=BVTaSDRqTdN.gRp5CRple2D&dimension=BVTaSDRqTdN.VCuTbYPgpQR&dimension=BVTaSDRqTdN.RAXoivNpNzA&dimension=BVTaSDRqTdN.UHYOUOGzewb&dimension=BVTaSDRqTdN.bF5af9TwZPd&stage=BVTaSDRqTdN&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;

  const equipmentConfig = [
    { key: "c1", label: "C1. ໃນໄລຍະ 5 ປີຜ່ານມາ, ມີເຫດການເຫຼົ່ານີ້ເກີດຂຶ້ນໃນເຂດປົກຄຸມຂອງທ່ານ ຫຼື ບໍ່ ?",numbervalue:21},
    { key: "c2", label: "C2. ໂຄງສ້າງຂອງສະຖານທີ່ (ປ່ອງຢ້ຽມ, ປະຕູ, ຫຼັງຄາ) ໄດ້ຮັບຜົນກະທົບຈາກເຫດການເຫຼົ່ານີ້ ທີ່ເກີດຂຶ້ນຄັ້ງຫຼ້າສຸດ ຫຼື ບໍ່?",numbervalue:26 },
    { key: "c4", label: "C4. ອຸປະກອນທີ່ບໍ່ແມ່ນໂຄງສ້າງ (ຄອມພິວເຕີ, ອຸປະກອນວິເຄາະ, ນ້ຳຢາເຄມີທີ່ໃຊ້ໃນການວິເຄາະ, ໆລໆ) ໄດ້ຮັບຄວາມເສຍຫາຍຈາກເຫດການເຫຼົ່ານີ້ ທີ່ເກີດຂຶ້ນຄັ້ງຫຼ້າສຸດ ຫຼື ບໍ່?",numbervalue:24},
    { key: "c5", label: "C5. ສະຖານທີ່ບໍລິການ ມີມາດຕະການຫຼຸດຜ່ອນຜົນເສຍຫາຍຈາກເຫດການເຫຼົ່ານີ້ ຫຼື  ບໍ່?" ,numbervalue:25},
        { key: "c10", label: "C10. ສະຖານທີ່ບໍລິການ ສາມາດປິ່ນປົວ ອາການເຈັບປ່ວຍ ແລະ ການບາດເຈັບ ທີ່ຕິດພັນກັບເຫດການເຫຼົ່ານີ້ ແລະ ສາມາດໃຫ້ບໍລິການຄົນເຈັບໃນລະຫວ່າງເກີດໄພພິບັດ  ຫຼື ຫຼັງໄພພິບັດ ໄດ້ບໍ່? " ,numbervalue:23},

{key: "c11", label: (
  <div>
    C11. ບຸກຄະລາກອງທາງການແພດໄດ້ຮັບການຝຶກອົບຮົມກ່ຽວກັບ: <br />
    - ຜົນກະທົບຕໍ່ສຸຂະພາບທີ່ຕິດພັນກັບເຫດການເຫຼົ່ານີ້ <br />
    - ມາດຕະການປັບຕົວ ແລະ ສາມາດຮັບມືກັບພາວະສຸກເສີນດ້ານສາທາລະນະສຸກທີ່ຕິດພັນກັບເຫດການເຫຼົ່ານີ້ <br />
    ໄດ້ບໍ?
  </div>
)}

  ]
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url, { auth: API_AUTH });
        // const res = await axios.get(url);

        const eventRows = res.data.rows || [];

        // Send row count to parent
        if (onRowCount) onRowCount(eventRows.length);

        // Map API rows to equipmentConfig keys
        const mappedRows = eventRows.map(apiRow => {
          return equipmentConfig.reduce((acc, eq) => {
            acc[eq.key] = apiRow[eq.numbervalue] || "";
            return acc;
          }, {});
        });
        setRows(mappedRows);
       if (!eventRows.length && Eventstatus) {
          Eventstatus("");
                    Eventdate("")

        }
        // Send event status & date to parent
        if (eventRows.length > 0 && Eventstatus && Eventdate) {
          const eventStatus = eventRows[0][19]; // confirm index
          const eventDate = eventRows[0][2];    // confirm index
          Eventstatus(eventStatus);
          Eventdate(eventDate);
        } else if (eventRows.length === 0 && Eventstatus && Eventdate) {
          Eventstatus("");
          Eventdate("");
        }

      } catch (err) {
        console.error(err);
        toast.error("❌ ບໍ່ສາມາດໂຫຼດຂໍ້ມູນ", { autoClose: 3000 });
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
        <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>ກຳລັງໂຫຼດຂໍ້ມູນ...</p>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
        <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
      </div>
    );
  }

  return (
    <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <div className="table-responsive">
    <table className="table">
          <thead className="table-light">
            <tr>
              <th colSpan={2}>
                ເຫດການດິນຟ້າອາກາດປ່ຽນແປງຢ່າງຮຸນແຮງ
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) =>
              equipmentConfig.map(eq => (
                <tr key={`${idx}-${eq.key}`}>
                  <td>{eq.label}</td>
                  <td style={{ width: "100px" }}>
                    {Number(row[eq.key]) === 1 ? (
                      <span style={{color:"green"}}>ແມ່ນ</span>
                    ) : (
                      <span style={{color:"red"}}>ບໍ່ແມ່ນ</span>
                    )}
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

export default Weater;

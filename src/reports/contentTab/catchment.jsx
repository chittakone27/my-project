import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_AUTH } from "../../config";
import Catchmendry from './catchment_dry';
import Catchmentrain from "./catchment_rain";

const Catchment = ({ year, orgUnitId, setencode, setOrgParentLabel }) => {
  const [orgUnit, setOrgUnit] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
    const [test, settest] = useState(null);
        const [test2, settest2] = useState(null);


  const authHeader = {
    headers: {
      Authorization: `Basic ${btoa(`${API_AUTH.username}:${API_AUTH.password}`)}`,
    },
  };

  // Fetch Org Unit
  useEffect(() => {
    if (!orgUnitId) return;

    axios.get(
      `https://hfml.gov.la/hfml/api/organisationUnits/${orgUnitId}?fields=id,name,displayName,parent[id,name,displayName]`,
      authHeader
    )
    .then(res => {
      setOrgUnit(res.data);
    })
    .catch(err => console.error("Error fetching organisation unit:", err));
  }, [orgUnitId]);

  // คำนวณ OU ID และ Encode และส่งให้ parent
  useEffect(() => {
    if (!orgUnit) return;

    const cleanName = (orgUnit.name || "").replace(/^\([^\)]+\)\s*/, "");
    const abbrev = cleanName.slice(0,2).toUpperCase();
    
    let ouId = null;
    let encodeStr = "";

    if (["HC","DO","DH","CH"].includes(abbrev)) {
      ouId = orgUnit.id;
      encodeStr = "";
    } else if (["PH","PO"].includes(abbrev)) {
      ouId = orgUnit.parent?.id;
      encodeStr = `:LIKE:${encodeURIComponent(orgUnit.name)}`;
    }

    setencode(encodeStr);
    setOrgParentLabel(ouId);
    settest(encodeStr)
    settest2(ouId)

  }, [orgUnit, setencode, setOrgParentLabel]);

  // Fetch Enrollments
  useEffect(() => {
  if (!year || !test2) return;

  const url =
    `https://hfml.gov.la/hfml/api/29/analytics/enrollments/query/sBkMdki30ua.json` +
    `?dimension=pe:${year}` +
    `&dimension=ou:${test2}` +
    `&dimension=JrbpF3DG3FL.bPGQdn3seU8&dimension=JrbpF3DG3FL.fZqEu2DBjTL`+
    `&dimension=RLamCNXOwQ5${test || ""}` +
    `&stage=JrbpF3DG3FL` +
    `&displayProperty=NAME` +
    `&totalPages=false` +
    `&outputType=ENROLLMENT` +
    `&desc=enrollmentdate` +
    `&paging=false`;

  // ✅ CONSOLE FULL LINK
  console.log("🔗 Enrollment API URL:", url);

  axios.get(url, authHeader)
    // axios.get(url)

    .then(res2 => {
      const rows = res2.data.rows || [];
      setEnrollments(
        rows.map(row => ({
          village: row[11] || "",
          name: row[17] || "",
          phone: row[16] || "",
        }))
      );
    })
    .catch(err => console.error("Error fetching enrollment analytics:", err));

}, [year, test, test2]);
  if (!enrollments.length) return <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
    <h4 className="mb-3">4. ການເຂົ້າເຖິງການບໍລິການ</h4>
    <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
  </div>;


  return (
    <div className="container mt-3 table-responsive" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h4 className="mb-3">4. ການເຂົ້າເຖິງການບໍລິການ</h4>
      <table className="table">
        <thead className="table-light">
          <tr>
            <th>ລ/ດ</th>
            <th>ບ້ານໃນເຂດປົກຄຸມ</th>
            <th>ຊື່ ອສບ ຫຼື ນາຍບ້ານ</th>
            <th>ເບີໂທ ອສບ ຫຼື ນາຍບ້ານ</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.village || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
              <td>{item.name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
              <td>{item.phone || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    
    </div>
  );
};

export default Catchment;

import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_AUTH } from "../config";

const BookCover = ({ year, orgUnitId,onParentReady  }) => {
  const [orgUnit, setOrgUnit] = useState(null);
  const [error, setError] = useState(null);

  // ===============================
  // FETCH ORGANISATION UNIT
  // ===============================
  useEffect(() => {
    const username = "owen2";
    const password = "@Abcd1234";

    axios
      .get(
        `https://hfml.gov.la/hfml/api/organisationUnits/${orgUnitId}?fields=id,name,level,displayName,parent[id,name,displayName,parent[id,name,displayName]]`,
        {
          headers: {
      Authorization: `Basic ${btoa(`${API_AUTH.username}:${API_AUTH.password}`)}`,
          },
        }
      )
      .then((res) => setOrgUnit(res.data))
      .catch((err) => {
        console.error("Error fetching organisation unit:", err);
        setError(err);
      });
  }, [orgUnitId]);

  if (error) return <p>Error loading organisation unit: {error.message}</p>;
  if (!orgUnit) return <p>Loading cover data...</p>;

  // ===============================
  // HELPERS
  // ===============================
  const removeCode = (text) => text.replace(/^\([^\)]+\)\s*/, '');
  const removeNumberPrefix = (text) => text.replace(/^\d+\s*/, '');
  const removeLaoPrefix = (text) => text.replace(/^ສທມ|^ຮໝສ|^ຮໝຂ|^ສທຂ\s*/, '');

  const cleanUnitName = removeCode(orgUnit.name);
  const abbreviation = cleanUnitName.slice(0, 2).toUpperCase();

  // Build parent hierarchy
  const buildParentLabel = (unit) => {
    const labels = [];
    let parent = unit.parent;
    while (parent) {
      let name = parent.displayName;
      name = removeNumberPrefix(name);
      labels.push(name);
      parent = parent.parent;
    }
    return labels.join(", ");
  };
  const parentLabel = buildParentLabel(orgUnit);



  // Get org parent label (district / province) based on abbreviation
  const getOrgParentLabel = (abbr, unit) => {
    if (!unit.parent) return "";
    const parentName = removeLaoPrefix(removeNumberPrefix(unit.parent.displayName));

    if (abbr === "HC" || abbr === "DO" || abbr === "DH") {
      return `ຫ້ອງການສາທາລະນະສຸກເມືອງ ${parentName}`;
    }
    if (abbr === "PO") {
      const name = removeLaoPrefix(removeCode(unit.displayName));
      return `ພະແນກສາທາລະນະສຸກແຂວງ ${name}`;
    }
    if (abbr === "PH") {
      const name = removeLaoPrefix(removeCode(unit.displayName));
      return `ໂຮງໝໍແຂວງ ${name}`;
    }
    if (abbr === "CH") {
      const name = removeLaoPrefix(removeCode(unit.displayName));
      return `ໂຮງໝໍສູນກາງ ${name}`;
    }
    return "";
  };

  const orgParentLabel = getOrgParentLabel(abbreviation, orgUnit);

  // ===============================
  // RENDER
  // ===============================
  return (
   <div
      className="d-flex flex-column justify-content-between"
      style={{
        backgroundColor: "#fff",
        fontSize:"14px",
        fontFamily: "'Noto Sans Lao', sans-serif",
        marginRight:"50px",
        marginLeft:"50px"
      }}
    >
      {/* Main text */}
      <div className="mt-5">
        <p style={{fontWeight:"bold"}}>
          ຂ້າພະເຈົ້າຢັ້ງຢືນວ່າ ຂໍ້ມູນໃນບົດລາຍງານສະບັບນີ້ 
          ແມ່ນຖືກຕ້ອງ ແລະ ຄົບຖ້ວນ, ສາມາດນໍາໃຊ້ເຂົ້າໃນວຽກງານການວາງແຜນ.
        </p>
      </div>

      {/* Signatures */}
      <div className="d-flex justify-content-between mt-5">
        <div className="text-center">
          <p style={{fontWeight:"bold"}}>(ລາຍເຊັນ) ຜູ້ເກັບກໍາຂໍ້ມູນ</p>
        </div >
        <div className="text-center">
          <p style={{fontWeight:"bold"}}>(ລາຍເຊັນ) ຫົວໜ້າ {orgParentLabel}</p>
        </div>
      </div>

      {/* Collector input */}
   <label
  className="form-label"
  style={{ display: "block", marginTop: "200px" ,fontWeight:"bold",marginBottom: "300px"}}
>
  ຊື່ຜູ້ເກັບກໍາຂໍ້ມູນ:
</label>

    </div>
  );
};

export default BookCover;

import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
// import { API_AUTH } from "../config";
import Mohlogo from'./image/moh.png'
import './validate/print.css'
const BookCover = ({ year, orgUnitId  }) => {
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
      // Authorization: `Basic ${btoa(`${API_AUTH.username}:${API_AUTH.password}`)}`,
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
  if (!orgUnit) return <p>ກໍາລັງໂຫຼດ ໜ້າປົກບົດລາຍງານ...</p>;

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
     
    >
      {/* Header */}
      <div>
<div className="text-center">
  <img
    src={Mohlogo}
    alt="logo"
    style={{ width: "108px", height: "100px" ,marginBottom:"5px"}}
  />
</div>
        
        <div className="text-center mb-4">

          <h5 className="fw-bold">
            ສາທາລະນະລັດ ປະຊາທິປະໄຕ ປະຊາຊົນລາວ
          </h5>
          <h6 className="fw-semibold">
            ສັນຕິພາບ ເອກະລາດ ປະຊາທິປະໄຕ ເອກະພາບ ວັດທະນາຖາວອນ
          </h6>
        </div>

        <div className="d-flex justify-content-between mt-3" style={{fontSize:"20px"}}>
          <div>
            <p>ກະຊວງສາທາລະນະສຸກ</p>
            <p>{orgParentLabel}</p>
          </div>

          <div className="text-end" style={{fontSize:"20px"}}>
            <p>ເລກທີ: ................... ⁄ ..........</p>
            <p>ທີ່ .............................., ລົງວັນທີ:..../....../.......</p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center"style={{marginTop:"200px"}}>
        <h1 className="fw-bold">
          ບົດລາຍງານໂຄງຮ່າງພື້ນຖານປະຈໍາປີ {year}
        </h1>

        <h3 className="fs-5 mt-3">{orgUnit.displayName}</h3>
        <h3  className="fs-5">{parentLabel}</h3>
      </div>

      {/* Footer */}
      <div className="text-center"style={{fontSize:"20px",marginTop:"400px"}}>
        <p>ກະຊວງສາທາລະນະສຸກ</p>
        <p>ສະໜັບສະໜູນໂດຍ ອົງການອະນາໄມໂລກ (WHO)</p>
      </div>
    </div>
  );
};

export default BookCover;

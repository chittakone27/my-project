import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_AUTH } from "@/config";
const Healthstatus = ({ orgUnitId, year, Hstatus, setCode }) => {
  const [options, setOptions] = useState({});

  const url = `https://hfml.gov.la/hfml/api/29/analytics/enrollments/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=H6D3yonJvno&stage=BVTaSDRqTdN&displayProperty=NAME&totalPages=false&outputType=ENROLLMENT&desc=enrollmentdate&paging=false`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(url, { auth: API_AUTH });
        // const res = await axios.get(url);

        const eventRows = res.data.rows || [];
        const items = res.data.metaData?.items || {};
        setOptions(items);

        if (eventRows.length === 0) {
          Hstatus?.(""); // no display name
          setCode?.(""); // no code
          return;
        }

        const row = eventRows[0];
const code = row[16]; // "Functioning"

const optionItem = Object.values(items).find(
  item => item?.code === code
);

const displayName = optionItem?.name || code;
console.log(`code ${code}`)
console.log(`displayname ${displayName}`)

        setCode?.(code);
        Hstatus?.(displayName);
      } catch (err) {
        console.error(err);
        Hstatus?.("");
        setCode?.("");
      }
    };

    if (orgUnitId && year) fetchData();
  }, [orgUnitId, year, Hstatus, setCode]);

  return null; // This component does not render anything
};

export default Healthstatus;

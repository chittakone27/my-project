import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_AUTH } from "../../config";

const FDstaff = ({ orgUnitId, year, setname, setphone, setposition,setaltname, setaltphone, setaltposition }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const url =
    `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json` +
    `?dimension=pe:${year}` +
    `&dimension=ou:${orgUnitId}` +
    `&dimension=L6OUrGJCq69.ys9gwlNQI6O` +
    `&dimension=L6OUrGJCq69.UolkLtgV0ok` +
    `&dimension=L6OUrGJCq69.eMpdHlqBuwX` +
    `&dimension=L6OUrGJCq69.xFoRSTv7U1o` +
    `&dimension=L6OUrGJCq69.uIRCTJaftAU` +
    `&dimension=L6OUrGJCq69.x0qUIKz3dz8` +
    `&stage=L6OUrGJCq69` +
    `&outputType=EVENT&paging=false`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await axios.get(url, { auth: API_AUTH });
        // const res = await axios.get(url);

        const rows = res.data.rows || [];

        if (!rows.length) return;

        const row = rows[0];

        const name = row[23];
        const phone = row[25];
        const position = row[26];
        const altname = row[22];
        const altphone = row[21];
        const altposition = row[24];
        setname?.(name);
        setphone?.(phone);
        setposition?.(position);
          setaltname?.(altname);
        setaltphone?.(altphone);
        setaltposition?.(altposition);

      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (orgUnitId && year) fetchData();
  }, [orgUnitId, year, setname, setphone, setposition,setaltname, setaltphone, setaltposition]);

  return null;
};

export default FDstaff;

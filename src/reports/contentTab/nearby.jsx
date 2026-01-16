import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_AUTH } from "../../config";
import Nearby_dry from "./nearby_dry";
import Nearby_rain from "./nearby_rain";
import '../validate/print.css'

const Nearby = ({ orgUnitId, year, onRowCount, Eventstatus }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({});

  const url = `https://hfml.gov.la/hfml/api/29/analytics/enrollments/query/gr24luudE0t.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=rsXdExpMW65&dimension=WH4Az6TJ5ZA&dimension=Jy7ou2LCeju&dimension=pvY01Pt3GTk&dimension=VF9VIPxkf9z&dimension=GbubCuHuzM7&dimension=f9d4P9maZEq&dimension=SxKvvxpzop9&dimension=U4k2WoPO2dN&dimension=MFb4L2Ju4iu&dimension=kFHo6CSy7B0&stage=MLBhJz9GKds&displayProperty=NAME&totalPages=false&outputType=ENROLLMENT&desc=enrollmentdate&paging=false`;

  const equipmentConfig = [
    { key: "nearby", name: [19, 26, 23, 22], numbervalue: 21, village: 25, dis: [17, 18], Ph: [20, 24] },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(url, { auth: API_AUTH });
        // const res = await axios.get(url);

        const eventRows = res.data.rows || [];

        if (onRowCount) onRowCount(eventRows.length);

        // Map the rows with the correct name priority
        const mappedRows = eventRows.map(apiRow => {
          return equipmentConfig.reduce((acc, eq) => {
            // Number column: Use the 21st column for number
            acc[`${eq.key}_number`] = apiRow[eq.numbervalue] || "";

            // Name column: Use the priority list (19, 26, 23, 22)
            acc[`${eq.key}_name`] =
              eq.name
                .map(i => apiRow[i]) // Extract values based on the indices
                .find(v => v && v !== "") || ""; // Find the first non-empty value

            // Address columns (village, district, and province)
            acc[`${eq.key}_village`] = apiRow[eq.village] || "";

            // Handle the district and province with fallback logic
            const districtValue = apiRow[eq.dis[0]] || apiRow[eq.dis[1]];
            acc[`${eq.key}_dis`] = districtValue || "";

            const provinceValue = apiRow[eq.Ph[0]] || apiRow[eq.Ph[1]];
            acc[`${eq.key}_ph`] = provinceValue || "";

            return acc;
          }, {});
        });

        setRows(mappedRows);
        setOptions(res.data.metaData.items || {});
               if (!eventRows.length && Eventstatus) {
          Eventstatus("");
                    Eventdate("")

        }

        if (eventRows.length === 0 && Eventstatus) Eventstatus("");
        if (eventRows.length > 0 && Eventstatus) {
          Eventstatus(eventRows[0][19]); // For event status, use the 19th column
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgUnitId, year]);

  const getDisplayName = (code) => {
    const match = Object.values(options).find((item) => item.code === code);
    return match ? match.name : code;
  };

  // Helper function to join non-empty address values
  const formatAddress = (village, district, province) => {
    const addressParts = [village, district, province].filter(part => part); // Filter out empty parts
    return addressParts.join(" / "); // Join them with "/"
  };

  if (loading) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
          ກຳລັງໂຫຼດຂໍ້ມູນ...
        </p>
      </div>
    );
  }

  if (!rows.length)
    return (
      <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
        <h4 className="mb-3">4.2. ການເດີນທາງໄປ ສະຖານທີ່ບໍລິການໃກ້ຄຽງ </h4>
        <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
      </div>
    );

  return (
    <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h4 className="mb-3">4.2. ການເດີນທາງໄປ ສະຖານທີ່ບໍລິການໃກ້ຄຽງ </h4>

    <table className="table">
        <thead className="table-light">
          <tr>
            <th>ລ/ດ</th>
            <th>ສະຖານທີ່ບໍລິການໃຫ້ຄຽງ</th>
            <th>ປະເພດ</th>
            <th>ບ້ານ, ເມືອງ, ແຂວງ, ປະເທດ</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, idx) =>
            equipmentConfig.map(eq => (
              <tr key={`${idx}-${eq.key}`}>
                {/* Row number */}
                <td>{idx + 1}</td>

                {/* Name column (first non-empty value based on priority) */}
                <td>{row[`${eq.key}_name`]}</td>
                <td>{getDisplayName(row[`${eq.key}_number`])}</td>

                {/* Display address: Village, District, and Province */}
                <td>
                  {formatAddress(
                    getDisplayName(row[`${eq.key}_village`]),
                    getDisplayName(row[`${eq.key}_dis`]),
                    getDisplayName(row[`${eq.key}_ph`])
                  )}
                </td>

                {/* Optional: You can add additional columns if needed */}
              </tr>
            ))
          )}
        </tbody>
      </table>
<Nearby_dry orgUnitId={orgUnitId} year={year}/>
<Nearby_rain orgUnitId={orgUnitId} year={year}/>

    </div>
  );
};

export default Nearby;

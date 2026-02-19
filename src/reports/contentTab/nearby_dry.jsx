import React, { useEffect, useState } from "react";
import axios from "axios";
// import { API_AUTH } from "../../config";
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SailingIcon from '@mui/icons-material/Sailing';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Dangerous } from "@mui/icons-material";
const Nearby_dry = ({ orgUnitId, year }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({});

  const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/gr24luudE0t.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=rsXdExpMW65&dimension=Jy7ou2LCeju&dimension=WH4Az6TJ5ZA&dimension=f9d4P9maZEq&dimension=MLBhJz9GKds.K4RyAstSuIe&dimension=MLBhJz9GKds.f40RBOQlDi1&dimension=MLBhJz9GKds.NI37vfjXk6J&dimension=MLBhJz9GKds.jaHGxAr3E9p&dimension=MLBhJz9GKds.P554rYBYhyN&dimension=MLBhJz9GKds.dfMxJtpEVY0&dimension=MLBhJz9GKds.Bokim7QLnF8&dimension=MLBhJz9GKds.bcnCvxfxNeF&dimension=MLBhJz9GKds.yZfjh0SBRzz&dimension=MLBhJz9GKds.dBK06ybZUbT&dimension=MLBhJz9GKds.vBpU3LPtQHw&dimension=MLBhJz9GKds.wrXGoTI4uQH&stage=MLBhJz9GKds&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;

  const equipmentConfig = [
    { key: "nearby", name: [27, 26, 35, 32], bike: 22, walk: 29, boat: 24, km: 30 , feetruck:31, feehuman:25,feeboat:23,Dangerous:34},
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // const res = await axios.get(url, { auth: API_AUTH });
        const res = await axios.get(url);

        const eventRows = res.data.rows || [];

        // Map the rows with the correct name priority
        const mappedRows = eventRows.map(apiRow => {
          return equipmentConfig.reduce((acc, eq) => {
            // Number column: Use the 21st column for number
            acc[`${eq.key}_bike`] = apiRow[eq.bike] || "";

            // Name column: Use the priority list (27, 36, 32)
            acc[`${eq.key}_name`] =
              eq.name
                .map(i => apiRow[i]) // Extract values based on the indices
                .find(v => v && v !== "") || ""; // Find the first non-empty value

            // Address columns (village, district, and province)
            acc[`${eq.key}_walk`] = apiRow[eq.walk] || "";
            acc[`${eq.key}_boat`] = apiRow[eq.boat] || "";
            acc[`${eq.key}_km`] = apiRow[eq.km] || "";
            acc[`${eq.key}_feetruck`] = apiRow[eq.feetruck] || "";
            acc[`${eq.key}_feehuman`] = apiRow[eq.feehuman] || "";
            acc[`${eq.key}_feeboat`] = apiRow[eq.feeboat] || "";
            acc[`${eq.key}_Dangerous`] = apiRow[eq.Dangerous] || "";


            return acc;
          }, {});
        });

        // Sort rows alphabetically based on the name field
        const sortedRows = mappedRows.sort((a, b) => {
          const nameA = a[`${equipmentConfig[0].key}_name`].toLowerCase();
          const nameB = b[`${equipmentConfig[0].key}_name`].toLowerCase();
          return nameA.localeCompare(nameB);
        });

        setRows(sortedRows);
        setOptions(res.data.metaData.items || {});
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

  // Helper function to chunk the rows into grids of 7 items each
  const chunkRows = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const chunkedRows = chunkRows(rows, 7);

  // Function to find the highest km value in a grid
  const getHighestKm = (grid) => {
    return grid.reduce((max, row) => {
      const kmValue = parseFloat(row[`${equipmentConfig[0].key}_km`]);
      return kmValue > max ? kmValue : max;
    }, 0); // Initialize with 0 as the lowest possible value
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
        <h4 className="mb-3">4.2.1 ການເດີນທາງໄປ ສະຖານທີ່ບໍລິການໃກ້ຄຽງ ໃນລະດູແລ້ງ  </h4>
        <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
      </div>
    );

  return (
    <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h4 className="mb-3">4.2.1 ການເດີນທາງໄປ ສະຖານທີ່ບໍລິການໃກ້ຄຽງ ໃນລະດູແລ້ງ </h4>

      {/* Render each grid section */}
      {chunkedRows.map((grid, index) => {
        const startKm = index * 7 + 1;
        const endKm = (index + 1) * 7;

        // Get the highest km value in this grid
        const highestKm = getHighestKm(grid);

        return (
          <div key={index} style={{ marginBottom: '2rem' }}>
            {/* Title for each grid section with arrow */}
             <h5 style={{ marginTop: '1rem', fontWeight: 'bold',textAlign:"center" }}>
              ໄລຍະທາງໄກສຸດ: {highestKm} KM
            </h5>
            <div style={{ borderBottom: '10px solid #1744a0ff', marginTop: '0.5rem' }} />


            {/* Grid container */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns per row
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              {grid.map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1rem',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <h3>{row[`${equipmentConfig[0].key}_km`]} KM</h3>
                  <h6>{row[`${equipmentConfig[0].key}_name`]}</h6>

                  {/* Bike */}
                  {getDisplayName(row[`${equipmentConfig[0].key}_bike`]) && (
                    <p><strong><TwoWheelerIcon style={{ fontSize: "30px" }} /> : </strong> {getDisplayName(row[`${equipmentConfig[0].key}_bike`])} ນາທີ</p>
                  )}

                  {/* Walk */}
                  {getDisplayName(row[`${equipmentConfig[0].key}_walk`]) && (
                    <p><strong><DirectionsRunIcon style={{ fontSize: "30px" }} /> : </strong> {getDisplayName(row[`${equipmentConfig[0].key}_walk`])} ນາທີ</p>
                  )}
  {getDisplayName(row[`${equipmentConfig[0].key}_boat`]) && (
                    <p><strong><SailingIcon style={{ fontSize: "30px" }} /> : </strong> {getDisplayName(row[`${equipmentConfig[0].key}_boat`])} ນາທີ</p>
                  )}
 {Number(row[`${equipmentConfig[0].key}_Dangerous`]) === 1 && (
                    <p><strong><ReportProblemIcon style={{ fontSize: "30px" }} /> : </strong> ຫົນທາງຊັນ ຫຼື ອັນຕະລາຍ</p>
                  )}
                  
                  {/* Boat */}
{row[`${equipmentConfig[0].key}_feetruck`] && row[`${equipmentConfig[0].key}_feetruck`] !== "" && row[`${equipmentConfig[0].key}_feetruck`] !== "0"  && (
  <p>
    <strong>ຈ້າງລົດ (ຊິ້ງ) : </strong> 
    {Math.round(row[`${equipmentConfig[0].key}_feetruck`]).toLocaleString()} ກີບ
  </p>
)}

{row[`${equipmentConfig[0].key}_feehuman`] && row[`${equipmentConfig[0].key}_feehuman`] !== "" && row[`${equipmentConfig[0].key}_feehuman`] !== "0" && (
  <p>
    <strong>ຈ້າງຄົນຍົກຂ້າມ : </strong> 
    {Math.round(row[`${equipmentConfig[0].key}_feehuman`]).toLocaleString()} ກີບ
  </p>
)}

{row[`${equipmentConfig[0].key}_feeboat`] && row[`${equipmentConfig[0].key}_feeboat`] !== "" && row[`${equipmentConfig[0].key}_feeboat`] !== "0"&& (
  <p>
    <strong>ຄ່າເຮືອ : </strong> 
    {Math.round(row[`${equipmentConfig[0].key}_feeboat`]).toLocaleString()} ກີບ
  </p>
)}


                </div>
              ))}
            </div>

            {/* Display highest km for the grid */}
           
          </div>
        );
      })}
    </div>
  );
};

export default Nearby_dry;

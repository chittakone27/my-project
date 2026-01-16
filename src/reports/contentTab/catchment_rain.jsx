import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_AUTH } from "../../config";
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import SailingIcon from '@mui/icons-material/Sailing';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { Dangerous } from "@mui/icons-material";
import RemoveRoadIcon from '@mui/icons-material/RemoveRoad';
const catchment_rain = ({ orgUnitId, year,Encode }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({});

  const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/sBkMdki30ua.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=RLamCNXOwQ5${Encode}&dimension=JrbpF3DG3FL.SZZt8ASRupD&dimension=JrbpF3DG3FL.eLZZDJq63Lx&dimension=JrbpF3DG3FL.OchVqUn7V0b&dimension=JrbpF3DG3FL.WJ9rQPMdnfo&dimension=JrbpF3DG3FL.EwZZZTIDA8c&dimension=JrbpF3DG3FL.coY9D79R7l4&dimension=JrbpF3DG3FL.d7eFdiZip4P&dimension=JrbpF3DG3FL.GWjkmxiRjk0&dimension=JrbpF3DG3FL.H7wG8lNIkrC&dimension=JrbpF3DG3FL.boNkAhvANYo&dimension=JrbpF3DG3FL.ISndNMGW9xi&dimension=JrbpF3DG3FL.GkV6y3THu3M&dimension=JrbpF3DG3FL.CFpxTPRuM5q&stage=JrbpF3DG3FL&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;

  const equipmentConfig = [
    { key: "nearby", name: 15, bike: 21, walk: 25, boat: 24, km: 26 , feetruck:31, feehuman:27,feeboat:32,Dangerous:22,rain:33},
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(url, { auth: API_AUTH });
        // const res = await axios.get(url);

        const eventRows = res.data.rows || [];

        // Map the rows with the correct name priority
        const mappedRows = eventRows.map(apiRow => {
          return equipmentConfig.reduce((acc, eq) => {
            // Number column: Use the 21st column for number
            acc[`${eq.key}_bike`] = apiRow[eq.bike] || "";
            acc[`${eq.key}_name`] = apiRow[eq.name] || "";

         

            // Address columns (village, district, and province)
            acc[`${eq.key}_walk`] = apiRow[eq.walk] || "";
            acc[`${eq.key}_boat`] = apiRow[eq.boat] || "";
            acc[`${eq.key}_km`] = apiRow[eq.km] || "";
            acc[`${eq.key}_feetruck`] = apiRow[eq.feetruck] || "";
            acc[`${eq.key}_feehuman`] = apiRow[eq.feehuman] || "";
            acc[`${eq.key}_feeboat`] = apiRow[eq.feeboat] || "";
            acc[`${eq.key}_Dangerous`] = apiRow[eq.Dangerous] || "";
            acc[`${eq.key}_rain`] = apiRow[eq.rain] || "";


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
        <h4 className="mb-3">4.1.2 ການເດີນທາງໄປ ສະຖານທີ່ບໍລິການໃກ້ຄຽງ ໃນລະດູຝົນ  </h4>
        <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
      </div>
    );

  return (
    <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h4 className="mb-3">4.1.2 ການເດີນທາງໄປ ສະຖານທີ່ບໍລິການໃກ້ຄຽງ ໃນລະດູຝົນ </h4>

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
                  <h3>{row[`${equipmentConfig[0].key}_km`] || "0"} KM</h3>
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
                   {Number(row[`${equipmentConfig[0].key}_rain`]) === 1 && (
                    <p><strong><RemoveRoadIcon style={{ fontSize: "30px" }} /> : </strong> ເສັ້ນທາງເປເພ່ໃນລະດູຝົນ</p>
                  )}
                  
                  {/* Boat */}
{row[`${equipmentConfig[0].key}_feetruck`] && row[`${equipmentConfig[0].key}_feetruck`] !== "" && row[`${equipmentConfig[0].key}_feetruck`] !== "0" && (
  <p>
    <strong>ຈ້າງລົດ (ຊິ້ງ) : </strong> 
    {Math.round(row[`${equipmentConfig[0].key}_feetruck`]).toLocaleString()} ກີບ
  </p>
)}

{row[`${equipmentConfig[0].key}_feehuman`] && row[`${equipmentConfig[0].key}_feehuman`] !== "" && row[`${equipmentConfig[0].key}_feehuman`] !== "0"&& (
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

export default catchment_rain;

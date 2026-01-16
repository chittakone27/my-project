import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_AUTH } from "../../config";

const ICTvalidate = ({ orgUnitId, year, onStatusChange }) => {
  const [loading, setLoading] = useState(true);

  const [aggregateCounts, setAggregateCounts] = useState({});
  const [individualAllCounts, setIndividualAllCounts] = useState({});
  const [individualCompletedCounts, setIndividualCompletedCounts] = useState({});
  const [photoStatus, setPhotoStatus] = useState({});

  // ---------- API ----------
  const aggregateUrl =
    `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json` +
    `?dimension=pe:${year}&dimension=ou:${orgUnitId}` +
    `&dimension=ZOMnNIWsrX7.ZraIdLXHWJL` +
    `&dimension=ZOMnNIWsrX7.ZoOgJhHc6kb` +
    `&dimension=ZOMnNIWsrX7.irv2W8HK0ct` +
    `&dimension=ZOMnNIWsrX7.hpCEeAhTdQv` +
    `&stage=ZOMnNIWsrX7&outputType=EVENT&paging=false`;

  const individualUrl =
    `https://hfml.gov.la/hfml/api/29/analytics/events/query/D5YBg956c4L.json` +
    `?dimension=pe:${year}&dimension=ou:${orgUnitId}` +
    `&dimension=xQrdgnlPcC3` +
    `&dimension=UUeAzev36rn` +
    `&stage=unHrhF91UiU&outputType=EVENT&paging=false`;

  // ---------- CONFIG ----------
  const equipmentConfig = [
    { key: "Laptop", label: "1. ແລັບທ໋ອບ", aggregateIndex: 23 },
    { key: "Tablet", label: "2. ແທັບເລັດ", aggregateIndex: 22 },
    { key: "Desktop", label: "3. ຄອມພິວເຕີ້ ຕັ້ງໂຕະ", aggregateIndex: 24 },
    {
      key: "Smart Phone",
      label: "4. ໂທລະສັບມືຖື (ອິນເຕີເນັດ)",
      aggregateIndex: 21,
    },
  ];

  // ---------- HELPERS ----------
  const mapAggregate = (rows) => {
    const result = {};
    equipmentConfig.forEach(eq => (result[eq.key] = 0));

    rows.forEach(row => {
      equipmentConfig.forEach(eq => {
        result[eq.key] += Number(row[eq.aggregateIndex] || 0);
      });
    });

    return result;
  };

  // ALL events (Form B)
  const countIndividualAll = (rows) => {
    const result = {};
    equipmentConfig.forEach(eq => (result[eq.key] = 0));

    rows.forEach(row => {
      const keyword = row[21]; // ✅ ICT type
      if (result.hasOwnProperty(keyword)) {
        result[keyword] += 1;
      }
    });

    return result;
  };

  // COMPLETED only + photo check
  const countIndividualCompleted = (rows) => {
    const completed = {};
    const photo = {};

    equipmentConfig.forEach(eq => {
      completed[eq.key] = 0;
      photo[eq.key] = true;
    });

    rows.forEach(row => {
      if (row[19] !== "COMPLETED") return;

      const keyword = row[21]; // ICT type
      const photoValue = row[22]; // photo

      if (completed.hasOwnProperty(keyword)) {
        completed[keyword] += 1;
        if (!photoValue) photo[keyword] = false;
      }
    });

    return { completed, photo };
  };

  // ---------- FETCH ----------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
     const [aggRes, indRes] = await Promise.all([
  // axios.get(aggregateUrl),
  // axios.get(individualUrl),
    axios.get(aggregateUrl, { auth: API_AUTH }),
  axios.get(individualUrl, { auth: API_AUTH }),
]);


        const aggregateRows = aggRes.data.rows || [];
        const individualRows = indRes.data.rows || [];

        setAggregateCounts(mapAggregate(aggregateRows));
        setIndividualAllCounts(countIndividualAll(individualRows));

        const { completed, photo } =
          countIndividualCompleted(individualRows);

        setIndividualCompletedCounts(completed);
        setPhotoStatus(photo);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgUnitId, year]);

  // ---------- SEND STATUS TO PARENT ----------
  useEffect(() => {
    const allPass = equipmentConfig.every(eq => {
      const agg = aggregateCounts[eq.key] || 0;
      const completed = individualCompletedCounts[eq.key] || 0;
      const photoOk = photoStatus[eq.key] !== false;

      return agg === completed && photoOk;
    });

    onStatusChange?.(allPass ? "pass" : "not pass");
  }, [aggregateCounts, individualCompletedCounts, photoStatus]);

  if (loading) return <p>Loading...</p>;

  // ---------- UI ----------
  return (
    <div className="container mt-3">
      <h6>Program: Facility Mapping B – ICT device</h6>

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>ປະເພດ</th>
            <th>ອຸປະກອນ ICT ທັງໝົດໃນຟອມ A</th>
            <th>ອຸປະກອນທີ່ໄດ້ປ້ອນຂໍ້ມູນປີ {year} ໃນຟອມ B</th>
            <th>ສໍາເລັດການລາຍງານປີ {year} ໃນຟອມ B</th>
            <th>ສະຖານະ</th>
            <th>ໝາຍເຫດ</th>
          </tr>
        </thead>
        <tbody>
          {equipmentConfig.map(eq => {
            const agg = aggregateCounts[eq.key] || 0;
            const all = individualAllCounts[eq.key] || 0;
            const completed = individualCompletedCounts[eq.key] || 0;
            const match = agg === completed && photoStatus[eq.key] !== false;

            return (
              <tr key={eq.key}>
                <td>{eq.label}</td>
                <td>{agg}</td>
                <td>{all}</td>
                <td>{completed}</td>
                <td>
                  {match ? <span className="badge bg-success">✅ ຜ່ານ</span> : <span className="badge bg-danger">❌ ບໍ່ຜ່ານ</span>}
                </td>
                <td style={{ color: "red" }}>
                  {agg > all && <div>ຍັງມີອຸປະກອນທີ່ບໍ່ໄດ້ປ້ອນຂໍ້ມູນປີ {year}</div>}
                  {all > completed && <div>ຍັງມີອຸປະກອນທີ່ການປ້ອນຂໍ້ມູນປີ {year} ຍັງບໍ່ສໍາເລັດ</div>}
                  {photoStatus[eq.key] === false && <div>ຍັງມີອຸປະກອນທີ່ບໍ່ໄດ້ອັບໂຫຼດຮູບພາບ</div>}
                  {agg < all && <div>ຈໍານວນອຸປະກອນທັງໝົດຂອງປີ {year} ໜ້ອຍກວ່າຈໍານວນທີ່ໄດ້ປ້ອນຂໍ້ມູນປີ {year}</div>}

                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ICTvalidate;

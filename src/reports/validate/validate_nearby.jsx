import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_AUTH } from "../../config";

const Valtdate_nearby_dry = ({ orgUnitId, year, onStatusChange }) => {
  const [eventRows, setEventRows] = useState([]);
  const [enrollmentRows, setEnrollmentRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [completedEventCount, setCompletedEventCount] = useState(0);
  const [loading, setLoading] = useState(true);
const [notCompletedEnrollments, setNotCompletedEnrollments] = useState([]);

  const Events = [{ key: "nearby", name: [21, 22, 23, 24] }];
  const Enrollment = [{ key: "nearby", name: [16, 17, 18, 19] }];

  const eventUrl = `https://hfml.gov.la/hfml/api/29/analytics/events/query/gr24luudE0t.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=rsXdExpMW65&dimension=Jy7ou2LCeju&dimension=WH4Az6TJ5ZA&dimension=f9d4P9maZEq&stage=MLBhJz9GKds&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;

  const enrollmentUrl = `https://hfml.gov.la/hfml/api/29/analytics/enrollments/query/gr24luudE0t.json?dimension=pe:THIS_YEAR;LAST_YEAR&dimension=ou:${orgUnitId}&dimension=rsXdExpMW65&dimension=Jy7ou2LCeju&dimension=WH4Az6TJ5ZA&dimension=f9d4P9maZEq&stage=MLBhJz9GKds&displayProperty=NAME&totalPages=false&outputType=ENROLLMENT&desc=enrollmentdate&paging=false`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [eventRes, enrollmentRes] = await Promise.all([
          // axios.get(eventUrl, { auth: API_AUTH }),
          // axios.get(enrollmentUrl, { auth: API_AUTH }),
     axios.get(eventUrl),
          axios.get(enrollmentUrl ),
        ]);

        const eventData = eventRes.data.rows || [];
        const enrollmentData = enrollmentRes.data.rows || [];

        // Map event rows
        const mappedEventRows = eventData.map(apiRow => {
          const obj = {};
          Events.forEach(eq => {
            obj[`${eq.key}_name`] =
              eq.name.map(i => apiRow[i]).find(v => v && v !== "") || "";
          });
          return obj;
        });

        // Map enrollment rows
        const mappedEnrollmentRows = enrollmentData.map(apiRow => {
          const obj = {};
          Enrollment.forEach(eq => {
            obj[`${eq.key}_name`] =
              eq.name.map(i => apiRow[i]).find(v => v && v !== "") || "";
          });
          return obj;
        });

        const eventNames = mappedEventRows
          .map(r => r["nearby_name"])
          .filter(v => v && v !== "");

        const enrollmentNames = mappedEnrollmentRows
          .map(r => r["nearby_name"])
          .filter(v => v && v !== "");

        // Find mismatches
        const eventsNotInEnrollments = eventNames.filter(name => !enrollmentNames.includes(name));
        const enrollmentsNotInEvents = enrollmentNames.filter(name => !eventNames.includes(name));

        const combinedRows = [
          ...eventsNotInEnrollments.map(name => ({ eventName: name, enrollmentName: "— (not found)" })),
          ...enrollmentsNotInEvents.map(name => ({ eventName: "— (not found)", enrollmentName: name }))
        ];

        const completedCount = eventData.filter(row => row[19] === "COMPLETED").length;


        const totalEnrollments = enrollmentData.length;
const notCompleted = eventData
  .filter(row => row[19] !== "COMPLETED")
  .map(row =>
    Events[0].name
      .map(index => row[index])
      .filter(v => v && v !== "")
      .join(" - ")
  )
  .filter(v => v !== "");

setNotCompletedEnrollments(notCompleted);








        // Update state
        setCompletedEventCount(completedCount);
        setEventRows(mappedEventRows);
        setEnrollmentRows(mappedEnrollmentRows);
        setRows(combinedRows);

        // Send pass/fail status to parent
        if (onStatusChange) {
          const status = completedCount === totalEnrollments ? "pass" : "not pass";
          onStatusChange(status);
          console.log("Nearby status:", status);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgUnitId, year, onStatusChange]);

  if (loading) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border text-primary" role="status"></div>
        <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
          ກຳລັງໂຫຼດຂໍ້ມູນ...
        </p>
      </div>
    );
  }

  return (
    <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h6 className="mb-3">Program: Facility Mapping C – Nearby Facilities Accessibility</h6>
      <table className="table table-bordered w-100">
        <thead className="table-light">
          <tr>
            <th>ຈໍານວນທີ່ໄດ້ປ້ອນຂໍ້ມູນປີ {year}</th>
            <th>ຈໍານວນທີ່ຍັງບໍ່ໄດ້ປ້ອນຂໍ້ມູນປີ {year}</th>
            <th>ສໍາເລັດການລາຍງານປີ {year}</th>
            <th>ສະຖານະ</th>
            <th>ໝາຍເຫດ</th>

          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{eventRows.length}</td>
            <td>{Number(enrollmentRows.length - eventRows.length)}</td>
            <td>{completedEventCount}</td>
            <td>
              {completedEventCount === enrollmentRows.length
                ? <span className="badge bg-success">✅ ຜ່ານ</span>
                : <span className="badge bg-danger">❌ ບໍ່ຜ່ານ</span>}
            </td>
            <td style={{ color: "red", width: "300px" }}>
  {/* Not entered data */}
  {completedEventCount !== enrollmentRows.length &&
    enrollmentRows.length > eventRows.length && (
      <div>
        <strong>
          ສະຖານທີ່ລຸ່ມນີ້ຍັງບໍ່ໄດ້ປ້ອນຂໍ້ມູນປີ {year}:
        </strong>
        <div>
          {rows
            .map(row => row.enrollmentName)
            .filter(name => name && name !== "— (not found)")
            .join(" ; ")}
        </div>
      </div>
    )}

  {/* Not completed */}
 {notCompletedEnrollments.length > 0 && (
  <div className="mt-2">
    <strong>
      ສະຖານທີ່ລຸ່ມນີ້ຍັງບໍ່ໄດ້ກົດປຸ່ມສຳເລັດ: 
    </strong>
    <div>{notCompletedEnrollments.join(" ; ")}</div>
  </div>
)}

</td>


          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Valtdate_nearby_dry;

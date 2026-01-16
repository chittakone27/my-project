import React, { useEffect, useState } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { API_AUTH } from "../../config";
import bed from '../image/bed.png';
import icu from '../image/icu.png';
import fresher from '../image/fresher.png';
import icuchilde from '../image/icuchilde.png';

const Bed = ({ orgUnitId, year, onRowCount, Eventstatus }) => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);

    const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=WUCVzpyRBHR.msFzvgwQQzm&dimension=WUCVzpyRBHR.OpKuX0h3iSf&dimension=WUCVzpyRBHR.bEWpwn7HfUI&dimension=WUCVzpyRBHR.Gt26xzdkt53&stage=WUCVzpyRBHR&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;

    const equipmentConfig = [
        { key: "bed", bedvalue: 23 },
        { key: "icu", icuvalue: 24 },
        { key: "icuchilde", icuchilde: 22 },
        { key: "freezer", freezer: 21 },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const res = await axios.get(url, { auth: API_AUTH });
                // const res = await axios.get(url);

                const eventRows = res.data.rows || [];

                if (onRowCount) {
                    onRowCount(eventRows.length); // ✅ SEND ROW COUNT TO PARENT
                }

                // ✅ VALIDATION: Check row count
                setRowCount(eventRows.length);

                // Map rows with proper equipment values
                const mappedRows = eventRows.map(apiRow => {
                    return equipmentConfig.reduce((acc, eq) => {
                        acc[`${eq.key}_bed`] = apiRow[eq.bedvalue] || ""; // map bed values
                        acc[`${eq.key}_icu`] = apiRow[eq.icuvalue] || ""; // map ICU values
                        acc[`${eq.key}_icuchilde`] = apiRow[eq.icuchilde] || ""; // map icuchilde values
                        acc[`${eq.key}_freezer`] = apiRow[eq.freezer] || ""; // map icuchilde values

                        return acc;
                    }, {});
                });
                setRows(mappedRows);

                if (!eventRows.length && Eventstatus) {
                    Eventstatus("");
                }
                if (eventRows.length > 0 && Eventstatus) {
                    const eventStatus = eventRows[0][19]; // Get directly from original rows
                    Eventstatus(eventStatus);
                    console.log("Event Status Sent medicine:", eventStatus);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [orgUnitId, year]);

    if (loading) {
        return (
            <div className="text-center my-3">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
                    ກຳລັງໂຫຼດຂໍ້ມູນ ຕຽງ ແລະ ຕູ້ເຢັນ

                </p>
            </div>
        );
    }

    if (!rows.length)
        return (
            <div
                className="container mt-3"
                style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}
            >
                <h4 className="mb-3">
                    ຕຽງ ແລະ ຕູ້ເຢັນ
                </h4>
                <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
            </div>
        );

    return (
         <div className="table-responsive"
          style={{ 
        backgroundColor: "#fff",
        fontFamily: "'Noto Sans Lao', sans-serif",
       }}>
<table className="table">
                        <thead className="table-light">
                        <tr>
                            <th style={{ width: "200px", padding: "10px", verticalAlign: "top", textAlign: "center" }}>
                                <div style={{ fontSize: "26px", marginBottom: "5px" }}>
                                    ຈໍານວນຕຽງທັງໝົດ (ລວມທັງຕຽງ ICU)
                                </div>
                                <div>
                                    <img src={bed} alt="ICU Bed" style={{ width: "100px", height: "100px" }} />
                                </div>
                            </th>
                            <th style={{ width: "200px", padding: "10px", verticalAlign: "top", textAlign: "center" }}>
                                <div style={{ fontSize: "26px", marginBottom: "5px" }}>
                                    ຈໍານວນຕຽງ ICU ສໍາລັບຜູ່ໃຫຍ່
                                </div>
                                <div>
                                    <img src={icu} alt="ICU Bed for Adults" style={{width: "100px", height: "100px"  }} />
                                </div>
                            </th>
                            <th style={{ width: "200px", padding: "10px", verticalAlign: "top", textAlign: "center" }}>
                                <div style={{ fontSize: "26px", marginBottom: "5px" }}>
                                    ຈໍານວນຕຽງ ICU ສໍາລັບເດັກເກີດໃໝ່
                                </div>
                                <div>
                                    <img src={icuchilde} alt="ICU Bed for Children" style={{ width: "100px", height: "100px"  }} />
                                </div>
                            </th>
                            <th style={{ width: "200px", padding: "10px", verticalAlign: "top", textAlign: "center" }}>
                                <div style={{ fontSize: "26px", marginBottom: "5px" }}>
                                    ຈໍານວນຕູ້ເຢັນທົ່ວໄປ (ບໍ່ແມ່ນຕູ້ເຢັນສະເພາະວັນຊີນ)                </div>
                                <div>
                                    <img src={fresher} alt="Freezer" style={{ width: "100px", height: "100px"  }} />
                                </div>
                            </th>
                        </tr>
                    </thead>                    <tbody >
                        {rows.map((row, idx) => (
                            <tr key={idx} style={{height:"120px", fontSize:"24px",textAlign:"center",verticalAlign:"none"}}>
                                <td>{row.bed_bed || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
                                <td>{row.icu_icu || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
                                <td>{row.icuchilde_icuchilde || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
                                <td>{row.freezer_freezer || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
};

export default Bed;

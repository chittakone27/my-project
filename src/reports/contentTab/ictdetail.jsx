import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { API_AUTH } from "../../config";
import '../validate/print.css'

const Ictdetail = ({ orgUnitId, year }) => {
    const [rows, setRows] = useState([]);
    const [images, setImages] = useState({});


    const [loading, setLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [options, setOptions] = useState({});

    const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/D5YBg956c4L.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=RyN09GsWd64&dimension=UUeAzev36rn&dimension=unHrhF91UiU.OP77Sctj4TR&dimension=unHrhF91UiU.audIElWyoJP&dimension=y6RfdAq2zmQ&dimension=dmYXjqVa9Hz&dimension=leCxCv4ZFaX&dimension=rIHJFrYHA27&dimension=VDtUCd4xomY&dimension=RivKjPO5BKw&dimension=unHrhF91UiU.lr5I9l05b6F&dimension=unHrhF91UiU.EHemNEq0Zaj&dimension=unHrhF91UiU.S0s3VgwY30C&dimension=unHrhF91UiU.nhQCkj3UWJK&dimension=unHrhF91UiU.ayj5xsLBA0T&dimension=unHrhF91UiU.jr3EVDUQRhX&dimension=tDri5optbSF&dimension=unHrhF91UiU.ZXzj7W5848O&dimension=unHrhF91UiU.Oxhur2LfVCr&dimension=unHrhF91UiU.VVjz58l6VSg&stage=unHrhF91UiU&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;
    const equipmentConfig = [
        { key: "device", label: "ອຸປະກອນ", imgIdWT: "UUeAzev36rn", type: 23, tei: 10, id: 31, status: 32, lost: 36, brand: 24, ram: 38, cpu: 26, supportby: 25, antsupportby: 39, projectcode: 37, title: 35, name: 29, last: 33, position: 34, antposition: 28, department: 21, antdepartment: 30, phone: 40, startuse: 27 },



    ];
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                // const res = await axios.get(url, { auth: API_AUTH });
                const res = await axios.get(url);

                const eventRows = res.data.rows || [];

                setRowCount(eventRows.length);

                const mappedRows = eventRows.map(apiRow => {
                    return equipmentConfig.reduce((acc, eq) => {
                        acc[`${eq.key}_id`] = apiRow[eq.id] || "";
                        acc[`${eq.key}_tei`] = apiRow[eq.tei] || "";
                        acc[`${eq.key}_status`] = apiRow[eq.status] || "";
                        acc[`${eq.key}_lost`] = apiRow[eq.lost] || "";
                        acc[`${eq.key}_type`] = apiRow[eq.type] || "";
                        acc[`${eq.key}_brand`] = apiRow[eq.brand] || "";
                        acc[`${eq.key}_ram`] = apiRow[eq.ram] || "";
                        acc[`${eq.key}_cpu`] = apiRow[eq.cpu] || "";
                        acc[`${eq.key}_supportby`] = apiRow[eq.supportby] || "";
                        acc[`${eq.key}_antsupportby`] = apiRow[eq.antsupportby] || "";

                        acc[`${eq.key}_projectcode`] = apiRow[eq.projectcode] || "";
                        acc[`${eq.key}_title`] = apiRow[eq.title] || "";
                        acc[`${eq.key}_name`] = apiRow[eq.name] || "";
                        acc[`${eq.key}_last`] = apiRow[eq.last] || "";
                        acc[`${eq.key}_position`] = apiRow[eq.position] || "";
                        acc[`${eq.key}_antposition`] = apiRow[eq.antposition] || "";
                        acc[`${eq.key}_department`] = apiRow[eq.department] || "";
                        acc[`${eq.key}_antdepartment`] = apiRow[eq.antdepartment] || "";
                        acc[`${eq.key}_phone`] = apiRow[eq.phone] || "";
                        acc[`${eq.key}_startuse`] = apiRow[eq.startuse] || "";
                        acc[`${eq.key}_imageWT`] = apiRow[eq.imgIdWT] || "";
                        return acc;
                    }, {});
                });

                setRows(mappedRows);

                setOptions(res.data.metaData.items || {});

                // Fetch images for all rows
                const fetchImage = async (teiUid, dataElementUid) => {
                    try {
                        const res = await axios.get(
                            `https://hfml.gov.la/hfml/api/trackedEntityInstances/${teiUid}/${dataElementUid}/image`,
                            // { auth: API_AUTH, responseType: "blob" }
                            {responseType: "blob" }

                        );
                        return URL.createObjectURL(res.data);
                    } catch (err) {
                        console.error("Error fetching image:", err);
                        return null;
                    }
                };

                // Fetch images for all rows
                const imagesObj = {};
                await Promise.all(
                    mappedRows.map(async (row) => {
                        const teiUid = row.device_tei;
                        if (teiUid) {
                            const img = await fetchImage(teiUid, equipmentConfig[0].imgIdWT);
                            imagesObj[teiUid] = img; // key by TEI UID
                        }
                    })
                );

                setImages(imagesObj);


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

    if (loading) {
        return (
            <div className="text-center my-3">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p style={{ fontFamily: "'Noto Sans Lao', sans-serif", height: "1600px" }}>
                    ກຳລັງໂຫຼດຂໍ້ມູນ ອຸປະກອນ ICT...
                </p>
            </div>
        );
    }

    if (!rows.length) {
        return (
            <div className="container mt-3" style={{
                backgroundColor: "#fff",
                fontFamily: "'Noto Sans Lao', sans-serif",
            }}>

                <h4 className="mb-3">ອຸປະກອນ ICT </h4>
                <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
            </div>
        );
    }

    const types = [
        { code: "L", label: "ແລັບທອບ" },
        { code: "D", label: "ຄອມຕັ້ງໂຕະ" },
        { code: "T", label: "ແທັບເລັດ" },
        { code: "P", label: "ໂທລະສັບມືຖື (ສາມາດເຂົ້າອິນເຕີເນັດໄດ້)" },
    ];

    return (
        <div className="container mt-3 table-responsive" style={{ backgroundColor: "#fff", fontFamily: "'Noto Sans Lao', sans-serif" }}>
            <h4 className="mb-3">ອຸປະກອນ ICT</h4>

            {types.map((type) => {
                const filteredRows = rows.filter(r => r.device_type === type.code);
                if (!filteredRows.length) return null;

                return (
                    <div key={type.code} className="table-responsive mb-4">
                        <h5 className="mb-3" >
                            {type.label} {filteredRows.length} ເຄື່ອງ
                        </h5>
                        <table className="table" style={{ textAlign: "center", verticalAlign: "middle" }}>
                            <thead className="table-light">
                                <tr>
                                    <th>ລ/ດ</th>
                                    <th>ລະຫັດ</th>
                                    <th>ຂໍ້ມູນອຸປະກອນ</th>
                                    <th>ຜູ້ຮັບຜິດຊອບອຸປະກອນ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((r, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>
                                            <div>{r.device_id || ""}</div>
                                            {r.device_tei && images[r.device_tei] ? (
                                                <img
                                                    src={images[r.device_tei]}
                                                    alt={type.label}
                                                    style={{ width: 180, marginTop: 20 }}
                                                />
                                            ) : (
                                                <span style={{ color: "red" }}>ບໍ່ມີຮູບ</span>
                                            )}

                                            <div style={{
                                                width: 180,
                                                margin: "20px auto 0",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                color: r.device_status === "Can report data" ? "green" : "red",
                                            }}>
                                                {getDisplayName(r.device_status || "ບໍ່ມີຂໍ້ມູນສະພາບອຸປະກອນ")}
                                            </div>
                                            {r.device_lost === "1" && <div style={{ color: "red", fontWeight: "bold" }}>(ສູນຫາຍ)</div>}
                                        </td>
                                        <td>
                                            <p>ປະເພດ: <span style={{ fontWeight: "bold" }}>{type.label}</span></p>
                                            <p>ຍີ່ຫໍ້: <span style={{ fontWeight: "bold", color: r.device_brand ? "black" : "red" }}>{getDisplayName(r.device_brand) || "ບໍ່ມີຂໍ້ມູນ"}</span></p>
                                            <p>ແຣມ (RAM): <span style={{ fontWeight: "bold", color: r.device_ram ? "black" : "red" }}>{r.device_ram || "ບໍ່ມີຂໍ້ມູນ"}</span></p>
                                            <p>CPU: <span style={{ fontWeight: "bold", color: r.device_cpu ? "black" : "red" }}>{r.device_cpu || "ບໍ່ມີຂໍ້ມູນ"}</span></p>
                                            <p>
                                                ຜູ້ສະໜັບສະໜູນ:{" "}
                                                <span style={{ fontWeight: "bold" }}>
                                                    {r.device_supportby ? (
                                                        r.device_supportby === "Other" ? (
                                                            r.device_antsupportby ? (
                                                                r.device_antsupportby
                                                            ) : (
                                                                <span style={{ color: "red" }}>
                                                                    ອື່ນໆ ແຕ່ບໍ່ລະບຸຜູ້ສະໜັບສະໜູນລະອຽດ
                                                                </span>
                                                            )
                                                        ) : (
                                                            getDisplayName(r.device_supportby)
                                                        )
                                                    ) : (
                                                        <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>
                                                    )}
                                                </span>
                                            </p>
                                            <p>ລະຫັດໂຄງການ: <span style={{ fontWeight: "bold", color: r.device_projectcode ? "black" : "red" }}>{r.device_projectcode || "ບໍ່ມີຂໍ້ມູນ"}</span></p>
                                        </td>
                                        <td>
                                            <p>ຄໍານໍາໜ້າ: <span style={{ fontWeight: "bold", color: r.device_title ? "black" : "red" }}>{r.device_title ? getDisplayName(r.device_title) : "ບໍ່ມີຂໍ້ມູນ"}</span></p>
                                            <p>ຊື່ ແລະ ນາມສະກຸນ: <span style={{ fontWeight: "bold", color: r.device_name ? "black" : "red" }}>{r.device_name ? `${getDisplayName(r.device_name)} ${getDisplayName(r.device_last)}` : "ບໍ່ມີຂໍ້ມູນ"}</span></p>
                                            <p>
                                                ຕໍາແໜ່ງ:{" "}
                                                <span style={{ fontWeight: "bold" }}>
                                                    {r.device_position ? (
                                                        r.device_position === "Other" ? (
                                                            r.device_antposition ? (
                                                                r.device_antposition
                                                            ) : (
                                                                <span style={{ color: "red" }}>
                                                                    ອື່ນໆ ແຕ່ບໍ່ລະບຸຕຳແໜ່ງລະອຽດ
                                                                </span>
                                                            )
                                                        ) : (
                                                            getDisplayName(r.device_position)
                                                        )
                                                    ) : (
                                                        <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>
                                                    )}
                                                </span>
                                            </p>
                                            <p>
                                                ຂະແໜງ:{" "}
                                                <span style={{ fontWeight: "bold" }}>
                                                    {r.device_department ? (
                                                        r.device_department === "Other" ? (
                                                            r.device_antdepartment ? (
                                                                r.device_antdepartment
                                                            ) : (
                                                                <span style={{ color: "red" }}>
                                                                    ອື່ນໆ ແຕ່ບໍ່ລະບຸຂະແໜງລະອຽດ
                                                                </span>
                                                            )
                                                        ) : (
                                                            getDisplayName(r.device_department)
                                                        )
                                                    ) : (
                                                        <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>
                                                    )}
                                                </span>
                                            </p>

                                            <p>ເບີໂທ: <span style={{ fontWeight: "bold", color: r.device_phone ? "black" : "red" }}>{r.device_phone || "ບໍ່ມີຂໍ້ມູນ"}</span></p>
                                            <p>ວັນທີເລີ່ມໃຊ້ງານ: <span style={{ fontWeight: "bold", color: r.device_startuse ? "black" : "red" }}>{r.device_startuse ? r.device_startuse.split(" ")[0] : "ບໍ່ມີຂໍ້ມູນ"}</span></p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );

};

export default Ictdetail;

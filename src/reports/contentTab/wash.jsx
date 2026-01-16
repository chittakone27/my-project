import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Weater from "./weater";
import { API_AUTH } from "../../config";
import '../validate/print.css'

const Wash = ({ orgUnitId, year, onRowCount, Eventstatus, Eventdate }) => {
    const [rows, setRows] = useState([]);
    const [images, setImages] = useState({});


    const [loading, setLoading] = useState(true);
    const [rowCount, setRowCount] = useState(0);
    const [options, setOptions] = useState({});

    const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=BVTaSDRqTdN.sevW1KA9uZv&dimension=BVTaSDRqTdN.uVEvR09vS76&dimension=BVTaSDRqTdN.vnJhT1wzjJa&dimension=BVTaSDRqTdN.s4qlT2C7rot&dimension=BVTaSDRqTdN.HCoWzSNgm0w&dimension=BVTaSDRqTdN.omwad4O2kAf&dimension=BVTaSDRqTdN.CViemlWnENJ&dimension=BVTaSDRqTdN.W5UrZzdDLvz&dimension=BVTaSDRqTdN.BubhlmM6elu&dimension=BVTaSDRqTdN.QqZWVZxO79R&dimension=BVTaSDRqTdN.T3NcgZ1sx4s&dimension=BVTaSDRqTdN.OARutDpL2dM&dimension=BVTaSDRqTdN.KpDpzOLL5YI&dimension=BVTaSDRqTdN.vFsAfA51m5t&dimension=BVTaSDRqTdN.kuR0BKEMK8O&dimension=BVTaSDRqTdN.sb8FHULfVoC&dimension=BVTaSDRqTdN.xnccpdd2vKn&dimension=BVTaSDRqTdN.CNVSIJkquLR&dimension=BVTaSDRqTdN.VmCvSADpsA1&dimension=BVTaSDRqTdN.Eoj2LevRSsa&dimension=BVTaSDRqTdN.bmlUYsjXYko&dimension=BVTaSDRqTdN.x59W91PRh3t&stage=BVTaSDRqTdN&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;
    const equipmentConfig = [
        { key: "mainwater", label: "ແຫຼ່ງນໍ້າຫຼັກ", imgIdWT: "sevW1KA9uZv", Wt: 25 },
        { key: "wtlocation", label: "ຈຸດເອົານໍ້າ ແມ່ນຢູ່ພາຍໃນສະຖານທີ່", wtlocation: 35 },
        { key: "isfar", label: "ຈຸດເອົານໍ້າ ຫ່າງຈາກສະຖານທີ່ບໍ່ເກີນ 500 ແມັດ ຫຼື ເດີນທາງໄປ-ກັບບໍ່ເກີນ 30 ນາທີ", isfar: 26 },
        { key: "havewteveryday", label: "ສາມາດສະໜອງນໍ້າໄດ້ 24 ຊົ່ວໂມງ / 7 ວັນ", havewteveryday: 30 },
        { key: "Typetoilet", label: "ວິດຖ່າຍ", imgIdToi: "x59W91PRh3t", type: 41 },
        { key: "toilet", label: "ຈໍານວນຫ້ອງນໍ້າທີ່ໃຊ້ໄດ້", imgId: "ryt0IOxj0IT", toilet: 21 },
        { key: "damtoilet", label: "ຈໍານວນຫ້ອງນໍ້າທີ່ໃຊ້ບໍ່ໄດ້", imgId: "RBtRSzaPLN3", damtoilet: 42 },
        { key: "sepratetoilet", label: "ໄດ້ແຍກ ຫ້ອງນໍ້າຄົນເຈັບ ແລະ ຫ້ອງນໍ້າພະນັກງານ", value: 27 },
        { key: "gender", label: "ຫ້ອງນໍ້າຄົນເຈັບໄດ້ແຍກ ຫ້ອງຍິງ ຫ້ອງຊາຍ", imgId: "YpynxWhRad7", gdvalue: 32 },
        { key: "wash", label: "ຫ້ອງນໍ້າທີ່ຄົນເຈັບຜູ້ຍິງເຂົ້າ ມີຖັງຂີ້ເຫຍື້ອມີຝາປົກ, ຫຼື ນໍ້າສະອາດ ແລະ ສະບູ ສໍາລັບມ້ຽນຄາບປະຈໍາເດືອນ", wash: 38 }, // No damage
        { key: "special", label: "ມີຫ້ອງນໍ້າຢ່າງໜ້ອຍ 1 ຫ້ອງທີ່ຜູ້ພິການ ຫຼື ຜູ້ມີຂໍ້ຈໍາກັດໃນການເຄື່ອນໄຫວຮ່າງກາຍ ສາມາດເຂົ້າໄດ້", special: 28 }, // No damage
        { key: "Opd", label: "ຫ້ອງກວດເຂດນອກ ມີ ສະບູ ແລະ ນ້ຳລ້າງມື (ຫຼື ເຈວລ້າງມືທີ່ມີທາດເຫຼົ້າ) ບໍ່ ?", imgIdOPD: "Kcb5YG66lpa", opd: 34 }, // No damage
        { key: "soapfar", label: "ຫ້ອງນໍ້າ ມີສະບູ, ນໍ້າ ແລະ ອ່າງລ້າງມື ຢູ່ໃກ້ໆ ບໍ່ເກີນ 5 ແມັດ ?", soapfar: 40 }, // No damage
        { key: "s3", label: "ຂີ້ເຫຍື້ອ - ໄດ້ແຍກ ຂີ້ເຫຍື້ອແຫຼມຄົມ, ຂີ້ເຫຍື້ອຕິດເຊື້ອ ແລະ ຂີ້ເຫຍື້ອທົ່ວໄປ ເປັນ 3 ຖັງຢ່າງປອດໄພ:" ,sep:24}, // No damage
        { key: "disposal", label: "ຂີ້ເຫຍື້ອປະເພດແຫຼມຄົມ:", imgIddis: "sb8FHULfVoC",disposal:31 }, // No damage
        { key: "infectious", label: "ຂີ້ເຫຍື້ອຕິດເຊື້ອ:", imgIdinf: "xnccpdd2vKn",infectious:36 }, // No damage
        { key: "otherdis", label: "ລະບຸຂີ້ເຫຍື້ອປະເພດແຫຼມຄົມອື່ນ:", imgIddis: "sb8FHULfVoC",otherdis:37 }, // No damage
        { key: "otherinf", label: "ລະບຸຂີ້ເຫຍື້ອຕິດເຊື້ອອື່ນ:", imgIdinf: "xnccpdd2vKn",otherinf:39 }, // No damage

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
       if (!eventRows.length && Eventstatus) {
          Eventstatus("");
                    Eventdate("")

        }
                setRowCount(eventRows.length);
                if (eventRows.length > 0 && Eventstatus && Eventdate) {
                    const eventStatus = eventRows[0][19]; // Get directly from original rows
                    const eventdate = eventRows[0][2]; // Get directly from original rows
                    Eventdate(eventdate)
                    Eventstatus(eventStatus);
                }

                const mappedRows = eventRows.map(apiRow => {
                    return equipmentConfig.reduce((acc, eq) => {
                        acc[`${eq.key}imageWT`] = apiRow[eq.imgIdWT] || "";  // Image URL
                        acc[`${eq.key}_Wt`] = apiRow[eq.Wt] || "";          // Weight (Wt) value
                        acc[`${eq.key}_isfar`] = apiRow[eq.isfar] || "";          // Weight (Wt) value
                        acc[`${eq.key}_wtlocation`] = apiRow[eq.wtlocation] || "";          // Weight (Wt) value
                        acc[`${eq.key}_havewteveryday`] = apiRow[eq.havewteveryday] || "";          // Weight (Wt) value
                        acc[`${eq.key}_type`] = apiRow[eq.type] || "";          // Weight (Wt) value
                        acc[`${eq.key}_toilet`] = apiRow[eq.toilet] || "";          // Weight (Wt) value
                        acc[`${eq.key}_damtoilet`] = apiRow[eq.damtoilet] || "";          // Weight (Wt) value
                        acc[`${eq.key}_value`] = apiRow[eq.value] || "";          // Weight (Wt) value
                        acc[`${eq.key}_gdvalue`] = apiRow[eq.gdvalue] || "";          // Weight (Wt) value
                        acc[`${eq.key}_wash`] = apiRow[eq.wash] || "";          // Weight (Wt) value
                        acc[`${eq.key}_special`] = apiRow[eq.special] || "";          // Weight (Wt) value
                        acc[`${eq.key}_opd`] = apiRow[eq.opd] || "";          // Weight (Wt) value
                        acc[`${eq.key}_soapfar`] = apiRow[eq.soapfar] || "";          // Weight (Wt) value
                        acc[`${eq.key}_sep`] = apiRow[eq.sep] || "";          // Weight (Wt) value
                        acc[`${eq.key}_disposal`] = apiRow[eq.disposal] || "";          // Weight (Wt) value
                        acc[`${eq.key}_infectious`] = apiRow[eq.infectious] || "";          // Weight (Wt) value
                        acc[`${eq.key}_otherdis`] = apiRow[eq.otherdis] || "";          // Weight (Wt) value
                        acc[`${eq.key}_otherinf`] = apiRow[eq.otherinf] || "";          // Weight (Wt) value


                        return acc;
                    }, {});
                });


                setRows(mappedRows);;

                // Set options (assuming they are part of the metadata response)
                setOptions(res.data.metaData.items || {});
                if (eventRows.length > 0) {
                    const eventUid = eventRows[0][0];
                    // Assuming you have different keys or imgIdWT for each item you want to display
                    const fetchImage = async (dataElementUid) => {
                        try {
                            const res = await axios.get(
                                `https://hfml.gov.la/hfml/api/events/files?eventUid=${eventUid}&dataElementUid=${dataElementUid}`,
                                // { responseType: 'blob' }
                                                                { auth: API_AUTH, responseType: 'blob' }

                            );
                            console.log('Image fetched successfully:', res.status);
                            return URL.createObjectURL(res.data);
                        } catch (error) {
                            console.error('Error fetching image:', error.response ? error.response.data : error.message);
                            return null;
                        }
                    };

                    const imagesObj = {};

                    // Fetch only the images you need by their unique imgIdWT
                    await Promise.all(equipmentConfig.map(async eq => {
                        if (eq.imgIdWT) {
                            imagesObj[eq.key] = await fetchImage(eq.imgIdWT); // Use imgIdWT or unique key here
                        }
                        if (eq.imgIdToi) {
                            imagesObj[eq.key] = await fetchImage(eq.imgIdToi); // Use imgIdWT or unique key here
                        }
                        if (eq.imgIdOPD) {
                            imagesObj[eq.key] = await fetchImage(eq.imgIdOPD); // Use imgIdWT or unique key here
                        }
                        if (eq.imgIddis) {
                            imagesObj[eq.key] = await fetchImage(eq.imgIddis); // Use imgIdWT or unique key here
                        }
                        if (eq.imgIdinf) {
                            imagesObj[eq.key] = await fetchImage(eq.imgIdinf); // Use imgIdWT or unique key here
                        }
                    }));

                    setImages(imagesObj);

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

    if (loading) {
        return (
            <div className="text-center my-3">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" ,height: "1600px"}}>
                    ກຳລັງໂຫຼດຂໍ້ມູນ 2. ນໍ້າສະອາດ, ສຸຂາພິບານ ແລະ ອະນາໄມ (WASH)...
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

                <h4 className="mb-3">2. ນໍ້າສະອາດ, ສຸຂາພິບານ ແລະ ອະນາໄມ (WASH)</h4>
                <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
            </div>
        );
    }

    return (
        <div>
        <div className="container mt-3 table-responsive" style={{ 
        backgroundColor: "#fff",
        fontFamily: "'Noto Sans Lao', sans-serif",
       }}>

            <h4 className="mb-3">2. ນໍ້າສະອາດ, ສຸຂາພິບານ ແລະ ອະນາໄມ (WASH)</h4>
 <div className="table-responsive">
    <table className="table">
                            <thead className="table-light">
                        <tr>
                            {/* Electricity */}
                            <th colSpan="3" style={{ width: "200px", minWidth: "180px", padding: "10px", verticalAlign: "top" }}>
                                <div style={{ marginBottom: "5px" }}>
                                    ແຫຼ່ງນໍ້າຫຼັກ: {getDisplayName(rows[0].mainwater_Wt || "")}
                                </div>                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowSpan="3">
                                <div
                                    style={{
                                        height: "6px",
                                        width: "150px",
                                        background:
                                            rows[0].mainwater_Wt === "Protected dug well" || rows[0].mainwater_Wt === "Nam Papa system"
                                                ? "green"
                                                : rows[0].mainwater_Wt === "Unprotected dug well" || rows[0].mainwater_Wt === "Rainwater" || rows[0].mainwater_Wt === "River/Lake/Canal" || rows[0].mainwater_Wt === "Tanker truck" ? "orange"
                                                    : rows[0].mainwater_Wt === "No water source"
                                                        ? "red"
                                                        : "#ccc",
                                    }}
                                ></div>
                                {images["mainwater"] ? (  // Only display for "mainwater"
                                    <img

                                        src={images["mainwater"]}  // Reference the image URL for "mainwater"
                                        alt="ແຫຼ່ງນໍ້າຫຼັກ"
                                        style={{ width: 180, marginTop: 20 }}
                                    />
                                ) : (
                                    <span style={{ color: "red" }}>ບໍ່ມີຮູບ</span>
                                )}
                            </td>
                            <td>ຈຸດເອົານໍ້າ ຫ່າງຈາກສະຖານທີ່ບໍ່ເກີນ 500 ແມັດ ຫຼື ເດີນທາງໄປ-ກັບບໍ່ເກີນ 30 ນາທີ</td>
                            <td
                                style={{
                                    color: Number(rows[0].isfar_isfar) === 1 ? 'green' : 'red',  // Green for "ແມ່ນ", Red for "ບໍ່ແມ່ນ"
                                }}
                            >
                                {Number(rows[0].isfar_isfar) === 1 ? "ແມ່ນ" : "ບໍ່ແມ່ນ"}
                            </td>


                        </tr>
                        <tr>
                            <td>ຈຸດເອົານໍ້າ ແມ່ນຢູ່ພາຍໃນສະຖານທີ່</td>
                            <td
                                style={{
                                    color: Number(rows[0].wtlocation_wtlocation) === 1 ? 'green' : 'red',  // Green for "ແມ່ນ", Red for "ບໍ່ແມ່ນ"
                                }}
                            >
                                {Number(rows[0].wtlocation_wtlocation) === 1 ? "ແມ່ນ" : "ບໍ່ແມ່ນ"}
                            </td>
                        </tr>
                        <tr>
                            <td>ສາມາດສະໜອງນໍ້າໄດ້ 24 ຊົ່ວໂມງ / 7 ວັນ</td>
                            <td
                                style={{
                                    color: Number(rows[0].havewteveryday_havewteveryday) === 1 ? 'green' : 'red',  // Green for "ແມ່ນ", Red for "ບໍ່ແມ່ນ"
                                }}
                            >
                                {Number(rows[0].havewteveryday_havewteveryday) === 1 ? "ແມ່ນ" : "ບໍ່ແມ່ນ"}
                            </td>                        </tr>
                    </tbody>
                </table>

    <table className="table">
        <thead className="table-light">
                        <tr>
                            {/* Electricity */}
                            <th colSpan="3" style={{ width: "200px", minWidth: "180px", padding: "10px", verticalAlign: "top" }}>
                                <div style={{ marginBottom: "5px" }}>ວິດຖ່າຍ: {getDisplayName(rows[0].Typetoilet_type || "")}</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowSpan="6">
                                <div
                                    style={{
                                        height: "6px",
                                        width: "150px",
                                        background:
                                            rows[0].Typetoilet_type === "Flush" || rows[0].Typetoilet_type === "Dry toilet/Pit latrine with slab/covered" || rows[0].Typetoilet_type === "Composting toilet"
                                                ? "green"
                                                : rows[0].Typetoilet_type === "Dry toilet/Pit latrine without slab/open"
                                                    ? "orange"
                                                    : rows[0].Typetoilet_typec === "None"
                                                        ? "red"
                                                        : "#ccc",
                                    }}
                                ></div>
                                {images["Typetoilet"] ? (  // Only display for "mainwater"
                                    <img

                                        src={images["Typetoilet"]}  // Reference the image URL for "mainwater"
                                        alt="ປະເພດວິດຖ່າຍ"
                                        style={{ width: 180, marginTop: 20 }}
                                    />
                                ) : (
                                    <span style={{ color: "red" }}>ບໍ່ມີຮູບ</span>
                                )}
                            </td>
                            <td>ຈໍານວນຫ້ອງນໍ້າທີ່ໃຊ້ໄດ້</td>
                            <td>{rows[0].toilet_toilet}</td>

                        </tr>
                        <tr>
                            <td>ຈໍານວນຫ້ອງນໍ້າທີ່ໃຊ້ບໍ່ໄດ້</td>
                            <td>{rows[0].damtoilet_damtoilet}</td>
                        </tr>
                        <tr>
                            <td>ໄດ້ແຍກ ຫ້ອງນໍ້າຄົນເຈັບ ແລະ ຫ້ອງນໍ້າພະນັກງານ</td>
                            <td
                                style={{
                                    color: Number(rows[0].sepratetoilet_value) === 1 ? 'green' : 'red',  // Green for "ແມ່ນ", Red for "ບໍ່ແມ່ນ"
                                }}
                            >
                                {Number(rows[0].sepratetoilet_value) === 1 ? "ແມ່ນ" : "ບໍ່ແມ່ນ"}
                            </td>
                        </tr>
                        <tr>
                            <td>ຫ້ອງນໍ້າຄົນເຈັບໄດ້ແຍກ ຫ້ອງຍິງ ຫ້ອງຊາຍ</td>
                            <td
                                style={{
                                    color: Number(rows[0].gender_gdvalue) === 1 ? 'green' : 'red',  // Green for "ແມ່ນ", Red for "ບໍ່ແມ່ນ"
                                }}
                            >
                                {Number(rows[0].gender_gdvalue) === 1 ? "ແມ່ນ" : "ບໍ່ແມ່ນ"}
                            </td>                         </tr>     <tr>
                            <td>ຫ້ອງນໍ້າທີ່ຄົນເຈັບຜູ້ຍິງເຂົ້າ ມີຖັງຂີ້ເຫຍື້ອມີຝາປົກ, ຫຼື ນໍ້າສະອາດ ແລະ ສະບູ ສໍາລັບມ້ຽນຄາບປະຈໍາເດືອນ</td>
                            <td
                                style={{
                                    color: Number(rows[0].wash_wash) === 1 ? 'green' : 'red',  // Green for "ແມ່ນ", Red for "ບໍ່ແມ່ນ"
                                }}
                            >
                                {Number(rows[0].wash_wash) === 1 ? "ແມ່ນ" : "ບໍ່ແມ່ນ"}
                            </td>                        </tr>     <tr>
                            <td>ມີຫ້ອງນໍ້າຢ່າງໜ້ອຍ 1 ຫ້ອງທີ່ຜູ້ພິການ ຫຼື ຜູ້ມີຂໍ້ຈໍາກັດໃນການເຄື່ອນໄຫວຮ່າງກາຍ ສາມາດເຂົ້າໄດ້</td>
                            <td
                                style={{
                                    color: Number(rows[0].special_special) === 1 ? 'green' : 'red',  // Green for "ແມ່ນ", Red for "ບໍ່ແມ່ນ"
                                }}
                            >
                                {Number(rows[0].special_special) === 1 ? "ມີ" : "ບໍ່ມີ"}
                            </td>                        </tr>

                    </tbody>
                </table>
    <table className="table">
                            <thead className="table-light">
                        <tr>
                            <th>ອະນາໄມ</th>
                            <th>ຫ້ອງກວດເຂດນອກ</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                ຫ້ອງກວດເຂດນອກ ມີ ສະບູ ແລະ ນ້ຳລ້າງມື (ຫຼື ເຈວລ້າງມືທີ່ມີທາດເຫຼົ້າ) ບໍ່ ?

                                <div
                                    style={{
                                        color:
                                            rows[0].Opd_opd === "Yes" ? 'green' :
                                                rows[0].Opd_opd === "Partially (not functional or lacking materials)" ? 'orange' :

                                                    rows[0].Opd_opd === "No" ? 'red' :
                                                        '',  // Green for "Yes", Red for "No", Orange for any other case
                                    }}
                                >
                                    {getDisplayName(rows[0].Opd_opd)}  {/* Display corresponding Lao text */}
                                </div>
                            </td>
                            <td rowSpan={2}>{images["Opd"] ? (  // Only display for "mainwater"
                                <img

                                    src={images["Opd"]}  // Reference the image URL for "mainwater"
                                    alt="opd"
                                    style={{ width: 180, marginTop: 20 }}
                                />
                            ) : (
                                <span style={{ color: "red" }}>ບໍ່ມີຮູບ</span>
                            )}</td>
                        </tr>
                        <tr>
                            <td>
                                ຫ້ອງນໍ້າ ມີສະບູ, ນໍ້າ ແລະ ອ່າງລ້າງມື ຢູ່ໃກ້ໆ ບໍ່ເກີນ 5 ແມັດ ?
                                <div
                                    style={{
                                        color:
                                            rows[0].soapfar_soapfar === "Yes" ? 'green' :
                                                rows[0].soapfar_soapfar === "Either no soap or functional hand washing facility" ? 'orange' :

                                                    rows[0].soapfar_soapfar === "No soap or hand washing facility is not functional" ? 'red' :
                                                        '',  // Green for "Yes", Red for "No", Orange for any other case
                                    }}
                                >
                                    {getDisplayName(rows[0].soapfar_soapfar)}  {/* Display corresponding Lao text */}
                                </div>
                            </td>

                        </tr>
                    </tbody>

                </table>
    <table className="table table-bordered">
                            <thead className="table-light">
                        <tr>
                            <th colSpan={2}>ຂີ້ເຫຍື້ອ - ໄດ້ແຍກ ຂີ້ເຫຍື້ອແຫຼມຄົມ, ຂີ້ເຫຍື້ອຕິດເຊື້ອ ແລະ ຂີ້ເຫຍື້ອທົ່ວໄປ ເປັນ 3 ຖັງຢ່າງປອດໄພ:        <span
                                    style={{
                                        color:
                                            rows[0].s3_sep === "Yes" ? 'green' :
                                                rows[0].s3_sep === "Somewhat (bins are full or include other waste)" ? 'orange' :

                                                    rows[0].s3_sep === "No" ? 'red' :
                                                        '',  // Green for "Yes", Red for "No", Orange for any other case
                                    }}
                                >
                                    {getDisplayName(rows[0].s3_sep)}  {/* Display corresponding Lao text */}
                                </span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td >ຂີ້ເຫຍື້ອປະເພດແຫຼມຄົມ:
                                <div
                                    style={{
                                        height: "6px",
                                        width: "150px",
                                        background:
                                            rows[0].disposal_disposal === "Chemical disinfection (e.g. with hypochlorite)" ||rows[0].disposal_disposal === "Autoclave" || rows[0].disposal_disposal === "High-temperature incinerator (2 chamber, 850-1000C"|| rows[0].disposal_disposal === "Brick incinerator/any type of low temperature inci"
                                                ? "green"
                                                : rows[0].disposal_disposal === "Not treated, but buried in lined, protected pit" || rows[0].disposal_disposal === "Not treated, but handled by the UDA/or designated" || rows[0].disposal_disposal === "Not treated, but stored at the healthcare facility" 
                                                    ? "orange"
                                                    : rows[0].disposal_disposal === "Open burning"||rows[0].disposal_disposal === "Open dumping without treatment"||rows[0].disposal_disposal === "Not treated and added to general waste" || rows[0].disposal_disposal === "Other"
                                                        ? "red"
                                                        : "#ccc",
                                    }}
                                ></div>

                                {images["disposal"] ? (  // Only display for "mainwater"
                                    <img

                                        src={images["disposal"]}  // Reference the image URL for "mainwater"
                                        alt="disposal"
                                        style={{ width: 180, marginTop: 20 }}
                                    />
                                ) : (
                                    <span style={{ color: "red" }}>ບໍ່ມີຮູບ</span>
                                )}
<div style={{ marginTop: "20px", fontSize: "18px" }}>
  
  {rows[0].disposal_disposal === "Other" 
    ? (
      <>
        {(rows[0].otherdis_otherdis)}
      </>
    ) 
    : (
      <>
        {getDisplayName(rows[0].disposal_disposal)}
      </>
    )
  }
</div>



                                </td>

                            <td>ຂີ້ເຫຍື້ອຕິດເຊື້ອ:
                                   <div
                                    style={{
                                        height: "6px",
                                        width: "150px",
                                        background:
                                            rows[0].infectious_infectious === "Chemical disinfection (e.g. with hypochlorite)" ||rows[0].infectious_infectious === "Autoclave" || rows[0].infectious_infectious === "high temperature incinerator (2 chamber 850-1000C)"|| rows[0].infectious_infectious === "Brick incinerator/or any type of low temperature i"
                                                ? "green"
                                                : rows[0].infectious_infectious === "Not treated, but buried in lined, protected pit" || rows[0].infectious_infectious=== "Not treated, but handled by the UDA/or designated" || rows[0].infectious_infectious === "Not treated, but stored at the healthcare facility" 
                                                    ? "orange"
                                                    : rows[0].infectious_infectious === "Open burning"||rows[0].infectious_infectious === "Open dumping without treatment"|| rows[0].infectious_infectious === "Not treated and added to general waste" || rows[0].infectious_infectious === "Other"
                                                        ? "red"
                                                        : "#ccc",
                                    }}
                                ></div>
                                {images["infectious"] ? (  // Only display for "mainwater"
                                    <img

                                        src={images["infectious"]}  // Reference the image URL for "mainwater"
                                        alt="infectious"
                                        style={{ width: 180, marginTop: 20 }}
                                    />
                                ) : (
                                    <span style={{ color: "red" }}>ບໍ່ມີຮູບ</span>
                                )}
<div style={{ marginTop: "20px", fontSize: "18px" }}>
  {rows[0].infectious_infectious === "Other" 
    ? (
      <>
      
        {(rows[0].otherinf_otherinf)}
      </>
    ) 
    : (
      <>
        {getDisplayName(rows[0].infectious_infectious)}
      </>
    )
  }
</div>
                            </td>
                        </tr>

                    </tbody>

                </table>
            </div>

        </div>
                            <Weater orgUnitId={orgUnitId} year={year}/>

</div>
        
    );
};

export default Wash;

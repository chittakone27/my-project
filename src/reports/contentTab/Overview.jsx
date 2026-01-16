import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import RouterIcon from '@mui/icons-material/Router';
import MapIcon from '@mui/icons-material/Map';
import { API_AUTH } from "../../config";
import Bed from "./bed"
import '../validate/print.css'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// Helper function to map event rows
const mapEventRow = (apiRow) => ({
  electric_electric: apiRow[23] || "",
  electric_powerbackup: apiRow[25] || "",
  phone_signal: apiRow[21] || "",
  internet_router: apiRow[28] || "",
  internet_cable: apiRow[22] || "",
  internet_status: apiRow[26] || "",
  internet_whopay: apiRow[24] || "",
  out_treat_time: apiRow[27] || "",
});

const mapEventRow2 = (apiRow2) => ({
  1: apiRow2[49] || "",
  2: apiRow2[43] || "",
  3: apiRow2[26] || "",
  4: apiRow2[36] || "",
  5: apiRow2[40] || "",
  6: apiRow2[46] || "",
  7: apiRow2[22] || "",
  8: apiRow2[29] || "",
  9: apiRow2[27] || "",
  10: apiRow2[33] || "",
  11: apiRow2[23] || "",
  12: apiRow2[25] || "",
});

const mapServicePhone = (eventRows2) => eventRows2.map((apiRow2) => ({
  ETL_phone: apiRow2[41] || "",
  Unitel_phone: apiRow2[31] || "",
  Vietnamese_Sim_phone: apiRow2[35] || "",
  Thai_Sim_phone: apiRow2[21] || "",
  Other_phone: apiRow2[28] || "",
  Winphone_phone: apiRow2[47] || "",
  Beeline_phone: apiRow2[48] || "",
  Lth_phone: apiRow2[50] || "",
  special_phone: apiRow2[24] || "",
}));

const mapServiceInternet = (eventRows2) => eventRows2.map((apiRow2) => ({
  ETL_internet: apiRow2[45] || "",
  Unitel_internet: apiRow2[44] || "",
  Vietnamese_Sim_internet: apiRow2[38] || "",
  Thai_Sim_internet: apiRow2[34] || "",
  Other_internet: apiRow2[32] || "",
  Winphone_internet: apiRow2[42] || "",
  Beeline_internet: apiRow2[39] || "",
  Lth_internet: apiRow2[37] || "",
  special_internet: apiRow2[30] || "",
}));

const Overview = ({ orgUnitId, year, onRowCount, Eventstatus,Eventdate ,orgUnitLabel}) => {
  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);
  const [servicePhone, setServicePhone] = useState([]);
  const [serviceINrows, setServiceINrows] = useState([]);

  const [loading, setLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  const [options, setOptions] = useState({});

  const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=WUCVzpyRBHR.dww5EckWlhe&dimension=WUCVzpyRBHR.M0klNUD2fP5&dimension=WUCVzpyRBHR.JYVWqdlRq4Y&dimension=WUCVzpyRBHR.fszEmzFYXHU&dimension=WUCVzpyRBHR.xQS1owULSbL&dimension=WUCVzpyRBHR.nhilsZioxC9&dimension=WUCVzpyRBHR.eq1FTj6Z2vT&dimension=WUCVzpyRBHR.SVSfEQFVBUj&stage=WUCVzpyRBHR&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;
  const url2 = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=WUCVzpyRBHR.O5TwLn4hWFr&dimension=WUCVzpyRBHR.zLgkhPBoASd&dimension=WUCVzpyRBHR.fspSJIn4Vqq&dimension=WUCVzpyRBHR.oxzEWQ0BkDQ&dimension=WUCVzpyRBHR.OADBGdVi279&dimension=WUCVzpyRBHR.Y0KkCeX3jUv&dimension=WUCVzpyRBHR.TXc0EBAuhHE&dimension=WUCVzpyRBHR.rKIPUko4uIS&dimension=WUCVzpyRBHR.BRHYwOIZ01O&dimension=WUCVzpyRBHR.Zc3FhnkGI7H&dimension=WUCVzpyRBHR.Pza84UE33Qh&dimension=WUCVzpyRBHR.rMDTqJBGufz&dimension=WUCVzpyRBHR.cokIAx7lbWF&dimension=WUCVzpyRBHR.PMN34xrGhew&dimension=WUCVzpyRBHR.l91Lp6CKVQW&dimension=WUCVzpyRBHR.clHAviSg1NZ&dimension=WUCVzpyRBHR.zxfjpZ9yziJ&dimension=WUCVzpyRBHR.khA9UFm6Qpq&dimension=WUCVzpyRBHR.NIji1vKjEsn&dimension=WUCVzpyRBHR.ycwkJ30qjwb&dimension=WUCVzpyRBHR.bxEtg4oxf4m&dimension=WUCVzpyRBHR.F9lxwEAGnHE&dimension=WUCVzpyRBHR.X67WGTx2djm&dimension=WUCVzpyRBHR.t1Z7lsQ2Qte&dimension=WUCVzpyRBHR.SO1P5eMGMSc&dimension=WUCVzpyRBHR.L1lvlYVBaVN&dimension=WUCVzpyRBHR.K3q2Vgo6p6P&dimension=WUCVzpyRBHR.N3dIyivSvSo&dimension=WUCVzpyRBHR.kMHppy04I0O&dimension=WUCVzpyRBHR.BkK10QaD8FE&stage=WUCVzpyRBHR&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(url, { auth: API_AUTH });
        // const res = await axios.get(url);

        const eventRows = res.data.rows || [];
        // const res2 = await axios.get(url2);
        const res2 = await axios.get(url2, { auth: API_AUTH });

        const eventRows2 = res2.data.rows || [];

        if (onRowCount) {
          onRowCount(eventRows.length); // ✅ SEND ROW COUNT TO PARENT
        }

        setRowCount(eventRows.length);
               if (!eventRows.length && Eventstatus) {
          Eventstatus("");
                    Eventdate("")

        }
        if (eventRows.length > 0 && Eventstatus && Eventdate) {
          const eventStatus = eventRows[0][19]; // Get directly from original rows
          const eventdate = eventRows[0][2]; // Get directly from original rows
          Eventdate(eventdate)
          Eventstatus(eventStatus);
        }

        setRows(eventRows.map(mapEventRow));
        setRows2(eventRows2.map(mapEventRow2));
        setServicePhone(mapServicePhone(eventRows2));
        setServiceINrows(mapServiceInternet(eventRows2));

        // Set options (assuming they are part of the metadata response)
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

  if (loading) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
          ກຳລັງໂຫຼດຂໍ້ມູນ I. ຕຶກອາຄານ, ເຄື່ອງໃຊ້ ແລະ ການລົງເຄື່ອນທີ່...
        </p>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div       className="d-flex flex-column justify-content-betweenp-5"

      style={{ 
        backgroundColor: "#fff",
        fontFamily: "'Noto Sans Lao', sans-serif",
       }}>

        <h4 className="mb-3">I. ຕຶກອາຄານ, ເຄື່ອງໃຊ້ ແລະ ການລົງເຄື່ອນທີ່</h4>
        <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
      </div>
    );
  }

  return (
       <div className="container mt-3 page-break " style={{ 
        backgroundColor: "#fff",
        fontFamily: "'Noto Sans Lao', sans-serif",
       }}>


      <h4 className="mb-3">1. ຕຶກອາຄານ, ເຄື່ອງໃຊ້ ແລະ ການລົງເຄື່ອນທີ່</h4>
      <div  >
    <table className="table">
                        <thead className="table-light">
            <tr style={{ textAlign: "center" }}>
              {/* Electricity */}
              <td style={{ width: "200px", minWidth: "180px", padding: "10px", verticalAlign: "top" }}>
                <div style={{ fontSize: "20px", marginBottom: "5px" }}>ໄຟຟ້າ</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <ElectricBoltIcon style={{ fontSize: "80px" }} />
                </div>
                <div
                  style={{
                    height: "6px",
                    width: "100px",
                    margin: "10px auto",
                    background:
                      rows[0].electric_electric === "Available, all the time"
                        ? "green"
                        : rows[0].electric_electric === "Available, but occasionally cut off (without signi"
                          ? "orange"
                          : rows[0].electric_electric === "Not available"
                            ? "red"
                            : "#ccc",
                  }}
                ></div>
                <p style={{ marginTop: "10px", textAlign: "center" }}>
                  {getDisplayName(rows[0].electric_electric || "—")}
                </p>
              </td>

              {/* Phone / Signal */}
              <td style={{ width: "200px", minWidth: "180px", padding: "10px", verticalAlign: "top" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "20px", marginBottom: "5px" }}>
                    ສັນຍານໂທລະສັບ
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <SignalCellularAltIcon style={{ fontSize: "80px" }} />
                  </div>
                  <div
                    style={{
                      height: "6px",
                      width: "100px",
                      margin: "10px auto",
                      background:
                        rows[0].phone_signal === "Can"
                          ? "green"
                          : rows[0].phone_signal === "partially can"
                          ? "orange"
                          : rows[0].phone_signal === "Cannot"
                          ? "red"
                          : "#ccc",
                    }}
                  ></div>
                  <p style={{ marginTop: "10px", textAlign: "center" }}>
                    {getDisplayName(rows[0].phone_signal || "—")}
                  </p>
                </div>
              </td>

              {/* Internet */}
              <td style={{ width: "200px", minWidth: "180px", padding: "10px", verticalAlign: "top" }}>
                <div style={{ fontSize: "20px", marginBottom: "5px" }}>ອິນເຕີເນັດ</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <RouterIcon style={{ fontSize: "80px" }} />
                </div>
                <div
                  style={{
                    height: "6px",
                    width: "100px",
                    margin: "10px auto",
                    background:
                      rows[0].internet_status === "Available"
                        ? "green"
                        : rows[0].internet_status === "Available, but often disrupted"
                          ? "orange"
                          : rows[0].internet_status === "Not available"
                            ? "red"
                            : "#ccc",
                  }}
                ></div>
                <p style={{ marginTop: "10px", textAlign: "center" }}>
                  {getDisplayName(rows[0].internet_status || "—")}
                </p>
              </td>

              {/* Map / Movement */}
              <td style={{ width: "200px", minWidth: "180px", padding: "10px", verticalAlign: "top" }}>
                <div style={{ fontSize: "20px", marginBottom: "5px" }}>ການລົງເຄື່ອນທີ່</div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <MapIcon style={{ fontSize: "80px" }} />
                </div>
                <p style={{ fontSize: "28px" }}>{rows[0].out_treat_time || "—"}</p>
                <p>(ຄັ້ງພາຍໃນປີ)</p>
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>ໄຟຟ້າສໍາຮອງ: {getDisplayName(rows[0].electric_powerbackup || "—")}</td>
              <td>
                <span>ເຄືອຄ່າຍ: </span>
                {/* Phone Services */}
             {servicePhone[0] && (
  <>
   {servicePhone[0] && (
  <>
    {Object.entries(servicePhone[0])
      .filter(([key, value]) => value === "1") // Filter for values that are "1"
      .map(([key]) => {
        let serviceName = "";

        // Map the key to a more readable name
        switch (key) {
          case "ETL_phone":
            serviceName = "ETL";
            break;
          case "Unitel_phone":
            serviceName = "Unitel";
            break;
          case "Vietnamese_Sim_phone":
            serviceName = "Vietnamese SIM";
            break;
          case "Thai_Sim_phone":
            serviceName = "Thai SIM";
            break;
          case "Other_phone":
            serviceName = (servicePhone[0].special_phone);
            break;
          case "Winphone_phone":
            serviceName = "Winphone";
            break;
          case "Beeline_phone":
            serviceName = "Beeline";
            break;
          case "Lth_phone":
            serviceName = "Lth";
            break;
        
          default:
            serviceName = key; // If no match, use the original key
        }
        
        return serviceName; // Return the readable name
      })
      .join(" ; ") // Join all the names with " ; "
    }
  </>
)}

  </>
)}

              </td>
              <td>
                <p>ວາຍຟາຍ: {rows[0].internet_router || "—"} (Mbps)</p>
                <p>ເນັດສາຍ: {rows[0].internet_cable || "—"} (Mbps)</p>
                <p>ງົບປະມານ: {getDisplayName(rows[0].internet_whopay || "—")}</p>
              <span>ເຄືອຄ່າຍ: </span>
{serviceINrows[0] && (
  Object.entries(serviceINrows[0])
    .filter(([key, value]) => value === "1") // Filter for values that are "1"
    .map(([key]) => {
      let serviceName = "";

      // Map the key to a more readable name
      switch (key) {
        case "ETL_internet":
          serviceName = "ETL";
          break;
        case "Unitel_internet":
          serviceName = "Unitel";
          break;
        case "Vietnamese_Sim_internet":
          serviceName = "Vietnamese SIM";
          break;
        case "Thai_Sim_internet":
          serviceName = "Thai SIM";
          break;
        case "Other_internet":
          // Assuming you want to display the value from `servicePhone[0].special_internet`
          serviceName = servicePhone[0]?.special_internet || "Special"; // Default to "Special" if not found
          break;
        case "Winphone_internet":
          serviceName = "Winphone";
          break;
        case "Beeline_internet":
          serviceName = "Beeline";
          break;
        case "Lth_internet":
          serviceName = "Lth";
          break;
        default:
          serviceName = key; // If no match, use the original key
      }

      return serviceName; // Return the readable name
    })
    .join(" ; ") // Join all the names with " ; "
)}


              </td>
              <td>
                <p>ເດືອນທີ່ລົງ: </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 4fr)",
                    gap: "6px",
                    width: "250px",
                    margin: "0 auto",
                    textAlign: "center",
                  }}
                >
                  {Object.entries(rows2[0] || {}).map(([month, value], index) => (
<div
  key={index}
  style={{
    padding: "10px",
    backgroundColor: value === "1" ? "green" : "#ccc",
    color: value === "1" ? "white" : "black",
    borderRadius: "5px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
  }}
>
  {value === "1" && (
    <CheckCircleOutlineIcon
      style={{ color: "black", fontSize: "18px" }}
    />
  )}
  {month.charAt(0).toUpperCase() + month.slice(1)}
</div>

                  ))}
                </div>
              </td>
            </tr>
          </tbody>

        </table>
              <Bed orgUnitId={orgUnitId} year={year}/>

      </div>

    </div>
    
  );
};

export default Overview;

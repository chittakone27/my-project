import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_AUTH } from "../../config";
import '../validate/print.css'
import FDstaff from "./foodNdrug";

const coondinator = ({ orgUnitId, year,onRowCount,Eventstatus ,Eventdate}) => {
  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);
  const [options, setOptions] = useState([]);

  const [loading, setLoading] = useState(true);
const [rowCount, setRowCount] = useState(0);
  const [headname, setheadname] = useState([]);
  const [headphone, setheadphone] = useState([]);
  const [headposition,setheadposition]=useState([])
 const [altname, setaltname] = useState([]);
  const [altphone, setaltphone] = useState([]);
  const [altposition,setaltposition]=useState([])



  const url = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=L6OUrGJCq69.JbwHiNVcmSQ&dimension=L6OUrGJCq69.mP26BdOPq1s&dimension=L6OUrGJCq69.gfVrKxCgmZg&dimension=L6OUrGJCq69.dogMKw4YQi6&dimension=L6OUrGJCq69.nMtlkJMhXZo&dimension=L6OUrGJCq69.gECI3qCAG3z&dimension=L6OUrGJCq69.nF1Qi36Mvoh&dimension=L6OUrGJCq69.GR4o5L0HbCo&dimension=L6OUrGJCq69.ROR3qpzgQQ6&dimension=L6OUrGJCq69.gXs2SMhVjrc&dimension=L6OUrGJCq69.rpt2nT8IeyI&dimension=L6OUrGJCq69.rxS2nT0THr4&dimension=L6OUrGJCq69.XdN4DiRdbT6&dimension=L6OUrGJCq69.ecsoaUOowEO&dimension=L6OUrGJCq69.FODGOgjn8vd&dimension=L6OUrGJCq69.OV65eBiEnl9&dimension=L6OUrGJCq69.JHesGHVHKRc&dimension=L6OUrGJCq69.IhWoKTEPA49&dimension=L6OUrGJCq69.LU6bCFXTSkX&dimension=L6OUrGJCq69.tR0b3Q278Si&dimension=L6OUrGJCq69.elixGs0moWC&dimension=L6OUrGJCq69.pPnaLSoTKeO&dimension=L6OUrGJCq69.Pp082v0vFMV&dimension=L6OUrGJCq69.Cb9nJ4gSPGN&dimension=L6OUrGJCq69.Pus81m4pqxC&dimension=L6OUrGJCq69.drZ778iJ7o2&dimension=L6OUrGJCq69.sMqisNzLyfQ&dimension=L6OUrGJCq69.vKjd2Xbizhl&dimension=L6OUrGJCq69.xuwlvQZayGx&dimension=L6OUrGJCq69.sNXRip8Df56&dimension=L6OUrGJCq69.NYEl9w9G8wp&dimension=L6OUrGJCq69.Zrd3r2zUBs6&dimension=L6OUrGJCq69.yXt8cgnueyA&dimension=L6OUrGJCq69.osseF0rSVKB&dimension=L6OUrGJCq69.ljSeTJ1tB5n&dimension=L6OUrGJCq69.FVuC3lkvVeD&dimension=L6OUrGJCq69.jACOzQ0mJWB&dimension=L6OUrGJCq69.q5ShhkNS5Ui&dimension=L6OUrGJCq69.LE23GETUB4k&dimension=L6OUrGJCq69.Jzhyjw88TWG&dimension=L6OUrGJCq69.DL0MogB8XeT&dimension=L6OUrGJCq69.T87T7mngUQA&dimension=L6OUrGJCq69.fouC8955pZS&dimension=L6OUrGJCq69.lKnUGTHylmb&dimension=L6OUrGJCq69.VDp8OKcY4RA&dimension=L6OUrGJCq69.vnzurWvMHoJ&dimension=L6OUrGJCq69.M4LrWHXtsO7&dimension=L6OUrGJCq69.DdoFPqj1y9Z&dimension=L6OUrGJCq69.vXlfnRD8zuo&dimension=L6OUrGJCq69.mH39NDtkbfk&dimension=L6OUrGJCq69.De3fPfrH7h3&dimension=L6OUrGJCq69.KOymMBU0r70&dimension=L6OUrGJCq69.kfpgFnb7q8g&dimension=L6OUrGJCq69.uzvv52Z2o06&dimension=L6OUrGJCq69.ygCtRNZgAy5&dimension=L6OUrGJCq69.jLGAk8yKtNR&stage=L6OUrGJCq69&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false&outputIdScheme=UID`;
  const url2 = `https://hfml.gov.la/hfml/api/29/analytics/events/query/wkUHtogPKUL.json?dimension=pe:${year}&dimension=ou:${orgUnitId}&dimension=L6OUrGJCq69.J4JNG7HvErr&dimension=L6OUrGJCq69.OocjBJGGu0p&dimension=L6OUrGJCq69.KRyUPEGRpct&dimension=L6OUrGJCq69.GKwqkVL6Cjy&dimension=L6OUrGJCq69.cV2HtrO7So2&dimension=L6OUrGJCq69.vPxHplhPYAi&dimension=L6OUrGJCq69.u0dUA2WbrKo&dimension=L6OUrGJCq69.siXKKIODhgK&dimension=L6OUrGJCq69.DDIqnYA3KZo&dimension=L6OUrGJCq69.DIoi8wE1ky1&dimension=L6OUrGJCq69.Hsw0zV9d5Tt&dimension=L6OUrGJCq69.rEqDdCxMD3E&dimension=L6OUrGJCq69.DVSy2o704A9&dimension=L6OUrGJCq69.wxylBb6OPr9&dimension=L6OUrGJCq69.tKDqtcqb4vz&dimension=L6OUrGJCq69.nM52cfphobp&dimension=L6OUrGJCq69.JaN8KVOdJQj&dimension=L6OUrGJCq69.mApGw2xVtOK&dimension=L6OUrGJCq69.I4AIsuUizCo&dimension=L6OUrGJCq69.N69pGgMQEeK&dimension=L6OUrGJCq69.G4tPZoNN1RM&dimension=L6OUrGJCq69.eAqKgUVeefb&dimension=L6OUrGJCq69.I153dA0KCXb&dimension=L6OUrGJCq69.ZYeLggpgG6N&dimension=L6OUrGJCq69.WRwajD4wTjG&dimension=L6OUrGJCq69.nMfNkUpvKfH&dimension=L6OUrGJCq69.HVurPv877we&dimension=L6OUrGJCq69.Hnsqe3x47xg&stage=L6OUrGJCq69&displayProperty=NAME&totalPages=false&outputType=EVENT&desc=eventdate&paging=false`;





  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await axios.get(url, { auth: API_AUTH });
        // const res = await axios.get(url);

        // const eventRows = res.data.rows || [];
            const res2 = await axios.get(url2, { auth: API_AUTH });
            // const res2 = await axios.get(url2);

        const eventRows2 = res2.data.rows || [];

        const eventRows = res.data.rows || [];

    setOptions(res2.data.metaData.items || {});

          if (onRowCount) {
  onRowCount(eventRows.length);   // ✅ SEND ROW COUNT TO PARENT
}


      // ✅ VALIDATION: Check row count
      setRowCount(eventRows.length);
const mappedRows = eventRows.map(apiRow => {
        const rowData = {};

  
  rowData["stastic_main"] = apiRow[21] || ""; 
  rowData["stastic_main_phonenumber"] = apiRow[74] || ""; 
  rowData["stastic_dputy_name"] = apiRow[47] || ""; 
    rowData["stastic_dputy_number"] = apiRow[56] || ""; 

    rowData["planing_main"] = apiRow[73] || ""; 
  rowData["planing_main_phonenumber"] = apiRow[22] || ""; 
  rowData["planing_dputy_name"] = apiRow[36] || ""; 
    rowData["planing_dputy_number"] = apiRow[62] || ""; 

    rowData["admin_main"] = apiRow[44] || ""; 
  rowData["admin_main_phonenumber"] = apiRow[43] || ""; 
  rowData["admin_dputy_name"] = apiRow[49] || ""; 
    rowData["admin_dputy_number"] = apiRow[31] || ""; 

    rowData["mch_main"] = apiRow[75] || ""; 
  rowData["mch_main_phonenumber"] = apiRow[71] || ""; 
  rowData["mch_dputy_name"] = apiRow[48] || ""; 
    rowData["mch_dputy_number"] = apiRow[42] || ""; 

    rowData["nut_main"] = apiRow[30] || ""; 
  rowData["nut_main_phonenumber"] = apiRow[28] || ""; 
  rowData["nut_dputy_name"] = apiRow[40] || ""; 
    rowData["nut_dputy_number"] = apiRow[23] || ""; 

    rowData["epi_main"] = apiRow[27] || ""; 
  rowData["epi_main_phonenumber"] = apiRow[57] || ""; 
  rowData["epi_dputy_name"] = apiRow[60] || ""; 
    rowData["epi_dputy_number"] = apiRow[51] || ""; 

    rowData["treat_main"] = apiRow[63] || ""; 
  rowData["treat_main_phonenumber"] = apiRow[37] || ""; 
  rowData["treat_dputy_name"] = apiRow[69] || ""; 
    rowData["treat_dputy_number"] = apiRow[39] || ""; 

    rowData["nhi_main"] = apiRow[58] || ""; 
  rowData["nhi_main_phonenumber"] = apiRow[26] || ""; 
  rowData["nhi_dputy_name"] = apiRow[55] || ""; 
    rowData["nhi_dputy_number"] = apiRow[61] || ""; 

    rowData["malaria_main"] = apiRow[52] || ""; 
  rowData["malaria_main_phonenumber"] = apiRow[68] || ""; 
  rowData["malaria_dputy_name"] = apiRow[50] || ""; 
    rowData["malaria_dputy_number"] = apiRow[67] || ""; 

    rowData["tuber_main"] = apiRow[24] || ""; 
  rowData["tuber_main_phonenumber"] = apiRow[66] || ""; 
  rowData["tuber_dputy_name"] = apiRow[35] || ""; 
    rowData["tuber_dputy_number"] = apiRow[54] || ""; 

    rowData["hiv_main"] = apiRow[33] || ""; 
  rowData["hiv_main_phonenumber"] = apiRow[41] || ""; 
  rowData["hiv_dputy_name"] = apiRow[76] || ""; 
    rowData["hiv_dputy_number"] = apiRow[46] || ""; 

    rowData["com_main"] = apiRow[59] || ""; 
  rowData["com_main_phonenumber"] = apiRow[45] || ""; 
  rowData["com_dputy_name"] = apiRow[25] || ""; 
    rowData["com_dputy_number"] = apiRow[64] || ""; 

    rowData["ncd_main"] = apiRow[70] || ""; 
  rowData["ncd_main_phonenumber"] = apiRow[38] || ""; 
  rowData["ncd_dputy_name"] = apiRow[72] || ""; 
    rowData["ncd_dputy_number"] = apiRow[34] || ""; 

    rowData["wash_main"] = apiRow[29] || ""; 
  rowData["wash_main_phonenumber"] = apiRow[53] || ""; 
  rowData["wash_dputy_name"] = apiRow[32] || ""; 
    rowData["wash_dputy_number"] = apiRow[65] || ""; 



  return rowData;
});


const mappedRows2 = eventRows2.map(apiRow => {
        const rowData2 = {};

  rowData2["stastic_main_position"] = apiRow[46] || ""; 
    rowData2["stastic_dputy_position"] = apiRow[42] || ""; 

rowData2["planing_main_position"] = apiRow[29] || ""; 
rowData2["planing_dputy_position"] = apiRow[37] || ""; 


    rowData2["admin_main_position"] = apiRow[23] || ""; 
    rowData2["admin_dputy_position"] = apiRow[40] || ""; 


    rowData2["mch_main_position"] = apiRow[22] || ""; 
    rowData2["mch_dputy_position"] = apiRow[27] || ""; 


    rowData2["nut_main_position"] = apiRow[21] || ""; 
    rowData2["nut_dputy_position"] = apiRow[25] || ""; 


    rowData2["epi_main_position"] = apiRow[32] || ""; 

    rowData2["epi_dputy_position"] = apiRow[33] || ""; 


    rowData2["treat_main_position"] = apiRow[24] || ""; 
 
    rowData2["treat_dputy_position"] = apiRow[30] || ""; 
    

    rowData2["nhi_main_position"] = apiRow[48] || ""; 
      rowData2["nhi_dputy_position"] = apiRow[38] || ""; 

 

    rowData2["malaria_main_position"] = apiRow[41] || ""; 
    rowData2["malaria_dputy_position"] = apiRow[31] || ""; 


    rowData2["tuber_main_position"] = apiRow[39] || ""; 
    rowData2["tuber_dputy_position"] = apiRow[28] || ""; 


    rowData2["hiv_main_position"] = apiRow[47] || ""; 
    rowData2["hiv_dputy_position"] = apiRow[44] || ""; 


    rowData2["com_main_position"] = apiRow[35] || ""; 
    rowData2["com_dputy_position"] = apiRow[45] || ""; 


    rowData2["ncd_main_position"] = apiRow[34] || ""; 
    rowData2["ncd_dputy_position"] = apiRow[36] || ""; 


    rowData2["wash_main_position"] = apiRow[43] || ""; 
    rowData2["wash_dputy_position"] = apiRow[26] || ""; 

  return rowData2;
});

        setRows(mappedRows);
        setRows2(mappedRows2);

// When calling eventdate, format it:


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
     

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [orgUnitId, year]);
 // Function to get name by code
  const getDisplayName = (code) => {
  

    const items = Object.values(options); // convert object to array

    const match = items.find((item) => item.code === code);

    return match ? match.name : code;
  };



  if (loading) {
    return (
      <div className="text-center my-3">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>ກຳລັງໂຫຼດຂໍ້ມູນ ພະນັກງານຜູ້ຮັບຜິດຊອບ / ຜູ້ປະສານງານ ຢູ່ສະຖານທີ່ດັ່ງກາວ...</p>
      </div>
    );
  }
  if (!rows.length) return <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
    <h4 className="mb-3">5. ພະນັກງານຜູ້ຮັບຜິດຊອບ</h4>
    <p className="text-danger fw-bold">ບໍ່ມີຂໍ້ມູນ</p>
  </div>;

  return (
    <div className="container mt-3" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <h4 className="mb-3">5. ພະນັກງານຜູ້ຮັບຜິດຊອບ</h4>
      <div className="table-responsive">
    <table className="table">
                        <thead className="table-light">
            <tr>
              <th></th>
              <th></th>
              <th>ຊື່ ແລະ ນາມສະກຸນ</th>
              <th>ເບີໂທລະສັບ</th>
              <th>ຕໍາແໜ່ງ</th>
            </tr>
          </thead>
          <tbody>
  <tr>
    <td rowspan="2"style={{width:'200',wordWrap: "break-word"}}>1. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກສະຖິຕິ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
  <td>{rows[0]?.stastic_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.stastic_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
<td>{getDisplayName(rows2[0]?.stastic_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>



  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
  <td>{rows[0]?.stastic_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
        <td>{rows[0]?.stastic_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{getDisplayName(rows2[0]?.stastic_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>
  </tr>
   <tr>
    <td rowspan="2">2. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກແຜນການ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
   <td>{rows[0]?.planing_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.planing_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
   <td>{getDisplayName(rows2[0]?.planing_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>


  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
  <td>{rows[0]?.planing_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
        <td>{rows[0]?.planing_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
   <td>{getDisplayName(rows2[0]?.planing_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>
  </tr>
     <tr>
    <td rowspan="2">3. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກບໍລິຫານ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
   <td>{rows[0]?.admin_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.admin_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
   <td>{getDisplayName(rows2[0]?.admin_main_position|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
 <td>{rows[0]?.admin_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
        <td>{rows[0]?.admin_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
   <td>{getDisplayName(rows2[0]?.admin_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>
  </tr>   <tr>
    <td rowspan="2">4. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານ ແມ່ ແລະ ເດັກ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
    <td>{rows[0]?.mch_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.mch_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{getDisplayName(rows2[0]?.mch_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
 <td>{rows[0]?.mch_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{rows[0]?.mch_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
      <td>{getDisplayName(rows2[0]?.mch_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>   <tr>
    <td rowspan="2">5. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານໂພຊະນາການ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
  <td>{rows[0]?.nut_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.nut_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{getDisplayName(rows2[0]?.nut_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
 <td>{rows[0]?.nut_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{rows[0]?.nut_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{getDisplayName(rows2[0]?.nut_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>
  </tr>   <tr>
    <td rowspan="2">6. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານສັກຢາກັນພະຍາດ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
    <td>{rows[0]?.epi_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.epi_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{getDisplayName(rows2[0]?.epi_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
   <td>{rows[0]?.epi_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{rows[0]?.epi_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{getDisplayName(rows2[0]?.epi_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>
  </tr>   <tr>
    <td rowspan="2">7. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານປິ່ນປົວ ແລະ ຟື້ນຟູໜ້າທີ່ການ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
      <td>{rows[0]?.treat_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.treat_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
      <td>{getDisplayName(rows2[0]?.treat_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
  <td>{rows[0]?.treat_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{rows[0]?.treat_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
        <td>{getDisplayName(rows2[0]?.treat_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>   <tr>
    <td rowspan="2">8. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານປະກັນສຸຂະພາບ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
    <td>{rows[0]?.nhi_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.nhi_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
        <td>{getDisplayName(rows2[0]?.nhi_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>


  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
  <td>{rows[0]?.nhi_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{rows[0]?.nhi_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
        <td>{getDisplayName(rows2[0]?.nhi_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>   <tr>
    <td rowspan="2">9. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານໄຂ້ຍຸງ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
   <td>{rows[0]?.malaria_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.malaria_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
   <td>{getDisplayName(rows2[0]?.malaria_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
     <td>{rows[0]?.malaria_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.malaria_dputy_number || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
   <td>{getDisplayName(rows2[0]?.malaria_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>
  </tr>   <tr>
    <td rowspan="2">10. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານວັນນະໂລກ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
   <td>{rows[0]?.tuber_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.tuber_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
       <td>{getDisplayName(rows2[0]?.tuber_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>


  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
   <td>{rows[0]?.tuber_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{rows[0]?.tuber_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
       <td>{getDisplayName(rows2[0]?.tuber_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>
  </tr>   <tr>
    <td rowspan="2">11. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານເອດ ແລະ ພະຍາດຕິດຕໍ່ທາງເພດສໍາພັນ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
    <td>{rows[0]?.hiv_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.hiv_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{getDisplayName(rows2[0]?.hiv_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
    <td>{rows[0]?.hiv_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{rows[0]?.hiv_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{getDisplayName(rows2[0]?.hiv_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>   <tr>
    <td rowspan="2">12. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານລະບາດ</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
     <td>{rows[0]?.com_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.com_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
     <td>{getDisplayName(rows2[0]?.com_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>


  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
 <td>{rows[0]?.com_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{rows[0]?.com_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
       <td>{getDisplayName(rows2[0]?.com_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>   <tr>
    <td rowspan="2">13. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານພະຍາດບໍ່ຕິດຕໍ່ (ມະເຮັງ, ເບົາຫວານ, ໂລກຫົວໃຈ ແລະ ອື່ນໆ)</td>
    <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>
      <td>{rows[0]?.ncd_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.ncd_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
        <td>{getDisplayName(rows2[0]?.ncd_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>


  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
 <td>{rows[0]?.ncd_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{rows[0]?.ncd_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
        <td>{getDisplayName(rows2[0]?.ncd_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>

  </tr>   <tr>
    <td rowspan="2">14. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານນໍ້າສະອາດ, ສຸຂາພິບານ ແລະ ອະນາໄມ</td>
        <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>

  <td>{rows[0]?.wash_main || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{rows[0]?.wash_main_phonenumber || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{getDisplayName(rows2[0]?.wash_main_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>


  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
 <td>{rows[0]?.wash_dputy_name || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{rows[0]?.wash_dputy_number|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{getDisplayName(rows2[0]?.wash_dputy_position || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>
  </tr>
  <tr>
    <td rowspan="2">15. ພະນັກງານຜູ້ຮັບຜິດຊອບ ວຽກງານ ອາຫານ ແລະ ຢາ</td>
        <td>ຜູ້ຮັບຜິດຊອບຫຼັກ</td>

  <td>{headname || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
    <td>{headphone || <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{getDisplayName(headposition|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>


  </tr>
  <tr>
    <td>ຜູ້ສໍາຮອງ</td>
 <td>{altname|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{altphone|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>}</td>
  <td>{getDisplayName(altposition|| <span style={{ color: "red" }}>ບໍ່ມີຂໍ້ມູນ</span>)}</td>
  </tr>
  
  



          </tbody>
        </table>
      </div>
<FDstaff
  orgUnitId={orgUnitId}
  year={year}
  setname={(value) => setheadname(value)}
  setphone={(value) => setheadphone(value)}
  setposition={(value) => setheadposition(value)}
    setaltname={(value) => setaltname(value)}
  setaltphone={(value) => setaltphone(value)}
  setaltposition={(value) => setaltposition(value)}
/>
    </div>
  );
};

export default coondinator;

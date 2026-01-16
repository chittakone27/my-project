import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import OrgUnitTree from "./OrgUnitTree/OrgUnitTree";
import ClinicalEquipment from "./contentTab/ClinixalEquiment";
import ICTvalidate from "./validate/validateict"; 
import Information from "./contentTab/information";
import Medicine from "./contentTab/medicine";
import Overview from "./contentTab/Overview";
import ICT from "./contentTab/ict";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useReactToPrint } from "react-to-print";
import PrintIcon from '@mui/icons-material/Print';
import './validate/print.css'
import { API_AUTH } from "../config";
import Condinator from "./contentTab/coondinator"
import Healthstatus from './heathFacilityStatus/heathFacilityStatus'
import Catchment_dry from "./contentTab/catchment";
import Wash from './contentTab/wash'
import Nearby from "./contentTab/nearby";
import Valtdate_nearby_dry from "./validate/validate_nearby";
import Validate_catchment from './validate/validate_catchment'
import Catchmentdry from "./contentTab/catchment_dry";
import Catchment_rain from "./contentTab/catchment_rain";
import Cover from './cover'
import Sign from './sign2'
import Ictdetail from './contentTab/ictdetail'
const PROGRAM_ID = "wkUHtogPKUL";

const OrgUnitReport = () => {
  const [rawOrgTree, setRawOrgTree] = useState([]);
  const [allowedOrgIds, setAllowedOrgIds] = useState(new Set());
  const [treeData, setTreeData] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [reportParams, setReportParams] = useState(null);
  const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState("overview");
  const [showReport, setShowReport] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [healthStatusText, setHealthStatusText] = useState("");
  const [healthstatuscode, setHealthStatusCode] = useState("")
const [nearbyStatus, setNearbyStatus] = useState("");
const [catchmentStatus, setcatchmentStatus] = useState("");
const [ictStatus, setictStatus] = useState("");
const [isPrinting, setIsPrinting] = useState(false);


const [parent, setparent] = useState("");
const [encode, setencode] = useState("");


  // const [hasMissingImages, setHasMissingImages] = useState(false);

  const componentNames = {
    overview: "ລວມ",
    wash: "ນໍ້າສະອາດ",
    clinical: "ອຸປະກອນການແພດ",
    medicine: "ອຸປະກອນການຢາ",
    ict: "ອຸປະກອນ ສື່ສານ",
    coondinator: "ຜູ້ປະສານງານ",
  };
  const [eventdate, seteventdate] = useState({
    overview: "",
    wash: "",
    clinical: "",

    medicine: "",
    ict: "",
    coondinator: "",

  });
  const [eventStatuses, setEventStatuses] = useState({
    overview: "",
    wash: "",

    clinical: "",

    medicine: "",
    ict: "",
    coondinator: "",


  });

  const [reasons, setReasons] = useState({
    overview: "",
    wash: "",

    clinical: "",

    medicine: "",
    ict: "",
    coondinator: "",


  });
  const [reason2, setReason2] = useState({
    overview: "",
    wash: "",
  clinical: "",

    medicine: "",
    ict: "",
    coondinator: "",


  });

  const [rowCounts, setRowCounts] = useState({
    overview: 0,
    wash: 0,

    clinical: 0,

    medicine: 0,
    ict: 0,
    coondinator: 0,


  });

  const [showModal, setShowModal] = useState(false);

  const equivmentPrintRef = useRef(null);
  const centerRef = useRef(null);


  // Convert raw org units to tree nodes
  const convertToTreeNodes = (units) => {
    const convert = (nodes = []) =>
      nodes
        .map((u) => {
          const children = u.children ? convert(u.children) : [];
          const isLeaf = children.length === 0;
          const isSelectable = isLeaf && allowedOrgIds.has(u.id);
          if (!isSelectable && children.length === 0) return null;
          const expanded =
            selectedOrg &&
            (children.some((c) => c.expanded) || u.id === selectedOrg.value);

          return {
            label: u.displayName,
            value: u.id,
            children,
            isSelectable,
            checked: selectedOrg?.value === u.id,
            expanded,
            className: isSelectable ? "selectable-node" : "non-selectable-node",
          };
        })
        .filter(Boolean);
    return convert(units);
  };

  // Fetch allowed org units
  const fetchAllowedOrgUnits = async () => {
    try {
      const res = await axios.get(
        "https://hfml.gov.la/hfml/api/programs/orgUnits",
        { auth: API_AUTH, params: { programs: PROGRAM_ID } }
        // { params: { programs: PROGRAM_ID } }

      );
      const ids = res.data?.[PROGRAM_ID] || [];
      setAllowedOrgIds(new Set(ids));
    } catch (err) {
      console.error(err);
      toast.error("❌ ໂຫລດໂຄງຮ່າງການຈັດຕັ້ງບໍ່ສຳເລັດ", {
        style: { fontFamily: "Noto Sans Lao, sans-serif", fontSize: "16px" },
      });
    }
  };

  // Fetch org units
  const fetchOrgUnits = async () => {
    const toastId = toast.loading("ກຳລັງໂຫຼດໂຄງຮ່າງການຈັດຕັ້ງ...", {
      style: { fontFamily: "Noto Sans Lao, sans-serif", fontSize: "16px" },
    });

    try {
      const meRes = await axios.get("https://hfml.gov.la/hfml/api/me.json", {
        auth: API_AUTH,
      });
      const roots = meRes.data?.organisationUnits || [];

      const requests = roots.map((r) =>
        axios.get(
          `https://hfml.gov.la/hfml/api/organisationUnits/${r.id}.json`,
          {
            auth: API_AUTH,
            params: {
              fields:
                "id,displayName,children[id,displayName,children[id,displayName,children[id,displayName]]]",
            },
          }
        )
      );

      const results = await Promise.all(requests);
      const trees = results.map((r) => r.data);
      setRawOrgTree(trees);

      toast.update(toastId, {
        render: "ໂຫຼດໂຄງຮ່າງການຈັດຕັ້ງສຳເລັດ!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        style: { fontFamily: "Noto Sans Lao, sans-serif", fontSize: "16px" },
      });
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: "❌ ໂຫຼດຂໍມູນບໍ່ສຳເລັດ",
        type: "error",
        isLoading: false,
        style: { fontFamily: "Noto Sans Lao, sans-serif", fontSize: "16px" },
      });
    }
  };

  useEffect(() => {
    fetchAllowedOrgUnits();
    fetchOrgUnits();
  }, []);

  useEffect(() => {
    if (!rawOrgTree.length || !allowedOrgIds.size) return;
    setTreeData(convertToTreeNodes(rawOrgTree));
    setLoading(false);
  }, [rawOrgTree, allowedOrgIds, selectedOrg]);

  const handleSelect = (_, selectedNodes) => {
    if (!selectedNodes?.length) return;
    setShowReport(false);
    const node = selectedNodes[0];
    if (!node.isSelectable) {
      toast.warning(
        "ກະລຸນາເລືອກໂຄງຮ່າງການຈັດຕັ້ງຕາມແບບຟອມປ້ອນ",
        { autoClose: 3000, style: { fontFamily: "Noto Sans Lao, sans-serif", fontSize: "16px" } }
      );
      return;
    }
    setSelectedOrg({ value: node.value, label: node.label });
  };

  const handleGenerateReport = () => {
    if (!selectedOrg) return;
    setRowCounts({
      overview: 0,
      clinical: 0,
      medicine: 0,
      ict: 0,
    });
    setReportParams({
      orgUnitId: selectedOrg.value,
      orgUnitLabel: selectedOrg.label,
      year,
    });
    setShowReport(true);
    setActiveTab("overview");
  };

  const handleValidate = () => {
    const newReasons = {};
    const newReason2 = {};
    const newEventStatuses = { ...eventStatuses }; // copy current statuses
  // moveToCenter();
 console.log(`health : ${healthStatusText}`)
 console.log(`code : ${healthstatuscode}`)

    Object.entries(rowCounts).forEach(([key, count]) => {
      let status = eventStatuses[key];
      // Force pass if healthstatuscode is NOT "Functioning" for clinical, medicine, epi
      if (healthstatuscode !== "Functioning" && (key === "clinical" || key === "medicine"|| key === "wash")) {

        newEventStatuses[key] = status; // update status for modal display
        newReasons[key] = "";           // clear reason
        newReason2[key] = "";            // clear second reason
        return; // skip other validations for these keys
      }

      // Default reason
      newReasons[key] = "";
      newReason2[key] = "";

      // Status result messages
      if (status?.toUpperCase() === "COMPLETED" && count === 1) {
        newReason2[key] = "";
      } else {
        newReason2[key] = "ບໍ່ກົດປຸ່ມ ສຳເລັດ";
      }

      // Reason for missing or duplicate events
      if (count < 1) {
        newReasons[key] = "ບໍ່ມີຂໍ້ມູນ";
      }
      if (count > 1) {
        newReasons[key] = "ມີການລາຍງານຊໍ້າຊ້ອນ";
        newReason2[key] = "";

      }
    });

    setReasons(newReasons);
    setReason2(newReason2);
    setEventStatuses(newEventStatuses); // update statuses for modal
    setShowModal(true);
  };






const allSectorsPass = () => {
  return Object.entries(rowCounts).every(([key, count]) => {
    const status = eventStatuses[key];
    if (healthstatuscode !== "Functioning" && (key === "clinical" || key === "medicine"|| key === "wash")) {
      return true;
    }
    // return true;

    return count === 1 && status?.toUpperCase() === "COMPLETED" && nearbyStatus?.toLowerCase() === "pass"&& catchmentStatus?.toLowerCase() === "pass"&& ictStatus?.toLowerCase() === "pass";
  });
};


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so add 1)
    const year = date.getFullYear(); // Get the year

    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d)) return "";  // If date is invalid, return empty string
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
  };
const handlePrint = () => {
  setIsPrinting(true);
  setActiveTab("all");

  // wait for DOM to update
  setTimeout(() => {
    window.print();

    // restore UI after print
    setIsPrinting(false);
    setActiveTab("overview");
  }, 300);
};





const showSection = (tab) =>
  isPrinting || activeTab === tab || activeTab === "all";



  return (
    <div style={{ fontFamily: "'Noto Sans Lao', sans-serif" }}>
      <ToastContainer position="top-right" theme="colored" style={{ fontFamily: "'Noto Sans Lao', sans-serif" }} />
      {!loading && (
        <div className="container py-3">
<div className="d-flex gap-3 align-items-end flex-wrap no-print">
            <OrgUnitTree data={treeData} onChange={handleSelect} />
            <div style={{ width: 150 }}>
              <label className="form-label mb-1">ເລືອກໄລຍະເວລາ</label>
              <input
                type="number"
                className="form-control"
                value={year}
                min="2000"
                max={new Date().getFullYear()}
                onChange={(e) => {
                  setYear(e.target.value);
                  setShowReport(false);
                }}
              />
            </div>
            <button className="btn btn-primary" onClick={handleGenerateReport} disabled={ !selectedOrg || showReport}>
              ເອົາລາຍງານ
            </button>
            <button className="btn btn-info"onClick= {handleValidate}disabled={!selectedOrg || !showReport}>
              ກວດສອບຄວາມຖືກຕ້ອງ
            </button>

          </div>

          {/* Tabs */}
          <ul className="nav nav-tabs mt-4">
            {["overview", "wash", "clinical", "medicine", "ict", "coondinator", "catchment", "nearby","ictdetail"].map((tab) => (
              <li className="nav-item" key={tab}>
                <button className={`nav-link ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)}>
                  {tab === "overview"
                    ? "ລວມ"
                    : tab === "wash"
                      ? "ນໍ້າສະອາດ"
                      : tab === "clinical"
                        ? "ອຸປະກອນການແພດພື້ນຖານ"
                        : tab === "medicine"
                          ? "ອຸປະກອນການຢາ"
                          : tab === "coondinator"
                            ? "ຜູ້ປະສານງານ"
                            : tab === "catchment"
                              ? "ບ້ານໃນເຂດປົກຄຸມ"
                                     : tab === "ictdetail"
                              ? "ອຸປະກອນ ICT"
                              : tab === "nearby"
                                ? "ສະຖານທີບໍລິການໃກ້ຄຽງ"
                                : "ອຸປະກອນສື່ສານ"}
                </button>
              </li>
            ))}
          </ul>

          {/* Visible Report */}
<div
  ref={equivmentPrintRef}
  className="report-section print-area"
  style={{
    display: showReport || isGenerating ? "block" : "none",
    padding: 0,
    margin: 0,
  }}
>
  {reportParams && (
    <>
      {/* ===== OVERVIEW ===== */}
          <div style={{ display: showSection("overview") ? "block" : "none" }}>

        {showModal && allSectorsPass() && (
          <Cover
            orgUnitId={reportParams.orgUnitId}
            year={reportParams.year}
          />
        )}

        <Healthstatus
          orgUnitId={reportParams.orgUnitId}
          year={reportParams.year}
          Hstatus={setHealthStatusText}
          setCode={setHealthStatusCode}
        />

        <Overview
          {...reportParams}
          onRowCount={(count) =>
            setRowCounts((prev) => ({ ...prev, overview: count }))
          }
          Eventstatus={(status) =>
            setEventStatuses((prev) => ({ ...prev, overview: status }))
          }
          Eventdate={(date) =>
            seteventdate((prev) => ({ ...prev, overview: date }))
          }
        />
      </div>

      {/* ===== WASH ===== */}
      <div style={{ display: showSection("wash") ? "block" : "none" }}>
        <Wash
          {...reportParams}
          onRowCount={(count) =>
            setRowCounts((prev) => ({ ...prev, wash: count }))
          }
          Eventstatus={(status) =>
            setEventStatuses((prev) => ({ ...prev, wash: status }))
          }
          Eventdate={(date) =>
            seteventdate((prev) => ({ ...prev, wash: date }))
          }
        />
      </div>

      {/* ===== CLINICAL ===== */}
      <div style={{ display: showSection("clinical") ? "block" : "none" }}>
        <ClinicalEquipment
          {...reportParams}
          onRowCount={(count) =>
            setRowCounts((prev) => ({ ...prev, clinical: count }))
          }
          Eventstatus={(status) =>
            setEventStatuses((prev) => ({ ...prev, clinical: status }))
          }
          Eventdate={(date) =>
            seteventdate((prev) => ({ ...prev, clinical: date }))
          }
        />
      </div>

      {/* ===== MEDICINE ===== */}
      <div style={{ display: showSection("medicine") ? "block" : "none" }}>
        <Medicine
          {...reportParams}
          onRowCount={(count) =>
            setRowCounts((prev) => ({ ...prev, medicine: count }))
          }
          Eventstatus={(status) =>
            setEventStatuses((prev) => ({ ...prev, medicine: status }))
          }
          Eventdate={(date) =>
            seteventdate((prev) => ({ ...prev, medicine: date }))
          }
        />
      </div>

      {/* ===== ICT ===== */}
      <div style={{ display: showSection("ict") ? "block" : "none" }}>
        <ICT
          {...reportParams}
          onRowCount={(count) =>
            setRowCounts((prev) => ({ ...prev, ict: count }))
          }
          Eventstatus={(status) =>
            setEventStatuses((prev) => ({ ...prev, ict: status }))
          }
          Eventdate={(date) =>
            seteventdate((prev) => ({ ...prev, ict: date }))
          }
        />
        <Information {...reportParams} />
      </div>


      {/* ===== CATCHMENT ===== */}
      <div style={{ display: showSection("catchment") ? "block" : "none" }}>
        <Catchment_dry
          {...reportParams}
          setOrgParentLabel={setparent}
          setencode={setencode}
        />
        <Catchmentdry orgUnitId={parent} year={year} Encode={encode} />
        <Catchment_rain orgUnitId={parent} year={year} Encode={encode} />
      </div>

      {/* ===== NEARBY ===== */}
      <div style={{ display: showSection("nearby") ? "block" : "none" }}>
        <Nearby {...reportParams} />
      </div>

      {/* ===== COORDINATOR ===== */}
      <div style={{ display: showSection("coondinator") ? "block" : "none" }}>
        <Condinator
          {...reportParams}
          onRowCount={(count) =>
            setRowCounts((prev) => ({ ...prev, coondinator: count }))
          }
          Eventstatus={(status) =>
            setEventStatuses((prev) => ({ ...prev, coondinator: status }))
          }
          Eventdate={(date) =>
            seteventdate((prev) => ({ ...prev, coondinator: date }))
          }
        />
      </div>
        <div style={{ display: showSection("ictdetail") ? "block" : "none" }}>
        <Ictdetail
          {...reportParams}
          onRowCount={(count) =>
            setRowCounts((prev) => ({ ...prev, Ictdetail: count }))
          }
          Eventstatus={(status) =>
            setEventStatuses((prev) => ({ ...prev, Ictdetail: status }))
          }
          Eventdate={(date) =>
            seteventdate((prev) => ({ ...prev, Ictdetail: date }))
          }
        />
      </div>
      {/* ===== SIGN ===== */}
      {showModal && allSectorsPass() && (
        <div className="sign-wrapper page-break">
          <Sign {...reportParams} />
        </div>
      )}
    </>
  )}
</div>

          {/* Validation Modal */}
          {showModal && (
  <>
<div className="modal fade show d-block" tabIndex="-1">
  <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
    <div className="modal-content">
      <div className="modal-header bg-info text-white">
        <h5 className="modal-title">ກວດສອບຂໍ້ມູນທັງໝົດ</h5>
        <button
          className="btn-close btn-close-white"
          onClick={() => setShowModal(false)}
        ></button>
      </div>

      <div
        className="modal-body"
        style={{ maxHeight: "100vh", overflowY: "auto" }}
      >
        <h4 style={{ marginBottom: "20px" }}>
          ການລາຍງານຂໍ້ມູນຂອງ {selectedOrg.label} ໃນປີ {year}
        </h4>


        {healthstatuscode !== "Functioning" && (
          <div className="alert alert-warning" role="alert" >
            <h4 className="alert-heading">ສະຖານະ</h4>
            <p>
              {selectedOrg.label} ({healthStatusText})
            </p>
            <hr />
            <p className="mb-0">
              ກະລຸນາກວດສອບວ່າ ສະຖານະ ຂອງສະຖານທີ່ຂອງທ່ານຖືກຕ້ອງ
            </p>
            <p className="mb-0">
              ເພາະຖ້າບໍ່ໄດ້ມີ ການບໍລິການສາທາລະນະສຸກ ທ່ານບໍ່ຈຳເປັນຕ້ອງປ້ອນ ພາກ ນໍ້າສະອາດ, ອຸປະກອນການແພດ, ອຸປະກອນການຢາ 
            </p>
          </div>
        )}
                <h6>Program: Mapping A - Infrastructure, Equipment, WASH & Focal Point</h6>


        <table className="table table-bordered w-100" >
          <thead className="table-light">
            <tr>
              <th>ຟອມຂໍ້ມູນ</th>
              <th>ວັນທີເກັບກໍາ</th>
              <th>ຈໍານວນການລາຍງານ</th>
              <th>ກົດປຸ່ມສໍາເລັດ</th>
              <th>ສະຖານະ</th>
              <th>ໝາຍເຫດ</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(rowCounts).map(([key, count]) => {
              const status = eventStatuses[key];
              const date = formatDate(eventdate[key]) || "";
              return (
                <tr key={key}>
                  <td>{componentNames[key]}</td>
                  <td>{date}</td>
                  <td>{count}</td>
                  <td>
                    {status?.toUpperCase() === "COMPLETED"
                      ? "✅ ສຳເລັດ"
                      : "❌ ຍັງບໍ່ສຳເລັດ"}
                  </td>
                  <td>
                    {(
                      (healthstatuscode !== "Functioning" &&
                        ["clinical", "medicine", "mch", "epi","wash"].includes(key)) ||
                      (status?.toUpperCase() === "COMPLETED" && count === 1)
                    ) ? (
                      <span className="badge bg-success">✅ ຜ່ານ</span>
                    ) : (
                      <span className="badge bg-danger">❌ ບໍ່ຜ່ານ</span>
                    )}
                  </td>
                  <td>
                    {reasons[key]}
                    {reasons[key] && reason2[key] ? " ແລະ " : ""}
                    {reason2[key]}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
                <ICTvalidate {...reportParams} onStatusChange={setictStatus} />


        <Valtdate_nearby_dry {...reportParams} onStatusChange={setNearbyStatus} />
        <Validate_catchment orgUnitId={parent} year={year} Encode={encode} onStatusChange={setcatchmentStatus} />


        {!allSectorsPass() && (
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">ແຈ້ງເຕືອນ</h4>
            <p>ຍັງບໍ່ສາມາດອະນຸມັດບົດລາຍງານນີ້ໄດ້ ເນື່ອງຈາກສະຖານະຄວາມຄົບຖ້ວນຂອງຂໍ້ມູນຍັງບໍ່ຜ່ານ ກະລຸນາຕື່ມ ຫຼື ແກ້ໄຂຂໍ້ມູນໃຫ້ຄົບຖ້ວນກ່ອນ</p>
          </div>
        )}
<button
  className="btn btn-success no-print"
  onClick={handlePrint}
  disabled={!allSectorsPass()} 
>
ພິມ <PrintIcon/> </button>




      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={isGenerating} >
          ປິດ
        </button>
      </div>
    </div>
  </div>
</div>

              <div className="modal-backdrop fade show"></div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default OrgUnitReport;

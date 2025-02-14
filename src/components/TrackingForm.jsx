"use client";
import React, { useState, useCallback } from "react";
import { Container, Row, Col, Button, Nav, Table, Form } from "react-bootstrap";
import { ArrowLeft, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import "../utils/TrackingForm.css"

const visaDocuments = {
    "(B1/B2) and C1D visa": [
        "Printed copy of the Interview Waiver confirmation",
        "International passport",
        "Passport containing expired visa (if different than the passport used for the current visa application)",
        "DS-160 confirmation page",
        "One (1) 5X5 cm color photograph",
        "For children only: a copy of the parents' valid visa in the same category (if they are not applying together with their parents)"
    ],
    "INTRACOMPANY  (L)": [
        "Printed copy of the Interview Waiver confirmation",
        "International passport",
        "Passport containing expired visa (if different than the passport used for the current visa application)",
        "DS-160 confirmation page",
        "One (1) 5X5 cm color photograph",
        "Copy of I-129S",
        "Copy of valid I-797"
    ],
    "STUDENT ACADEMIC (F)": [
        "Printed copy of the Interview Waiver confirmation",
        "International Passport",
        "Passport containing expired visa (if different than the passport used for the current visa application)",
        "DS-160 confirmation page",
        "Passport Photo",
        "Parent Visa page (if applicable)",
        "Copy of I-20 form (F, M visas)"
    ],
    "EXCHANGE VISITORS": [
        "Printed copy of the Interview Waiver confirmation",
        "International Passport",
        "Passport containing expired visa (if different than the passport used for the current visa application)",
        "DS-160 confirmation page",
        "Passport Photo",
        "Original DS–2019 (for J visas)",
        "For children only: a copy of the parents' valid visa in the same category (if they are not applying together with their parents)"
    ],
    "TEMPORARY WORKER": [
        "Printed copy of the Interview Waiver confirmation",
        "International Passport",
        "Passport containing expired visa (if different than the passport used for the current visa application)",
        "DS-160 confirmation page",
        "Passport Photo",
        "Copy of valid I-797",
        "Copy of principal applicant’s visa, if applying separately"
    ],
    "C1/D VISA": [
        "Printed copy of the Interview Waiver confirmation",
        "International Passport",
        "Passport containing expired visa (if different than the passport used for the current visa application)",
        "DS-160 confirmation page",
        "Passport Photo",
        "Letter from the employer"
    ]
};

const LoadingModal = () => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="loading-spinner"></div>
        <p>Processing your request...</p>
      </div>
    </div>
  );
  
  const ErrorModal = ({ message, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="error-title">Error</h3>
        <p className="error-message">{message}</p>
        <button className="modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );


const TrackingForm = ({ formData}) => {

    console.log("under tracking form")
    const router = useRouter();

    const [visaType, setVisaType] = useState(Object.keys(visaDocuments)[0]);
    const [checkedDocuments, setCheckedDocuments] = useState([]);
    const [dropOffDocument, setDropOffDocument] = useState({
        hasDocument: false,
        comments: "",
    });
    const [additionalComments, setAdditionalComments] = useState("");
    const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
    

    const BASE_URL = "https://app.swglobalstaging.com";

  const POST_KEY = "f11e8d98b515c1d53290f3811bd01e5a2416a9315a8974d69cd939a1fce6b253";
  const CREATE_API_URL = `${BASE_URL}/api/v1/waybill/track/appointments/create`;

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setCheckedDocuments((prev) =>
          checked ? [...prev, value] : prev.filter((doc) => doc !== value)
        );
      };
    
      console.log("checkedDocuments",checkedDocuments)


      const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
    
         // Basic validation
         
  let validationErrors = [];
  if (!visaType) {
    validationErrors.push("Visa Type is required.");
  }
  
  // Validation for Interview Waiver selection
  if (dropOffDocument.hasDocument) {
    if (checkedDocuments.length === 0) {
      validationErrors.push("When Interview Waiver is selected, at least one document must be selected from the checklist.");
    }
  }
  
  // Validation for Additional Document selection
  if (!dropOffDocument.hasDocument) {
    if (!additionalComments.trim()) {
      validationErrors.push("When Additional Document is selected, additional comments are required.");
    }
  }

  if (validationErrors.length > 0) {
    setError(validationErrors.join("\n"));
    setLoading(false);
    return;
  }
    
        try {
          const response = await fetch(CREATE_API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "post-key": POST_KEY
            },
            body: JSON.stringify({
                application: formData.id,
                status: "Dropped-Off At OIS",
                checkList: checkedDocuments,
                user: "Mr. Archie",
                visaType,
                additionalComments: !dropOffDocument.hasDocument ? additionalComments : ""
              })
          });
    
          if (!response.ok) {
            throw new Error(response.status === 400 ? "Bad Request" : "No Results Found");
          }
    
          await response.json();
          alert("Drop off status has been updated successfully.");
          router.push("/dropoff");
          
        } catch (error) {
          setError(error.message);
          setTimeout(() => router.push("/dropoff"), 3000);
        } finally {
          setLoading(false);
        }
      };


    const FormField = ({ label, value, children }) => (
        <div>
            <label
                className="text-muted mb-2"
                style={{ fontSize: "12px", letterSpacing: "0.5px" }}
            >
                {label}
            </label>
            <div
                className="p-3 rounded"
                style={{ backgroundColor: "#f3f7fb", color: "#004B87" }}
            >
                {children || value}
            </div>
        </div>
    );
    function handleOnClose(){
        setError(null);
        router.push("/dropoff");
    }
    return (


        <>

{loading && <LoadingModal />}
      {error && <ErrorModal message={error} onClose={() => handleOnClose()} />}
      
      {!loading && !error && formData && (
        
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
          
          {/* Header */}
          <div className="bg-white border-bottom">
              <Container fluid style={{ padding: "0 40px" }}>
                  <div className="d-flex justify-content-between align-items-center py-3">
                      <div>
                          <span style={{ color: "#ff6b00", fontWeight: "500" }}>
                              Drop-OFF
                          </span>
                          {/* {/* <span className="text-dark mx-2">
                              1234576980 | Dahhaoui Taoufik |
                          </span> 
                        //   <span style={{ color: "#0d6efd" }}>dahtao@email.com</span> */}
                      </div>
                      <Button
                          variant="link"
                          className="text-decoration-none p-0"
                          style={{ color: "#ff6b00" }}
                      >
                          <ArrowLeft size={18} />
                          <span
                              className="ms-1"
                              style={{ fontSize: "14px", fontWeight: "500" }}

                              onClick={()=> router.push("/dropoff")}
                          >
                              BACK
                          </span>
                      </Button>
                  </div>
              </Container>
          </div>

          <Container fluid style={{ padding: "2rem 40px" }}>
              <Row>
                  <Col md={7} className="p-4 bg-white">
                      {/* Form Fields */}
                      <Row className="g-4 mb-4">
                          <Col md={4}>
                              <FormField label="TRACKING NO." value={formData.trackingId} />
                          </Col>
                          <Col md={4}>
                              <FormField label="NAME" value={formData.name} />
                          </Col>
                          <Col md={4}>
                              <FormField label="APPOINTMENT DATE" value={formData.slotDate} />
                          </Col>
                      </Row>

                      <Row className="g-4 mb-4">
                          <Col md={4}>
                              <FormField label="APPOINTMENT TIME" value={formData.slotTime} />
                          </Col>
                          <Col md={4}>
                              <FormField label="PASSPORT NO." value={formData.passportNumber} />
                          </Col>

                          <Col md={4}>
                              <FormField label="VISA TYPE">
                                  <Form.Select
                                      value={visaType}
                                      onChange={(e) => setVisaType(e.target.value)}
                                      style={{
                                          backgroundColor: "#f3f7fb",
                                          color: "#004B87",
                                          border: "none",
                                          width: "100%"
                                      }}
                                  >
                                      {Object.keys(visaDocuments).map((visaType) => (
                                          <option key={visaType} value={visaType}>
                                              {visaType}
                                          </option>
                                      ))}
                                  </Form.Select>
                              </FormField>
                          </Col>
                      </Row>

                      <Row className="g-4 mb-4">
                          <Col md={4}>
                              <label
                                  className="text-muted mb-2"
                                  style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                              >
                                  DROP-OFF DOCUMENT
                              </label>
                              <div
                                  className="p-3 rounded"
                                  style={{ backgroundColor: "#f3f7fb", color: "#004B87" }}
                              >
                                  <Form.Check
                                      type="radio"
                                      id="have-document-yes"
                                      name="hasDocument"
                                      label="Interview Waiver"
                                      checked={dropOffDocument.hasDocument}
                                      onChange={() =>
                                          setDropOffDocument((prev) => ({
                                              ...prev,
                                              hasDocument: true,
                                          }))
                                      }
                                      className="mb-2"
                                  />
                                  <Form.Check
                                      type="radio"
                                      id="have-document-no"
                                      name="hasDocument"
                                      label="Additional Document"
                                      checked={!dropOffDocument.hasDocument}
                                      onChange={() =>
                                          setDropOffDocument((prev) => ({
                                              ...prev,
                                              hasDocument: false,
                                              comments: "", // Clear comments when no document
                                          }))
                                      }
                                  />
                              </div>
                          </Col>
                          {/* {!dropOffDocument.hasDocument && */}
                              <Col md={4}>
                                  <label
                                      className="text-muted mb-2"
                                      style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                                  >
                                      ADDITIONAL COMMENTS
                                  </label>
                                  <Form.Control
                                      as="textarea"
                                      rows={3}
                                      name="additionalComments"
                                      placeholder="Enter additional comments"
                                      value={additionalComments}
                                      onChange={(e) => setAdditionalComments(e.target.value)}
                                      className="rounded"
                                      style={{
                                          backgroundColor: "#f3f7fb",
                                          color: "#004B87",
                                          resize: "none",
                                      }}
                                  />
                              </Col>
                      </Row>

                      <div className="text-end">
                          <Button
                          onClick={handleSubmit}
                              className="px-4 py-2 border-0"
                              style={{
                                  backgroundColor: "#8BC34A",
                                  color: "white",
                                  borderRadius: 0,
                              }}
                          >
                              SUBMIT
                          </Button>
                      </div>

                      <hr className="mt-5 border-2 border-blue-900 bg-primary" />

                     {/* Document checklist with simplified checkboxes */}
                     {dropOffDocument.hasDocument && (
                          <div className="mt-5">
                              <div className="text-muted mb-2" style={{ fontSize: "12px", letterSpacing: "0.5px" }}>
                                  DOCUMENT CHECKLIST
                              </div>
                              <div style={{ color: "#004B87", fontWeight: "500", fontSize: "15px", marginBottom: "24px" }}>
                                  {visaType}
                              </div>
                              <div>
                                  {visaDocuments[visaType]?.map((doc, index) => (
                                      <label key={index}>
                                      <input type="checkbox" value={doc} onChange={handleCheckboxChange} /> {doc}
                                    </label>
                                  ))}
                              </div>
                          </div>
                      )}
                  </Col>

                  <Col md={5}>
                      {/* Right Side Panel */}
                      <div className="bg-white rounded shadow-sm">
                          {/* Tabs */}
                          <div className="border-bottom px-4">
                              <div className="d-flex" style={{ gap: "32px" }}>
                                  <div
                                      className="py-3 position-relative"
                                      style={{
                                          color: "#004B87",
                                          fontWeight: "600",
                                          borderBottom: "3px solid #004B87",
                                      }}
                                  >
                                      EVENT/TRACKING
                                  </div>
                                  <div className="py-3 text-muted">PRINT</div>
                                  {/* <div className="py-3 text-muted">ATTACHED DOCUMENT</div> */}
                              </div>
                          </div>

                          {/* Event List */}
                          <div className="p-4">
                              <Table hover className="align-middle mb-0">
                                  <tbody>
                                      <tr
                                          style={{
                                              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                              backgroundColor: "white",
                                          }}
                                      >
                                          <td className="py-3">
                                              <span style={{ color: "#0d6efd" }}>{formData.status}</span>
                                          </td>
                                          <td className="py-3 text-muted">
                                              {formData.officer}
                                          </td>
                                          <td className="py-3 text-muted">{formData.slotDate }, {formData.slotTime}</td>
                                      </tr>
                                  </tbody>
                              </Table>

                              <div className="mt-5">
                                  <div style={{ color: "#ff6b00", fontWeight: "500" }}>
                                      NOTE
                                  </div>
                                  <p
                                      className="text-muted mt-2 mb-0"
                                      style={{ fontSize: "14px" }}
                                  >
                                      Sed ut perspiciatis unde omnis iste natus error sit
                                      voluptatem accusantium doloremque laudantium, totam rem
                                      aperiam, eaque ipsa quae ab illo inventore veritatis et
                                      quasi architecto beatae vitae dicta sunt explicabo.
                                  </p>
                              </div>
                          </div>
                      </div>
                  </Col>
              </Row>
          </Container>

          <style jsx>{`
      .table tr {
        margin-bottom: 8px;
      }
      .table tbody tr:hover {
        background-color: #f8f9fa;
      }
      .table th {
        font-weight: 500;
        color: #6c757d;
        font-size: 14px;
      }
      .table td {
        font-size: 14px;
        border-bottom: none;
      }
      .checkbox-hover:hover {
        background-color: rgba(0, 0, 0, 0.02);
      }
    `}</style>
      </div>
)}
        
        </>
     
    );
};

export default TrackingForm;

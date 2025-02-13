"use client";
import React, { useState, useCallback } from "react";
import { Container, Row, Col, Button, Nav, Table, Form } from "react-bootstrap";
import { ArrowLeft, Upload } from "lucide-react";

const DocumentDetails = () => {
  const [activeTab, setActiveTab] = useState("EVENT/TRACKING");
  const [checkedItems, setCheckedItems] = useState({
    interviewWaiver: true,
    passport: true,
    expiredVisa: false,
    ds160: false,
    photograph: false,
    parentsVisa: false,
  });

  // New state for drop-off document
  const [dropOffDocument, setDropOffDocument] = useState({
    hasDocument: false,
    comments: "",
  });

  const [additionalComments, setAdditionalComments] = useState("");

  const handleCheckboxClick = useCallback(
    (key) => (e) => {
      e.preventDefault();
      e.stopPropagation();
      setCheckedItems((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    },
    []
  );

  const handleDropOffDocumentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDropOffDocument((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const CheckIcon = ({ checked, onClick }) => (
    <div
      onClick={onClick}
      style={{ cursor: "pointer" }}
      className="rounded-circle"
      role="button"
      tabIndex={0}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        {checked ? (
          <>
            <circle cx="10" cy="10" r="9.5" fill="#DFF0D8" stroke="#5CB85C" />
            <path
              d="M6 10L8.5 12.5L14 7.5"
              stroke="#5CB85C"
              strokeWidth="1.5"
            />
          </>
        ) : (
          <circle cx="10" cy="10" r="9.5" fill="white" stroke="#DEE2E6" />
        )}
      </svg>
    </div>
  );

  const ChecklistItem = ({ id, checked, label, subLabel = null }) => (
    <div
      className="d-flex mb-3 align-items-start"
      style={{ cursor: "pointer" }}
      onClick={handleCheckboxClick(id)}
      role="button"
      tabIndex={0}
    >
      <div className="me-3 mt-1">
        <CheckIcon checked={checked} onClick={handleCheckboxClick(id)} />
      </div>
      <div>
        <div style={{ color: "#004B87" }}>{label}</div>
        {subLabel && (
          <div
            style={{
              color: "#6c757d",
              fontSize: "13px",
              fontStyle: "italic",
            }}
          >
            {subLabel}
          </div>
        )}
      </div>
    </div>
  );

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

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header */}
      <div className="bg-white border-bottom">
        <Container fluid style={{ padding: "0 40px" }}>
          <div className="d-flex justify-content-between align-items-center py-3">
            <div>
              <span style={{ color: "#ff6b00", fontWeight: "500" }}>
                PICK-UP
              </span>
              <span className="text-dark mx-2">
                1234576980 | Dahhaoui Taoufik |
              </span>
              <span style={{ color: "#0d6efd" }}>dahtao@email.com</span>
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
                <FormField label="TRACKING NO." value="DUBK4068" />
              </Col>
              <Col md={4}>
                <FormField label="SURNAME" value="Dahhaoui" />
              </Col>
              <Col md={4}>
                <FormField label="OTHER NAMES" value="Taoufik" />
              </Col>
            </Row>

            <Row className="g-4 mb-4">
              <Col md={4}>
                <FormField label="PASSPORT NO." value="NF7315730" />
              </Col>
              <Col md={4}>
                <FormField label="PASSPORT EXPIRY" value="AUG. 2 2029" />
              </Col>
              <Col md={4}>
                <FormField label="NATIONALITY">
                  <div className="d-flex align-items-center">
                    <img
                      src="/api/placeholder/24/16"
                      alt="US Flag"
                      className="me-2"
                    />
                    United States
                  </div>
                </FormField>
              </Col>
            </Row>

            <Row className="g-4 mb-4">
              <Col md={4}>
                <FormField label="VISA TYPE" value="B1/B2 & CID" />
              </Col>
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

                  {/* {dropOffDocument.hasDocument && (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="comments"
                      placeholder="Enter document comments"
                      value={dropOffDocument.comments}
                      onChange={handleDropOffDocumentChange}
                      className="mt-3"
                      style={{ backgroundColor: "white" }}
                    />
                  )} */}
                </div>
              </Col>
              { dropOffDocument.hasDocument && 
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
              </Col> }
            </Row>

            <div className="text-end">
              <Button
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

            {/* Document Checklist */}
            <div className="mt-5">
              <div
                className="text-muted mb-2"
                style={{ fontSize: "12px", letterSpacing: "0.5px" }}
              >
                DOCUMENT CHECKLIST
              </div>
              <div
                style={{
                  color: "#004B87",
                  fontWeight: "500",
                  fontSize: "15px",
                  marginBottom: "24px",
                }}
              >
                Business/Tourist (B1/B2) And C1D Visa
              </div>

              <div className="ms-1 d-flex">
                <div className="me-5">
                  <ChecklistItem
                    id="interviewWaiver"
                    checked={checkedItems.interviewWaiver}
                    label="Printed copy of the interview waiver confirmation"
                  />

                  <ChecklistItem
                    id="passport"
                    checked={checkedItems.passport}
                    label="International passport"
                  />

                  <ChecklistItem
                    id="expiredVisa"
                    checked={checkedItems.expiredVisa}
                    label="Passport containing expired visa"
                    subLabel="(If different than the passport used for the current visa application)"
                  />

                  <ChecklistItem
                    id="ds160"
                    checked={checkedItems.ds160}
                    label="DS-160 confirmation page"
                  />
                </div>

                <div>
                  <ChecklistItem
                    id="photograph"
                    checked={checkedItems.photograph}
                    label="One (1) 5X5 cm color photograph"
                  />

                  <ChecklistItem
                    id="parentsVisa"
                    checked={checkedItems.parentsVisa}
                    label="For children only: a copy of the parents' valid in the same category"
                    subLabel="(If they are not applying together with their parents)"
                  />
                </div>
              </div>
            </div>
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
                  <div className="py-3 text-muted">ATTACHED DOCUMENT</div>
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
                        <span style={{ color: "#0d6efd" }}>
                          Appointment Booked
                        </span>
                      </td>
                      <td className="py-3 text-muted">
                        DHL Officer Mr. Archie
                      </td>
                      <td className="py-3 text-muted">2024/12/20 - 15:15PM</td>
                    </tr>
                    <tr
                      style={{
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        backgroundColor: "white",
                      }}
                    >
                      <td className="py-3">
                        <span style={{ color: "#0d6efd" }}>Dropped-Off</span>
                      </td>
                      <td className="py-3 text-muted">
                        DHL Officer Mr. Archie
                      </td>
                      <td className="py-3 text-muted">2024/12/20 - 15:15PM</td>
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
  );
};

export default DocumentDetails;

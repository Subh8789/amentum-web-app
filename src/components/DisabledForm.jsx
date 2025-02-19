"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Nav, Table } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";





const DisabledForm = ({ formData, loading, error }) => {
    const [activeTab, setActiveTab] = useState("EVENT/TRACKING");



    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setCheckedDocuments((prev) =>
            checked ? [...prev, value] : prev.filter((doc) => doc !== value)
        );
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

    const AttachedDocumentItem = ({ title }) => (
        <div className="mb-3">
            <p
                className="text-decoration-none"
                style={{ color: "#0d6efd", fontSize: "14px" }}
            >
                {title}
            </p>
        </div>
    );

    const router = useRouter();


    return (
        <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            {/* Header */}
            <div className="bg-white border-bottom">
                <Container fluid style={{ padding: "0 40px" }}>
                    <div className="d-flex justify-content-between align-items-center py-3">
                        <div>
                            <span style={{ color: "#ff6b00", fontWeight: "500" }}>
                                DROP-OFF
                            </span>
                            {/* <span className="text-dark mx-2">1234576980 | Jones David |</span>
                            <span style={{ color: "#0d6efd" }}>davidjones@email.com</span> */}
                        </div>

                        <div className="me-4">
                            <span className="text-muted me-2">Status:</span>
                            {formData && <span style={{ color: "#004B87", fontWeight: "500" }}>
                                {formData.status}
                            </span>}
                        </div>
                        <div className="d-flex align-items-center">
                            <Button
                                variant="link"
                                className="text-decoration-none p-0"
                                style={{ color: "#ff6b00" }}
                            >
                                <ArrowLeft size={18} />
                                <span
                                    className="ms-1"
                                    style={{ fontSize: "14px", fontWeight: "500" }}
                                    onClick={() => router.push("/dropoff")}
                                >
                                    BACK
                                </span>
                            </Button>
                        </div>
                    </div>
                </Container>
            </div>

            {!loading && !error && formData && (
                <Container fluid style={{ padding: "2rem 40px" }}>
                    <Row>
                        <Col md={7} className="p-4 bg-white">
                            {/* Form Fields */}
                            <Row className="g-4 mb-4">
                                <Col md={4}>
                                    <FormField label="TRACKING NO." value={formData.trackingId} />
                                </Col>
                                <Col md={4}>
                                    <FormField label="FIRSTNAME" value={formData.firstName} />
                                </Col>
                                <Col md={4}>
                                    <FormField label="SUR NAME" value={formData.surname} />
                                </Col>
                            </Row>

                            <Row className="g-4 mb-4">
                                <Col md={4}>
                                    <FormField label="PASSPORT NO." value={formData.passportNumber} />
                                </Col>
                                {/* <Col md={4}>
                                <FormField label="PASSPORT EXPIRY" value = {formData.passportExpiry} />
                            </Col> */}
                                <Col md={4}>
                                    <FormField
                                        label="APPOINTMENT DATE"
                                        value={formData.collectionDate}
                                    />
                                </Col>
                                <Col md={4}>
                                    <FormField label="VISA TYPE" value={formData.visaType} />
                                </Col>
                            </Row>


                            {/* Attached Documents Section */}
                            <div className="mt-5">
                                <div
                                    className="text-muted mb-4"
                                    style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                                >
                                    ATTACHED DOCUMENT
                                </div>

                                <div className="ms-1">

                                    {formData.documents?.map((doc, index) => (
                                        <AttachedDocumentItem title={doc} key={index} />
                                    ))}
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
                                        {/* <div className="py-3 text-muted">MANAGE PICK-UP</div> */}
                                    </div>
                                </div>

                                {/* Event List */}
                                <div className="p-4">
                                    <Table hover className="align-middle mb-0">
                                        <tbody>
                                            {formData?.logs.map((log, index) => (
                                                <tr
                                                    key={index}
                                                    style={{
                                                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                                        backgroundColor: "white",
                                                    }}
                                                >
                                                    <td className="py-3">
                                                        <span style={{ color: "#0d6efd" }}>{log.status}</span>
                                                    </td>
                                                    <td className="py-3 text-muted">{log.user}</td>
                                                    <td className="py-3 text-muted">{log.date}</td>
                                                </tr>
                                            ))}
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
            )}
            <style jsx>{`
        .table tr {
          margin-bottom: 8px;
        }
        .table tbody tr:hover {
          background-color: #f8f9fa;
        }
        .table td {
          font-size: 14px;
          border-bottom: none;
        }
      `}</style>
        </div>
    );
};

export default DisabledForm;

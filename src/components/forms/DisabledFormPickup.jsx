"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Nav, Table, Form } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

import "../../utils/TrackingForm.css";
import Link from "next/link";


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

const DisabledFormPickup = ({ formData }) => {
    const [selectedTab, setSelectedTab] = useState('EVENT/TRACKING');

    const [collectionOption, setCollectionOption] = useState({
        hasCollectionOption: false,
        comments: "",
    });
    const [showPickupForm, setShowPickupForm] = useState(false);
    const [additionalComments, setAdditionalComments] = useState("");
    const [representativeName, setRepresentativeName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const BASE_URL = "https://app.swglobalstaging.com";

    const POST_KEY = "f11e8d98b515c1d53290f3811bd01e5a2416a9315a8974d69cd939a1fce6b253";
    const CREATE_API_URL = `${BASE_URL}/api/v1/waybill/track/appointments/create`;


    const activeStyle = {
        color: "#004B87",
        fontWeight: "600",
        borderBottom: "3px solid #004B87"
    };

    const handleTabClick = (tabName) => {
        setSelectedTab(tabName);
        setShowPickupForm(tabName === 'MANAGE PICK-UP');
        if (tabName === 'EVENT/TRACKING') {
            setShowPickupForm(false);
            // Reset form states when switching back to tracking
            setCollectionOption({ hasCollectionOption: true, comments: "" });
            setAdditionalComments("");
            setRepresentativeName("");
        }
    };
    const validateForm = () => {
        const errors = [];

        if (!collectionOption.hasCollectionOption) { // If Proxy Pick-up is selected
            if (!representativeName.trim()) {
                errors.push("Representative name is required for proxy pick-up.");
            }
            if (!additionalComments.trim()) {
                errors.push("Notes are required for proxy pick-up.");
            }
        }

        return errors;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const validationErrors = validateForm();
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
                    user: "Mr. Archie",
                    additionalComments: !collectionOption.hasCollectionOption ? additionalComments : "",
                    representativeName: !collectionOption.hasCollectionOption ? representativeName : "",
                })
            });

            if (!response.ok) {
                throw new Error(response.status === 400 ? "Bad Request" : "No Results Found");
            }

            await response.json();
            alert("Pick up status has been updated successfully.");
            router.push("/pick-up");

        } catch (error) {
            setError(error.message);
            setTimeout(() => router.push("/pick-up"), 3000);
        } finally {
            setLoading(false);
        }
    };


    const searchParams = useSearchParams();
    const trackingCode = searchParams.get("trackingCode");


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
    function handleOnClose() {
        setError(null);
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
                                        PICK-UP
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
                                            onClick={() => router.push("/pick-up")}
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

                                    {showPickupForm && formData.status === "Ready for Pick-Up" && (
                                        <>
                                            <Row className="g-4 mb-4">
                                                <Col md={4}>
                                                    <label
                                                        className="text-muted mb-2"
                                                        style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                                                    >
                                                        Collection Option
                                                    </label>
                                                    <div
                                                        className="p-3 rounded"
                                                        style={{ backgroundColor: "#f3f7fb", color: "#004B87" }}
                                                    >

                                                        <Form.Check
                                                            type="radio"
                                                            id="have-document-no"
                                                            name="hasCollectionOption"
                                                            label="In-Person"
                                                            checked={collectionOption.hasCollectionOption}
                                                            onChange={() =>
                                                                setCollectionOption((prev) => ({
                                                                    ...prev,
                                                                    hasCollectionOption: true,
                                                                    comments: "", // Clear comments when no document
                                                                }))
                                                            }
                                                        />
                                                        <Form.Check
                                                            type="radio"
                                                            id="have-document-yes"
                                                            name="hasCollectionOption"
                                                            label="Proxy Pick-up"
                                                            checked={!collectionOption.hasCollectionOption}
                                                            onChange={() =>
                                                                setCollectionOption((prev) => ({
                                                                    ...prev,
                                                                    hasCollectionOption: false,
                                                                }))
                                                            }
                                                            className="mb-2"
                                                        />
                                                    </div>
                                                </Col>

                                                {!collectionOption.hasCollectionOption &&
                                                    <Col md={4}>
                                                        <label
                                                            className="text-muted mb-2"
                                                            style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                                                        >
                                                            REPRESENTATIVE NAME
                                                        </label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={3}
                                                            name="representativeName"
                                                            placeholder="Enter proxy person name"
                                                            value={additionalComments}
                                                            onChange={(e) => setRepresentativeName(e.target.value)}
                                                            className="rounded"
                                                            style={{
                                                                backgroundColor: "#f3f7fb",
                                                                color: "#004B87",
                                                                resize: "none",
                                                            }}
                                                            required
                                                        />
                                                    </Col>
                                                }
                                                {/* {!collectionOption.hasCollectionOption && */}
                                                <Col md={4}>
                                                    <label
                                                        className="text-muted mb-2"
                                                        style={{ fontSize: "12px", letterSpacing: "0.5px" }}
                                                    >
                                                        Notes*
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
                                                        required
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
                                        </>
                                    )}
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
                                                    className="py-3 position-relative cursor-pointer"
                                                    style={selectedTab === 'EVENT/TRACKING' ? activeStyle : {}}
                                                    onClick={() => handleTabClick('EVENT/TRACKING')}
                                                >
                                                    EVENT/TRACKING
                                                </div>
                                                <div
                                                    className="py-3 cursor-pointer"
                                                    style={selectedTab === 'PRINT' ? activeStyle : { color: '#6c757d' }}
                                                    onClick={() => handleTabClick('PRINT')}

                                                >
                                                    <Link
                                                        href={formData.collectionReceipt}
                                                        target="_blank"
                                                        style={ {textDecoration: "none"} }
                                                        onClick={() => handleTabClick('PRINT')}
                                                        rel="noopener noreferrer"
                                                    >
                                                        PRINT
                                                    </Link>
                                                </div>
                                                <div
                                                    className="py-3 cursor-pointer"
                                                    style={selectedTab === 'MANAGE PICK-UP' && formData.status === "Ready for Pick-Up" ? activeStyle : {}}
                                                    onClick={() => handleTabClick('MANAGE PICK-UP')}
                                                >
                                                    MANAGE PICK-UP
                                                </div>
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
            )}

        </>

    );
};

export default DisabledFormPickup;

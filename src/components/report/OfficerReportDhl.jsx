"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
    Table,
    Button,
    Container,
    Pagination,
    Dropdown
} from "react-bootstrap";
import { Download } from "lucide-react";
import { useRouter } from "next/navigation";

import "./filter.css";

import useReportDownloader from "@/customHooks/useReportDownloader";

const OfficerReportDhl = ({ dropoffData = [], loading, error }) => {
    console.log("dropoffData", dropoffData);

    const [currentPage, setCurrentPage] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");

    const router = useRouter();

    const recordsPerPage = 10;

    useEffect(() => {
        if (dropoffData.length > 0) {
            setFilteredData(dropoffData);
        }
    }, [dropoffData]);

    const totalPages = Math.ceil(filteredData.length / recordsPerPage);

    const filterData = () => {
        if (!startDate || !endDate) {
            setFilteredData(dropoffData);
            return;
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const filtered = dropoffData.filter(row => {
            if (!row.collectionDate) return false;
            const collectionDate = new Date(row.collectionDate);
            return collectionDate >= start && collectionDate <= end;
        });

        setFilteredData(filtered);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setStartDate("");
        setEndDate("");
        setSelectedUser("");
        setFilteredData(dropoffData);
        setCurrentPage(1);
    };

    const type ="drop";
    const service="dhl";
    const user = selectedUser || '';


    const { downloadReport, isLoading } = useReportDownloader(startDate, endDate, type, service, user );
  
    const handleDownloadReport = async () => {
      const success = await downloadReport({
        startDate,
        endDate,
        type,
        service,
        user
      });
      if (success) {
        resetFilters(); // Your reset function
      }
    
    }

    const currentRecords = useMemo(() => {
        if (!filteredData || filteredData.length === 0) return [];
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        return filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
    }, [currentPage, filteredData]);

    return (
        <Container fluid style={{ padding: "0 40px", marginBottom: "20rem" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 style={{ color: "#004B87", fontSize: "1.5rem", fontWeight: "bold" }}>
                    OFFICER-REPORT-DHL
                </h2>
                <div className="d-flex gap-2">
                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="light"
                            className="d-flex align-items-center gap-2 mt-2"
                            style={{ padding: "8px 12px" }}

                        >
                            Report
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='drop-menu'>
                            <Dropdown.Item className="fw-semibold text-primary" onClick={() => router.push("/dropoff/dropoff-report")}>
                                DROPOFF/ COLLECTION REPORT
                            </Dropdown.Item>
                            <Dropdown.Item className="fw-semibold text-primary" onClick={() => router.push("/dropoff/officerReport-ois")}>
                                OFFICER REPORT OIS
                            </Dropdown.Item>
                            <Dropdown.Item className="fw-semibold text-primary" onClick={() => router.push("/dropoff/officerReport-Dhl")}>
                                OFFICER REPORT DHL
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>


                <div className="filters-container">
                    <div className="date-field">
                        <span className="date-label">Select Officer</span>
                        <select
                            className="dropdownfilter"
                            value={selectedUser}
                            onChange={(e) => setSelectedUser(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="JohnDoe">John Doe</option>
                            <option value="JaneSmith">Jane Smith</option>
                            <option value="MikeJohnson">Mike Johnson</option>
                            <option value="EmilyDavis">Emily Davis</option>
                        </select>
                    </div>
                    <div className="date-field">
                        <span className="date-label">Start Date</span>
                        <div className="date-input-wrapper">
                            <input
                                type="date"
                                className="date-input"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <span className="calendar-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </span>
                        </div>
                    </div>

                    <div className="date-field">
                        <span className="date-label">End Date</span>
                        <div className="date-input-wrapper">
                            <input
                                type="date"
                                className="date-input"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                            <span className="calendar-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                            </span>
                        </div>
                    </div>

                    <button
                        className="filter-button"
                        onClick={filterData}
                        disabled={!startDate || !endDate}
                    >
                        Apply Date Filter
                    </button>
                </div>
            </div>

            <hr />

            <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                    <thead>
                        <tr className="bg-light">
                            <th className="border-0 py-3">Passport #</th>
                            <th className="border-0 py-3">Center</th>
                            <th className="border-0 py-3">Visa Type</th>
                            <th className="border-0 py-3">Surname</th>
                            <th className="border-0 py-3">Given Name</th>
                            <th className="border-0 py-3">Phone Number</th>
                            <th className="border-0 py-3">Collection Date</th>
                            <th className="border-0 py-3">Officer</th>
                            <th className="border-0 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.length > 0 ? (
                            currentRecords.map((row, index) => (
                                <tr key={index} style={{ backgroundColor: index === 2 ? "#f0f9ff" : "white" }}>
                                    <td className="text-primary">{row.passportNumber}</td>
                                    <td>{row.center}</td>
                                    <td>{row.visaType}</td>
                                    <td>{row.surname}</td>
                                    <td>{row.firstName}</td>
                                    <td>{row.phoneNumber}</td>
                                    <td>{row.collectionDate}</td>
                                    <td>{row.officer}</td>
                                    <td>{row.status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-4">
                                    No records found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Footer */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <Button variant="light" className="d-flex align-items-center gap-2" onClick={handleDownloadReport}>
                    <Download size={16} className="text-success" />
                    <span className="text-success">Export/Download</span>
                </Button>

                <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} />
                    <Pagination.Prev
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    />
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
                        let pageNum = currentPage;
                        if (currentPage <= 3) {
                            pageNum = idx + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - (4 - idx);
                        } else {
                            pageNum = currentPage - 2 + idx;
                        }

                        return (
                            <Pagination.Item
                                key={idx}
                                active={currentPage === pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={currentPage === pageNum ? "bg-success border-success" : ""}
                            >
                                {pageNum}
                            </Pagination.Item>
                        );
                    })}
                    <Pagination.Next
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
                </Pagination>
            </div>

            <style jsx global>{`
        .drop-menu {
          background: #003C71;
          margin-left: 50px;
        }
        .drop-menu a {
          color: white !important;
        }
        .drop-menu a:hover {
          background-color: #05154f;
        }
        .table th {
          font-weight: 600;
          color: #003C71;
        }
        .table td {
          border-bottom: none;
        }
        .dropdown-toggle::after {
          display: none;
        }
        .form-check-input:checked {
          background-color: #28a745;
          border-color: #28a745;
        }
        .table tbody tr {
          border-bottom: 8px solid #f8f9fa;
        }
        .pagination .page-link {
          border-radius: 4px;
          margin: 0 2px;
          padding: 8px 12px;
        }
        .pagination .active .page-link {
          background-color: #28a745;
          border-color: #28a745;
          z-index: 0;
        }
        .disabled-row {
          pointer-events: none;
        }
        .disabled-row a {
          pointer-events: auto;
        }
      `}</style>
        </Container>
    );
};

export default OfficerReportDhl;

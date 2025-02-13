"use client";
import Link from 'next/link';
import React, { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import {
  Table,
  Form,
  Button,
  Container,
  Nav,
  Navbar,
  Pagination,
  Dropdown,
  InputGroup,
} from "react-bootstrap";
import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
  Download,
} from "lucide-react";

const StatusIcon = ({ status }) => {
  const getStatusStyle = () => {
    switch (status) {
      case "dhl":
        return { backgroundColor: "#FFD700" };
      case "flag":
        return { backgroundColor: "#28a745" };
      case "globe":
        return { backgroundColor: "#007bff" };
      default:
        return { backgroundColor: "#FFD700" };
    }
  };

  return (
    <span
      className="badge d-flex align-items-center gap-1"
      style={{
        backgroundColor: "#f8f9fa",
        color: "#333",
        padding: "6px 12px",
        borderRadius: "20px",
      }}
    >
      <span
        style={{
          ...getStatusStyle(),
          display: "inline-block",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
        }}
      ></span>
      {status}
    </span>
  );
};

const DropOffTable = ({ dropoffData, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const router = useRouter();

  const recordsPerPage = 10;
  const totalPages = Math.ceil(dropoffData.length / recordsPerPage);

  // Get current records
  const currentRecords = useMemo(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return dropoffData.slice(indexOfFirstRecord, indexOfLastRecord);
  }, [currentPage, dropoffData]);

  // Check if any selected row has status "Dropped-Off Sent To Embassy"
  const isAnySelectedRowSentToEmbassy = useMemo(() => {
    return selectedRows.some(id => {
      const record = dropoffData.find(row => row.id === id);
      return record && record.status === "Dropped-Off Sent To Embassy";
    });
  }, [selectedRows, dropoffData]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(currentRecords.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const BASE_URL = "https://app.swglobalstaging.com";
  const POST_KEY = "f11e8d98b515c1d53290f3811bd01e5a2416a9315a8974d69cd939a1fce6b253"
  const UPDATE_API_URL = `${BASE_URL}/api/v1/waybill/track/appointments/update`;

  const sendToEmbassy = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one application.");
      return;
    }

    if (isAnySelectedRowSentToEmbassy) {
      alert("Cannot send applications that are already sent to embassy.");
      return;
    }

    try {
      const response = await fetch(UPDATE_API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "post-key": POST_KEY
        },
        body: JSON.stringify({
          applications: selectedRows,
          status: "Dropped-Off Sent To Embassy"
        })
      });
      const result = await response.json();
      if (result.responseCode === 200 && result.success) {
        alert("Applications sent to embassy successfully.");
        setSelectedRows([]);
        router.push("/dropoff")
      } else {
        alert("Failed to update applications.");
      }
    } catch (error) {
      console.error("Error updating applications:", error);
      alert("An error occurred while updating applications.");
    }
  };

  const handleDetails = (passportNo) => {
    router.push(`/applicationdetails?trackingCode=${passportNo}`);
  }

  return (
    <Container fluid style={{ "padding": "0 40px", "marginBottom": "20rem" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: "#004B87", fontSize: "1.5rem", fontWeight: "bold" }}>
          Drop-Off
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
                    <Dropdown.Item
                        className="fw-semibold text-primary"               
                      >
                        DROPOFF/ COLLECTION REPORT
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="fw-semibold text-primary"               
                      >
                       OFFICER REPORT OIS
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="fw-semibold text-primary"               
                      >
                       OFFICER REPORT DHL
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
        </div>
        <div className="d-flex gap-2">
          <Dropdown align="end">
            <Dropdown.Toggle
              variant="light"
              className="d-flex align-items-center gap-2 border"
              style={{ padding: "8px 12px" }}
            >
              Action
              <MoreVertical size={16} />
            </Dropdown.Toggle>
            <Dropdown.Menu className='drop-menu'>
              <Dropdown.Item
                className={`fw-semibold ${isAnySelectedRowSentToEmbassy ? 'text-muted' : 'text-primary'}`}
                onClick={sendToEmbassy}
                disabled={isAnySelectedRowSentToEmbassy}
                style={{ opacity: isAnySelectedRowSentToEmbassy ? '0.6' : '1' }}
              >
                SEND TO EMBASSY
              </Dropdown.Item>
              <Dropdown.Item
                className="fw-semibold text-primary"
                onClick={()=>router.push("/dhlUpload")}
              >
                DHL REPORTS
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <hr />
      {/* Table */}
      <div className="table-responsive">
        <Table hover className="align-middle mb-0">
          <thead>
            <tr className="bg-light">
              <th className="border-0 py-3">
                <Form.Check
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedRows.length === currentRecords.length}
                />
              </th>
              <th className="border-0 py-3">Passport #</th>
              <th className="border-0 py-3">Center</th>
              <th className="border-0 py-3">Visa Type</th>
              <th className="border-0 py-3">Surname</th>
              <th className="border-0 py-3">Given Name</th>
              <th className="border-0 py-3">Phone Number</th>
              <th className="border-0 py-3">Collection Date</th>
              <th className="border-0 py-3">Officer</th>
              <th className="border-0 py-3">Status</th>
              <th className="border-0 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {currentRecords.map((row, index) => (
              <tr
                key={index}
                className={`${selectedRows.includes(row.id) ? "bg-light" : ""}`}
                style={{
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                  backgroundColor: index === 2 ? "#f0f9ff" : "white",
                }}
              >
                <td className="py-3">
                  <Form.Check
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                  />
                </td>
                <td>
                  <Link href={`/applicationdetails?trackingCode=${row.passportNumber}`} className="text-primary text-decoration-none">{row.passportNumber}</Link>
                </td>
                <td>{row.center}</td>
                <td>{row.visaType}</td>
                <td>{row.surname}</td>
                <td>{row.firstName}</td>
                <td>{row.phoneNumber}</td>
                <td>{row.collectionDate}</td>
                <td>{row.officer}</td>
                <td>
                  <StatusIcon status={row.status} />
                </td>
                <td>
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="light"
                      size="sm"
                      className="border-0"
                    >
                      <MoreVertical size={16} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='drop-menu'>
                      <Dropdown.Item
                        className="fw-semibold text-primary"
                        onClick={() => handleDetails(row.passportNumber)}
                      >
                        VIEW DETAILS
                      </Dropdown.Item>
                      <Dropdown.Item
                        className={`fw-semibold ${row.status === "Dropped-Off Sent To Embassy" ? 'text-muted' : 'text-primary'}`}
                        onClick={sendToEmbassy}
                        disabled={row.status === "Dropped-Off Sent To Embassy"}
                        style={{ opacity: row.status === "Dropped-Off Sent To Embassy" ? '0.6' : '1' }}
                      >
                        SEND TO EMBASSY
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Footer */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button variant="light" className="d-flex align-items-center gap-2">
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
        .drop-menu{
          background: #003C71;
          margin-left: 50px;
        }
        .drop-menu a{
          color: white !important;
        }
        .drop-menu a:hover{
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
          z-index:0;
        }
      `}</style>
    </Container>
  );
};

export default DropOffTable;
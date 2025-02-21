"use client";
import Link from 'next/link';
import React, { useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import {
  Table,
  Form,
  Button,
  Container,
  Pagination,
  Dropdown,
  Modal, // Added Modal import
} from "react-bootstrap";
import {
  MoreVertical,
} from "lucide-react";


const StatusIcon = ({ status }) => {
  const getStatusImage = () => {

    const statusLower = status.toLowerCase();
    if (statusLower.includes('ois')) {
      return {
        src: '/logo.svg',  // Replace with actual OIS flag image path
        alt: 'OIS Status'
      };
    } else if (statusLower.includes('dhl')) {
      return {
        src: '/images/dhl-logo.png',  // Replace with actual DHL logo path
        alt: 'DHL Status'
      };
    } else if (statusLower.includes('embassy')) {
      return {
        src: '/embassy.png',  // Replace with actual embassy icon path
        alt: 'Embassy Status'
      };
    } else {
      return {
        src: '/images/default-icon.png',  // Replace with default icon path
        alt: 'Status Icon'
      };
    }
  };

  const imageInfo = getStatusImage();

  return (
    <span
      className="badge d-flex align-items-center gap-2"
      style={{
        backgroundColor: "#f8f9fa",
        color: "#333",
        padding: "6px 12px",
        borderRadius: "20px",
      }}
    >
      <img
        src={imageInfo.src}
        alt={imageInfo.alt}
        style={{
          width: "16px",
          height: "16px",
          objectFit: "contain"
        }}
      />
      <span>{status}</span>
    </span>
  );
};


const DropOffTable = ({ dropoffData, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);
  const router = useRouter();

  // Add state for modal
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    currentStatus: '',
    newStatus: '',
    identifiers: [],
    type: '' // 'single' or 'multiple'
  });

  const recordsPerPage = 10;
  const totalPages = Math.ceil(dropoffData.length / recordsPerPage);

  // Get current records
  const currentRecords = useMemo(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    return dropoffData.slice(indexOfFirstRecord, indexOfLastRecord);
  }, [currentPage, dropoffData]);

  // Get selectable records (excluding sent to embassy)
  const selectableRecords = useMemo(() => {
    return currentRecords.filter(
      record => record.status !== "Dropped-Off Sent To Embassy"
    );
  }, [currentRecords]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      // Only select rows that are not sent to embassy
      const selectableIds = selectableRecords.map(row => row.id);
      setSelectedRows(selectableIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id, status) => {
    if (status === "Dropped-Off Sent To Embassy") {
      return; // Do nothing if status is sent to embassy
    }
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const POST_KEY = process.env.NEXT_PUBLIC_POST_KEY
  const UPDATE_API_URL = `${BASE_URL}/api/v1/waybill/track/appointments/update`;


  const handleStatusChange = (applications, newStatus, currentStatus, type = 'multiple') => {
    setModalInfo({
      currentStatus,
      newStatus,
      identifiers: applications,
      type
    });
    setShowModal(true);
  };

  const confirmStatusChange = async () => {
    setShowModal(false);
    try {
      const response = await fetch(UPDATE_API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "post-key": POST_KEY
        },
        body: JSON.stringify({
          applications: modalInfo.identifiers,
          status: modalInfo.newStatus
        })
      });
      const result = await response.json();
      if (result.responseCode === 200 && result.success) {
        alert("Status updated successfully.");
        setSelectedRows([]);
        router.refresh();
        window.location.reload();
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status.");
    }
  };

  const sendToEmbassy = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one application.");
      return;
    }

    const selectedApplications = currentRecords
      .filter(record => selectedRows.includes(record.id))
      .map(record => ({
        id: record.id,
        identifier: record.passportNumber || record.trackingId
      }));

    handleStatusChange(
      selectedRows,
      "Dropped-Off Sent To Embassy",
      selectedApplications[0].currentStatus,
      'multiple'
    );
  };

  // const sendToEmbassy = async () => {
  //   if (selectedRows.length === 0) {
  //     alert("Please select at least one application.");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(UPDATE_API_URL, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "post-key": POST_KEY
  //       },
  //       body: JSON.stringify({
  //         applications: selectedRows,
  //         status: "Dropped-Off Sent To Embassy"
  //       })
  //     });
  //     const result = await response.json();
  //     if (result.responseCode === 200 && result.success) {
  //       alert("Applications sent to embassy successfully.");
  //       setSelectedRows([]);
  //       router.refresh();
  //       window.location.reload();
  //     } else {
  //       alert("Failed to update applications.");
  //     }
  //   } catch (error) {
  //     console.error("Error updating applications:", error);
  //     alert("An error occurred while updating applications.");
  //   }
  // };

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
              <Dropdown.Item className="fw-semibold text-primary" onClick={() => router.push("/dropoff/dropoff-report")}>
                DROPOFF/ COLLECTION REPORT
              </Dropdown.Item>
              <Dropdown.Item className="fw-semibold text-primary" onClick={() => router.push("/dropoffofficerReport-ois")}>
                OFFICER REPORT OIS
              </Dropdown.Item>
              <Dropdown.Item className="fw-semibold text-primary" onClick={() => router.push("/officerReport-Dhl")}>
                OFFICER REPORT DHL
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Add Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Status Change</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {modalInfo.type === 'multiple' ? (
              <p>
                Are you sure you want to change the status of {modalInfo.identifiers.length} selected
                application(s) "{modalInfo.currentStatus}" to "{modalInfo.newStatus}"?
              </p>
            ) : (
              <p>
                Are you sure you want to change the status of application
                from "{modalInfo.currentStatus}" to "{modalInfo.newStatus}"?
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmStatusChange}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>


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
                className="fw-semibold text-primary"
                onClick={sendToEmbassy}
              >
                SEND TO EMBASSY
              </Dropdown.Item>
              <Dropdown.Item
                className="fw-semibold text-primary"
                onClick={() => router.push("/dhlUpload")}
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
                  checked={selectedRows.length === selectableRecords.length && selectableRecords.length > 0}
                  disabled={selectableRecords.length === 0}
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
            {currentRecords.map((row, index) => {
              const isSentToEmbassy = row.status === "Dropped-Off Sent To Embassy";
              return (
                <tr
                  key={index}
                  className={`${selectedRows.includes(row.id) ? "bg-light" : ""} ${isSentToEmbassy ? "disabled-row" : ""
                    }`}
                  style={{
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    backgroundColor: isSentToEmbassy ? "#f5f5f5" : index === 2 ? "#f0f9ff" : "white",
                    opacity: isSentToEmbassy ? 0.7 : 1,
                    cursor: isSentToEmbassy ? "not-allowed" : "pointer"
                  }}
                >
                  <td className="py-3">
                    <Form.Check
                      type="checkbox"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id, row.status)}
                      disabled={isSentToEmbassy}
                    />
                  </td>
                  <td>
                    <Link
                      href={`/applicationdetails?trackingCode=${row.passportNumber}`}
                      className={`text-decoration-none ${isSentToEmbassy ? 'text-muted' : 'text-primary'}`}
                    >
                      {row.passportNumber}
                    </Link>
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
                        disabled={isSentToEmbassy}
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
                          className="fw-semibold text-primary"
                          onClick={() => handleStatusChange(
                            [row.id],
                            "Dropped-Off Sent To Embassy",
                            row.status,
                            'single'
                          )}
                          disabled={isSentToEmbassy}
                        >
                          SEND TO EMBASSY
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>

      {/* Footer */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button variant="light" className="d-flex align-items-center gap-2">
          {/* <Download size={16} className="text-success" />
          <span className="text-success">Export/Download</span> */}
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

export default DropOffTable;
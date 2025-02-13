"use client";

import React, { useState, useRef, useEffect } from "react";
import { Container, Nav, Form, InputGroup } from "react-bootstrap";
import { Search, ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import {
  Dropdown
} from "react-bootstrap";
import {
  
  MoreVertical
} from "lucide-react";
const NavigationHeader = () => {
  const [activeTab, setActiveTab] = useState("DROP-OFF");
  const [searchValue, setSearchValue] = useState("");
  const [showReportDropdown, setShowReportDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { id: "DROP-OFF", label: "DROP-OFF", route: "/dropoff" },
    { id: "PICK-UP", label: "PICK-UP", route: "/pick-up" },
    // { id: "REPORT", label: "REPORT", route: null },
  ];

  const reportOptions = [
    { id: "SEND_TO_EMBASSY", label: "SEND TO EMBASSY", route: "/send-to-embassy" },
    { id: "DHL_REPORTS", label: "DHL REPORTS", route: "/dhl-reports" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowReportDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabClick = (tab) => {
    if (tab.id === "REPORT") {
      setShowReportDropdown(!showReportDropdown);
    } else {
      setActiveTab(tab.id);
      router.push(tab.route);
      setShowReportDropdown(false);
    }
  };

  const handleReportOptionClick = (option) => {
    setActiveTab("REPORT");
    router.push(option.route);
    setShowReportDropdown(false);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      router.push(`/applicationdetails?trackingCode=${searchValue}`);
    }
  };

  return (
    <div className="bg-white sticky-nav sticky-top">
      <Container fluid style={{ padding: "0 40px" }}>
        <div className="d-flex justify-content-between align-items-center">
          <div className="w-100 d-flex justify-content-between">
            <Nav className="border-0 position-relative" style={{ zIndex: 1 }}>
              {tabs.map((tab) => (
                <Nav.Item key={tab.id} ref={tab.id === "REPORT" ? dropdownRef : null}>
                  <Nav.Link
                    active={activeTab === tab.id}
                    onClick={() => handleTabClick(tab)}
                    className={`border-0 px-4 py-3 position-relative ${
                      activeTab === tab.id ? "active" : ""
                    }`}
                    style={{
                      color: activeTab === tab.id ? "#FF6B00" : "#94A3B8",
                      fontWeight: "500",
                      fontSize: "18px",
                    }}
                  >
                    <div className="d-flex align-items-center">
                      {tab.label}
                      {tab.id === "REPORT" && (
                        <ChevronDown className="ms-1" size={20} />
                      )}
                    </div>
                    {activeTab === tab.id && (
                      <div
                        className="position-absolute bottom-0 start-0 w-100"
                        style={{
                          height: "3px",
                          backgroundColor: "#FF6B00",
                          bottom: "-1px",
                        }}
                      ></div>
                    )}
                  </Nav.Link>
                  {tab.id === "REPORT" && showReportDropdown && (
                    <div
                      className="position-absolute bg-white shadow-lg rounded-lg"
                      style={{
                        top: "100%",
                        left: "0",
                        minWidth: "200px",
                        zIndex: 1000,
                        border: "1px solid #E2E8F0",
                      }}
                    >
                      {reportOptions.map((option) => (
                        <div
                          key={option.id}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-50"
                          onClick={() => handleReportOptionClick(option)}
                          style={{
                            cursor: "pointer",
                            color: "#64748B",
                            fontSize: "14px",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#F8FAFC";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "white";
                          }}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </Nav.Item>
              ))}
              
            </Nav>

            <div className="d-flex align-items-center">
              <InputGroup>
                <InputGroup.Text
                  className="bg-transparent border-end-0"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  <Search size={18} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search"
                  className="border-start-0"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleSearch}
                  style={{
                    borderColor: "#E2E8F0",
                    boxShadow: "none",
                    width: "240px",
                    fontSize: "14px",
                    height: "40px",
                  }}
                />
              </InputGroup>
            </div>
          </div>
        </div>
      </Container>
      <hr />

      <style jsx>{`
        .nav-link {
          transition: color 0.2s ease;
          margin-bottom: -1px;
        }
        .nav-link:hover:not(.active) {
          color: #64748b !important;
        }
        .form-control:focus {
          border-color: #e2e8f0;
          box-shadow: none;
        }
        .input-group-text {
          border-right: none;
          background: white;
        }
        .form-control {
          background: white;
        }
        .form-control::placeholder {
          color: #94a3b8;
        }
        .input-group {
          margin-bottom: -1px;
        }
      `}</style>
    </div>
  );
};

export default NavigationHeader;
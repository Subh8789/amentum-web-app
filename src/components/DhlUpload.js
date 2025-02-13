// DHLUploadModal.js
"use client";

import React, { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import styles from './DHLUploadModal.module.css';
import { useRouter } from 'next/navigation';

const DocumentField = ({ onDelete, index, isFirst }) => (
  <div className={styles.documentFieldSet}>
    <div className={styles.formGrid}>
      {/* Select Document */}
      <div className={styles.formGroup}>
        <label className={styles.label}>SELECT DOCUMENT</label>
        <div className={styles.selectWrapper}>
          <select className={styles.select}>
            <option>Select</option>
          </select>
          <span className={styles.selectArrow}></span>
        </div>
      </div>

      {/* Upload Document */}
      <div className={styles.formGroup}>
        <div className={styles.labelWrapper}>
          <label className={styles.label}>UPLOAD DOCUMENT</label>
          {!isFirst && (
            <button 
              onClick={() => onDelete(index)} 
              className={styles.deleteButton}
              title="Delete field"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <div className={styles.uploadArea}>
          <Upload size={16} className={styles.uploadIcon} />
          <span className={styles.uploadText}>Click to upload</span>
        </div>
      </div>
    </div>
  </div>
);

const DHLUploadModal = () => {

  const router = useRouter();
  const [documentFields, setDocumentFields] = useState([0]);

  const addDocumentField = () => {
    setDocumentFields([...documentFields, documentFields.length]);
  };

  const removeDocumentField = (indexToRemove) => {
    setDocumentFields(documentFields.filter((_, index) => index !== indexToRemove));
  };

  const onClose = ()=>{
    router.push("/dropoff");
  }

  const handleSave = () => {
    // Add save logic here
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h2 className={styles.headerTitle}>DHL Upload</h2>
            <p className={styles.headerSubtitle}>Upload DHL Report</p>
          </div>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalContent}>
          {documentFields.map((_, index) => (
            <DocumentField
              key={index}
              index={index}
              isFirst={index === 0}
              onDelete={removeDocumentField}
            />
          ))}

          {/* Add Document Button */}
          <button 
            className={styles.addDocumentBtn}
            onClick={addDocumentField}
          >
            <Plus size={16} />
            <span>Add Document</span>
          </button>
        </div>

        {/* Footer with buttons */}
        <div className={styles.modalFooter}>
         
          <button 
            className={styles.saveButton}
            onClick={handleSave}
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  );
};

export default DHLUploadModal;
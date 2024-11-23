import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader } from 'lucide-react';

const FileDataExtractor = () => {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [complianceResults, setComplianceResults] = useState(null);

  const extractDataFromFile = async (file) => {
    // Here you would implement actual file parsing logic
    // This could use libraries like pdf.js for PDFs, xlsx for Excel, etc.
    const reader = new FileReader();
    
    return new Promise((resolve) => {
      reader.onload = async (e) => {
        // Simulate processing time
        setProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // This is where you'd implement actual parsing logic based on file type
          // For example, using regex patterns to find specific data points
          // Or using structured data parsing for formats like CSV/Excel
          
          // You'd extract data and format it like:
          const data = {
            companyName: "Extracted Company Name",
            exportDate: "Extracted Date",
            shipmentDetails: {
              origin: "Extracted Origin",
              destination: "Extracted Destination",
              incoterms: "Extracted Incoterms",
              transportMode: "Extracted Mode"
            },
            products: [
              // Products would be extracted from the file
            ]
          };
          
          resolve(data);
        } catch (error) {
          console.error('Error parsing file:', error);
          resolve(null);
        }
      };
      
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);
    setProcessing(true);

    try {
      // Process each file and extract data
      const extractedDataArray = await Promise.all(
        uploadedFiles.map(file => extractDataFromFile(file))
      );

      const combinedData = extractedDataArray.reduce((acc, data) => {
        if (!data) return acc;
        // Merge data from multiple files if needed
        return { ...acc, ...data };
      }, {});

      setExtractedData(combinedData);
      
      // After data extraction, perform compliance check
      await performComplianceCheck(combinedData);
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setProcessing(false);
    }
  };

  const performComplianceCheck = async (data) => {
    // Implement actual compliance checking logic here
    // This could involve API calls to compliance services
    setComplianceResults({
      status: "APPROVED",
      checks: [
        { name: "Sanctioned Parties", passed: true, details: "No matches found" },
        { name: "Export Controls", passed: true, details: "Items cleared for export" },
        { name: "Dual-Use Check", passed: true, details: "No dual-use items identified" },
        { name: "License Requirements", passed: true, details: "No license required" }
      ],
      warnings: ["Recommend end-use certification"]
    });
  };

  return (
    <div className="container">
      <style>
        {`
          .container {
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
          }
          .card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .card-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .upload-area {
            border: 2px dashed #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
          }
          .upload-button {
            background: #2563eb;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            display: inline-block;
          }
          .data-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
          }
          .data-item {
            background: #f9fafb;
            padding: 12px;
            border-radius: 4px;
          }
          .data-label {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 4px;
          }
          .data-value {
            font-weight: 500;
          }
          .product-item {
            border-bottom: 1px solid #e5e7eb;
            padding: 12px 0;
          }
          .compliance-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px;
            background: #f9fafb;
            margin-bottom: 8px;
            border-radius: 4px;
          }
          .warning-box {
            background: #fefce8;
            padding: 12px;
            border-radius: 4px;
            margin-top: 16px;
          }
          .hidden {
            display: none;
          }
        `}
      </style>

      <div className="card">
        <h2 className="card-title">
          <Upload size={20} />
          Upload Documents
        </h2>
        <div className="upload-area">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="upload-button">
            Select Files
          </label>
          <p style={{ marginTop: 8, color: '#6b7280' }}>
            Upload invoices, packing lists, or other source documents
          </p>
        </div>
      </div>

      {processing && (
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Loader className="animate-spin" size={20} />
            Processing documents...
          </div>
        </div>
      )}

      {extractedData && (
        <div className="card">
          <h2 className="card-title">
            <FileText size={20} />
            Extracted Information
          </h2>
          
          <div className="data-grid">
            <div className="data-item">
              <div className="data-label">Company</div>
              <div className="data-value">{extractedData.companyName}</div>
            </div>
            <div className="data-item">
              <div className="data-label">Date</div>
              <div className="data-value">{extractedData.exportDate}</div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <h3 className="data-label">Shipment Details</h3>
            <div className="data-grid">
              <div>Origin: {extractedData.shipmentDetails?.origin}</div>
              <div>Destination: {extractedData.shipmentDetails?.destination}</div>
              <div>Incoterms: {extractedData.shipmentDetails?.incoterms}</div>
              <div>Mode: {extractedData.shipmentDetails?.transportMode}</div>
            </div>
          </div>

          {extractedData.products && (
            <div style={{ marginTop: 16 }}>
              <h3 className="data-label">Products</h3>
              {extractedData.products.map((product, idx) => (
                <div key={idx} className="product-item">
                  <div style={{ fontWeight: 500 }}>{product.description}</div>
                  <div style={{ fontSize: 14, color: '#6b7280' }}>
                    Qty: {product.quantity} | Unit Price: ${product.unitPrice} | 
                    HS Code: {product.hsCode}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {complianceResults && (
        <div className="card">
          <h2 className="card-title">
            <Check size={20} />
            Compliance Validation
          </h2>
          
          <div style={{ 
            fontSize: 18, 
            fontWeight: 500, 
            marginBottom: 16,
            color: complianceResults.status === "APPROVED" ? '#16a34a' : '#dc2626'
          }}>
            Status: {complianceResults.status}
          </div>
          
          {complianceResults.checks.map((check, idx) => (
            <div key={idx} className="compliance-item">
              {check.passed ? (
                <Check size={16} color="#22c55e" />
              ) : (
                <AlertCircle size={16} color="#dc2626" />
              )}
              <div>
                <div style={{ fontWeight: 500 }}>{check.name}</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>{check.details}</div>
              </div>
            </div>
          ))}
          
          {complianceResults.warnings.length > 0 && (
            <div className="warning-box">
              <div style={{ fontWeight: 500, color: '#854d0e' }}>Warnings:</div>
              <ul style={{ paddingLeft: 20, color: '#854d0e' }}>
                {complianceResults.warnings.map((warning, idx) => (
                  <li key={idx}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileDataExtractor;
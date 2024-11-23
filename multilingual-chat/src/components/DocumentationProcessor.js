import React, { useState } from 'react';
import { Upload, FileText, ArrowRight } from 'lucide-react';

const FormFieldExtractor = () => {
  // Predefined fields for commercial invoice
  const COMMERCIAL_INVOICE_FIELDS = [
    'Exporter',
    'Ultimate Consignee',
    'Intermediate Consignee',
    'Exporter Contact Name',
    'Origination State',
    'Exporting Carrier',
    'Ultimate Consignee Phone',
    'Commercial Invoice Number',
    'Order Number',
    'Date',
    'PO Number',
    'Terms',
    'Proforma Invoice Number',
    'Customer Account Number',
    'Loading Pier/Terminal',
    'Country of Destination',
    'Exporter Contact Phone',
    'Ex-Works Value',
    'Inland Freight Fees',
    'Handling Fees',
    'Consular Fees',
    'Ocean/Air Fees',
    'Insurance Fees',
    'Other Charges',
    'Total'
  ];

  const [files, setFiles] = useState([]);
  const [extractedFields, setExtractedFields] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [generatedText, setGeneratedText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: upload, 2: input, 3: result

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);
    setProcessing(true);

    try {
      // Instead of extracting fields, we'll use our predefined list
      setExtractedFields(COMMERCIAL_INVOICE_FIELDS);
      setUserInputs({});
      setStep(2);
    } catch (error) {
      console.error('Error processing files:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateEnglishText = () => {
    let text = "Commercial Invoice Details:\n\n";
    
    Object.entries(userInputs).forEach(([field, value]) => {
      if (value) {
        text += `${field}: ${value}\n`;
      }
    });
    
    setGeneratedText(text);
    setStep(3);
  };

  return (
    <div className="container">
      <style>
        {`
          .container {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          .card {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .steps {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .step {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .step-number {
            width: 24px;
            height: 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 500;
            font-size: 14px;
          }
          .step-active {
            background: #2563eb;
            color: white;
          }
          .step-completed {
            background: #16a34a;
            color: white;
          }
          .step-pending {
            background: #e5e7eb;
            color: #6b7280;
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
          .input-group {
            margin-bottom: 16px;
          }
          .input-label {
            display: block;
            margin-bottom: 4px;
            font-weight: 500;
          }
          .input-field {
            width: 100%;
            padding: 8px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
          }
          .button {
            background: #2563eb;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 14px;
          }
          .button:hover {
            background: #1d4ed8;
          }
          .result-text {
            white-space: pre-wrap;
            background: #f8fafc;
            padding: 16px;
            border-radius: 4px;
            line-height: 1.5;
          }
          .hidden {
            display: none;
          }
          .form-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          @media (max-width: 768px) {
            .form-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="steps">
        <div className="step">
          <div className={`step-number ${step === 1 ? 'step-active' : step > 1 ? 'step-completed' : 'step-pending'}`}>
            1
          </div>
          <span>Upload Files</span>
        </div>
        <ArrowRight size={20} color="#6b7280" />
        <div className="step">
          <div className={`step-number ${step === 2 ? 'step-active' : step > 2 ? 'step-completed' : 'step-pending'}`}>
            2
          </div>
          <span>Fill Information</span>
        </div>
        <ArrowRight size={20} color="#6b7280" />
        <div className="step">
          <div className={`step-number ${step === 3 ? 'step-active' : 'step-pending'}`}>
            3
          </div>
          <span>Generated Text</span>
        </div>
      </div>

      {step === 1 && (
        <div className="card">
          <div className="upload-area">
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".txt,.doc,.docx,.pdf"
            />
            <label htmlFor="file-upload" className="upload-button">
              <Upload size={20} style={{ display: 'inline', marginRight: '8px' }} />
              Select Files
            </label>
            <p style={{ marginTop: 8, color: '#6b7280' }}>
              Upload your commercial invoice files
            </p>
          </div>
        </div>
      )}

      {step === 2 && extractedFields.length > 0 && (
        <div className="card">
          <h2 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
            <FileText size={20} style={{ display: 'inline', marginRight: '8px' }} />
            Commercial Invoice Information
          </h2>
          
          <div className="form-grid">
            {extractedFields.map((field) => (
              <div key={field} className="input-group">
                <label className="input-label">{field}</label>
                <input
                  type="text"
                  className="input-field"
                  value={userInputs[field] || ''}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  placeholder={`Enter ${field.toLowerCase()}`}
                />
              </div>
            ))}
          </div>
          
          <button 
            className="button"
            onClick={generateEnglishText}
          >
            Generate Text
          </button>
        </div>
      )}

      {step === 3 && generatedText && (
        <div className="card">
          <h2 style={{ marginBottom: 16, fontSize: 18, fontWeight: 600 }}>
            Generated Commercial Invoice Text
          </h2>
          <div className="result-text">
            {generatedText}
          </div>
          <button 
            className="button"
            onClick={() => setStep(1)}
            style={{ marginTop: 16 }}
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default FormFieldExtractor;
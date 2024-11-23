import React, { useState } from 'react';
import { 
  TRADE_TYPES, 
  FREQUENCIES, 
  CLASSIFICATIONS, 
  FLOW_CODES,
  fetchComtradeData 
} from './comtradeApi';

const MarketOpp = () => {
  const [formData, setFormData] = useState({
    typeCode: TRADE_TYPES.COMMODITY,
    freqCode: FREQUENCIES.ANNUAL,
    clCode: CLASSIFICATIONS.HS,
    reporterCode: '',
    period: '',
    partnerCode: '',
    partner2Code: '',
    cmdCode: '',
    flowCode: FLOW_CODES.EXPORT,
    customsCode: '',
    motCode: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchComtradeData(formData);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comtrade-container">
      <style>
        {`
          .comtrade-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }

          .card {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 24px;
            margin-bottom: 24px;
          }

          .card-title {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 16px;
            color: #333;
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .form-label {
            font-weight: 500;
            margin-bottom: 8px;
            color: #4b5563;
          }

          .form-select,
          .form-input {
            padding: 10px;
            font-size: 1rem;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            background-color: #fff;
          }

          .button {
            background-color: #3b82f6;
            color: white;
            padding: 12px 20px;
            font-size: 1rem;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            width: 100%;
            margin:20px;
            transition: background-color 0.3s ease;
          }

          .button:disabled {
            background-color: #cbd5e1;
            cursor: not-allowed;
          }

          .button:hover:not(:disabled) {
            background-color: #2563eb;
          }

          .error-alert {
            background-color: #fef2f2;
            color: #b91c1c;
            padding: 12px;
            border-radius: 8px;
            margin-top: 16px;
            font-size: 1rem;
            text-align: center;
          }

          .results-container {
            margin-top: 32px;
          }

          pre {
            background-color: #f3f4f6;
            padding: 16px;
            border-radius: 8px;
            overflow: auto;
            max-height: 400px;
            word-wrap: break-word;
          }
        `}
      </style>
      <div className="card">
        <h2 className="card-title">UN Comtrade Data Query</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Trade Type</label>
              <select 
                className="form-select"
                name="typeCode"
                value={formData.typeCode}
                onChange={handleInputChange}
              >
                <option value={TRADE_TYPES.COMMODITY}>Commodity</option>
                <option value={TRADE_TYPES.SERVICE}>Service</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Frequency</label>
              <select 
                className="form-select"
                name="freqCode"
                value={formData.freqCode}
                onChange={handleInputChange}
              >
                <option value={FREQUENCIES.ANNUAL}>Annual</option>
                <option value={FREQUENCIES.MONTHLY}>Monthly</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Classification</label>
              <select 
                className="form-select"
                name="clCode"
                value={formData.clCode}
                onChange={handleInputChange}
              >
                {Object.entries(CLASSIFICATIONS).map(([key, value]) => (
                  <option key={key} value={value}>{key}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Reporter Country Code</label>
              <input
                className="form-input"
                type="text"
                name="reporterCode"
                value={formData.reporterCode}
                onChange={handleInputChange}
                placeholder="e.g., 842 for USA"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Partner Country Code</label>
              <input
                className="form-input"
                type="text"
                name="partnerCode"
                value={formData.partnerCode}
                onChange={handleInputChange}
                placeholder="e.g., 156 for China"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Period</label>
              <input
                className="form-input"
                type="text"
                name="period"
                value={formData.period}
                onChange={handleInputChange}
                placeholder="YYYY or YYYYMM"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Product Code</label>
              <input
                className="form-input"
                type="text"
                name="cmdCode"
                value={formData.cmdCode}
                onChange={handleInputChange}
                placeholder="Enter product code"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Flow Code</label>
              <select 
                className="form-select"
                name="flowCode"
                value={formData.flowCode}
                onChange={handleInputChange}
              >
                {Object.entries(FLOW_CODES).map(([key, value]) => (
                  <option key={key} value={value}>{key}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            className="button" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}

      {data && (
        <div className="card results-container">
          <h2 className="card-title">Results</h2>
          <pre style={{ overflow: 'auto' }}>
            {data}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MarketOpp;

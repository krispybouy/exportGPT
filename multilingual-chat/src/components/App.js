import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";  // Assuming Sidebar contains Link components for navigation
import "./App.css"
import MultilingualExportChat from "./ChatInterface";
import ReactDOM from 'react-dom';


import ExportDocGenerator from "./DocumentationProcessor";
import  MarketIntelligence from "./MarketOpp";
import AmazonGlobal from './AmazonGlobal'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const App = () => {


 

  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#d2ddf7" }}>
       
          <>
            {/* Sidebar containing links for navigation */}
            <Sidebar />
            
            <div style={{ flex: 1 }}>
              <main style={{ maxWidth: "7xl", margin: "0 auto", padding: "24px" }}>
                <Routes>
                  <Route path="/" element={<MultilingualExportChat />} />
                  <Route path="/ai-assistant" element={<MultilingualExportChat />} />
                  <Route path="/extract-data" element={<ExportDocGenerator />} />
                  <Route path="/market-intelligence" element={<MarketIntelligence />} />
                  <Route path="/amazon-global" element={<AmazonGlobal />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} /> {/* Redirect if no route matched */}
                </Routes>
              </main>
            </div>
          </>
      </div>
    </Router>
  );
};

export default App;

// comtradeApi.js
export const TRADE_TYPES = {
    COMMODITY: 'C',
    SERVICE: 'S'
  };
  
  export const FREQUENCIES = {
    ANNUAL: 'A',
    MONTHLY: 'M'
  };
  
  export const CLASSIFICATIONS = {
    HS: 'HS',
    SITC: 'SITC',
    BEC: 'BEC',
    EBOPS: 'EBOPS'
  };
  
  export const FLOW_CODES = {
    IMPORT: 'M',
    EXPORT: 'X',
    RE_EXPORT: 'R',
    RE_IMPORT: 'W'
  };
  
  const PROXY_URL = 'http://localhost:5000/api/comtrade';
  
  export const fetchComtradeData = async (params) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await fetch(`${PROXY_URL}?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.text();
    } catch (error) {
      console.error('Error fetching Comtrade data:', error);
      throw error;
    }
  };
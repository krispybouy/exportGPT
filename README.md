# ExportGPT

## Overview
This project is a multilingual export assistance platform designed to simplify the export process. It features:
- An AI-powered assistant for answering export-related queries in multiple languages.
- A document extraction tool for analyzing uploaded files and extracting relevant data.
- Market intelligence insights using the UN Comtrade Public API.
- A placeholder for integrating Amazon Global Selling in the future.

---

## Features
1. **AI Assistant**: 
   - Supports multiple languages (e.g., English, Tamil, Hindi).
   - Responds to user queries with context and intent classification.

2. **Document Extraction**:
   - Allows users to upload documents (e.g., commercial invoices).
   - Extracts predefined fields for user review (mock data is currently used).

3. **Market Intelligence**:
   - Fetches trade analytics based on user inputs such as country codes and product codes.
   - Leverages the UN Comtrade Public API.

4. **Amazon Global Selling**:
   - Placeholder for future integration to help exporters sell on Amazon marketplaces.

---

## Tech Stack
- Frontend: React, React Router DOM, Lucide React (for icons)
- Backend: Node.js with Express.js
- Database: Not currently used (mock data is utilized for document extraction)
- Translation: Google Translate API
- External APIs: UN Comtrade Public API for market intelligence insights

---

## How to Run Locally

### Prerequisites
- Install [Node.js](https://nodejs.org) (LTS version recommended).
- Install a package manager such as `npm` (comes with Node.js).

---
### Installation

1. Clone the repository
```bash
git clone https://github.com/krispybouy/ExportGPT/
cd multilingual-chat
```

2. Frontend Setup
```bash
cd multilingual-chat
npm install
npm start
```

3. Backend Setup
```bash
cd multilingual-chat/backend
npm install
node server.js
```

The application will be available at `http://localhost:5000`

## Usage

AI Assistant: Ask export-related queries and get multilingual responses.
Document Extraction: Upload a document to view extracted fields (mock data is displayed).
Market Intelligence: Enter country and product codes to fetch trade insights.
Amazon Global Selling: This feature is under development.

## Known Limitations
The document extraction feature currently uses mock data.
Amazon Global Selling integration is a placeholder for future implementation.

## Testing

```bash
# Run frontend tests
cd multilingual-chat
npm test

# Run backend tests
cd multilingual-chat/backend
npm test
```

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements
Integrate Amazon Global Selling.
Enhance document extraction with AI-based OCR and translation.
Add AR/VR features for interactive export process visualization.
Generate export documents automatically.


## Project Status
This is a prototype as a part of a hackathon

## Team
- Deeksha Kashyap
- Srirama V Swamy

## License
This project is licensed under the [License Name] - see the LICENSE.md file for details

## Acknowledgments
- Thanks to [mention any third-party services, libraries, or people]
- Special thanks to our mentors and judges

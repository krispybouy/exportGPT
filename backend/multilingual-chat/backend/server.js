const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST']
}));
app.use(express.json());

// Export-related knowledge base
const exportKnowledgeBase = {
    documentation: {
        en: [
            "Export documentation typically includes: Commercial Invoice, Bill of Lading, Certificate of Origin, and Packing List.",
            "You'll need to prepare customs declarations and shipping manifests.",
            "Make sure to have proper insurance documentation for international shipments."
        ],
        kn: [
            "ರಫ್ತು ದಾಖಲೆಗಳಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ಇವು ಒಳಗೊಂಡಿರುತ್ತವೆ: ವಾಣಿಜ್ಯ ಸರಕುಪಟ್ಟಿ, ಲದಿಂಗ್ ಬಿಲ್, ಮೂಲ ಪ್ರಮಾಣಪತ್ರ ಮತ್ತು ಪ್ಯಾಕಿಂಗ್ ಪಟ್ಟಿ.",
            "ನೀವು ಕಸ್ಟಮ್ಸ್ ಘೋಷಣೆಗಳು ಮತ್ತು ಶಿಪ್ಪಿಂಗ್ ಮ್ಯಾನಿಫೆಸ್ಟ್‌ಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಬೇಕಾಗುತ್ತದೆ.",
            "ಅಂತರರಾಷ್ಟ್ರೀಯ ಶಿಪ್‌ಮೆಂಟ್‌ಗಳಿಗೆ ಸರಿಯಾದ ವಿಮಾ ದಾಖಲೆಗಳನ್ನು ಹೊಂದಿರುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ."
        ],
        hi: [
            "निर्यात दस्तावेजों में सामान्यतः शामिल हैं: वाणिज्यिक चालान, बिल ऑफ लेडिंग, मूल प्रमाण पत्र और पैकिंग सूची।",
            "आपको सीमा शुल्क घोषणाएं और शिपिंग मैनिफेस्ट तैयार करने होंगे।",
            "अंतर्राष्ट्रीय शिपमेंट के लिए उचित बीमा दस्तावेज सुनिश्चित करें।"
        ],
        ta: [
            "ஏற்றுமதி ஆவணங்களில் பொதுவாக அடங்குபவை: வணிக விலைப்பட்டியல், சரக்குச் சீட்டு, தோற்றுவாய் சான்றிதழ் மற்றும் பொதி பட்டியல்.",
            "சுங்க அறிவிப்புகள் மற்றும் கப்பல் ஏற்று பட்டியல்களை நீங்கள் தயார் செய்ய வேண்டும்.",
            "சர்வதேச ஏற்றுமதிகளுக்கு முறையான காப்பீட்டு ஆவணங்களை உறுதி செய்யவும்."
        ]
    },
    process: {
        en: [
            "The export process involves: Market research, Finding buyers, Documentation, Customs clearance, and Shipping.",
            "Ensure compliance with both domestic and international trade regulations.",
            "Consider working with a freight forwarder for logistics management."
        ],
        kn: [
            "ರಫ್ತು ಪ್ರಕ್ರಿಯೆಯಲ್ಲಿ ಒಳಗೊಂಡಿರುವುದು: ಮಾರುಕಟ್ಟೆ ಸಂಶೋಧನೆ, ಖರೀದಿದಾರರನ್ನು ಹುಡುಕುವುದು, ದಾಖಲೀಕರಣ, ಕಸ್ಟಮ್ಸ್ ಕ್ಲಿಯರೆನ್ಸ್ ಮತ್ತು ಸಾಗಣೆ.",
            "ದೇಶೀಯ ಮತ್ತು ಅಂತರರಾಷ್ಟ್ರೀಯ ವ್ಯಾಪಾರ ನಿಯಮಗಳ ಅನುಸರಣೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.",
            "ಸರಕು ಸಾಗಣೆ ನಿರ್ವಹಣೆಗಾಗಿ ಫ್ರೈಟ್ ಫಾರ್ವರ್ಡರ್‌ನೊಂದಿಗೆ ಕೆಲಸ ಮಾಡುವ ಬಗ್ಗೆ ಪರಿಗಣಿಸಿ."
        ],
        hi: [
            "निर्यात प्रक्रिया में शामिल हैं: बाजार अनुसंधान, खरीदारों की खोज, दस्तावेजीकरण, सीमा शुल्क निकासी और शिपिंग।",
            "घरेलू और अंतर्राष्ट्रीय व्यापार नियमों का अनुपालन सुनिश्चित करें।",
            "लॉजिस्टिक्स प्रबंधन के लिए फ्रेट फॉरवर्डर के साथ काम करने पर विचार करें।"
        ],
        ta: [
            "ஏற்றுமதி செயல்முறையில் அடங்குபவை: சந்தை ஆராய்ச்சி, வாங்குபவர்களைக் கண்டறிதல், ஆவணப்படுத்துதல், சுங்க அனுமதி மற்றும் கப்பல் போக்குவரத்து.",
            "உள்நாட்டு மற்றும் சர்வதேச வர்த்தக விதிமுறைகளுக்கு இணங்குவதை உறுதி செய்யவும்.",
            "தளவாட மேலாண்மைக்கு சரக்கு அனுப்புனருடன் பணியாற்ற பரிசீலிக்கவும்."
        ]
    }
};

// Function to classify query intent
function classifyIntent(query) {
    const documentationKeywords = ['document', 'documentation', 'papers', 'certificate', 'ದಾಖಲೆ', 'प्रमाणपत्र', 'ஆவணம்'];
    const processKeywords = ['process', 'procedure', 'steps', 'how', 'ಪ್ರಕ್ರಿಯೆ', 'प्रक्रिया', 'செயல்முறை'];
    
    query = query.toLowerCase();
    
    if (documentationKeywords.some(keyword => query.includes(keyword))) {
        return 'documentation';
    }
    if (processKeywords.some(keyword => query.includes(keyword))) {
        return 'process';
    }
    return 'general';
}

// Function to get response based on intent and language
function getResponse(intent, language) {
    const responses = exportKnowledgeBase[intent] || exportKnowledgeBase.process;
    const langResponses = responses[language] || responses.en;
    
    // Randomly select responses and combine them for variety
    const numResponses = Math.min(2, langResponses.length);
    const selectedResponses = [];
    
    while (selectedResponses.length < numResponses) {
        const randomIndex = Math.floor(Math.random() * langResponses.length);
        const response = langResponses[randomIndex];
        if (!selectedResponses.includes(response)) {
            selectedResponses.push(response);
        }
    }
    
    return selectedResponses.join('\n\n');
}

app.post('/process', async (req, res) => {
    const { query, language } = req.body;
    
    try {
        const intent = classifyIntent(query);
        const response = getResponse(intent, language);
        
        res.json({
            response,
            intent,
            confidence: 0.85 // Mock confidence score
        });
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ error: 'Error processing the query' });
    }
});

app.listen(PORT, () => {
    console.log(`Export Assistant server running on port ${PORT}`);
});
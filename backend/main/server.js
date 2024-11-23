const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));
app.use(express.json());

// Translation function using LibreTranslate
const translateText = async (text, sourceLang, targetLang) => {
    try {
        const response = await axios.post('http://localhost:5000/translate', {
            q: text,
            source: sourceLang,
            target: targetLang
        });
        return response.data.translatedText;
    } catch (error) {
        console.error('Translation error:', error);
        return text; // Fallback to original text if translation fails
    }
};

// Generative AI response function
const generateResponse = async (query) => {
    const apiUrl = "https://api-inference.huggingface.co/models/gpt2";
    const headers = {
        Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        "Content-Type": "application/json",
    };

    const data = {
        inputs: query,
        options: { wait_for_model: true },
    };

    try {
        const response = await axios.post(apiUrl, data, { headers });
        return response.data[0]?.generated_text || "Unable to generate response at the moment.";
    } catch (error) {
        console.error("Error generating response:", error.response?.data || error.message);
        return "Error communicating with the AI model.";
    }
};

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
        ]
    }
};

// Simple intent classification
function classifyIntent(query) {
    const keywords = {
        documentation: ['document', 'certificate', 'paperwork'],
        process: ['procedure', 'steps', 'how to'],
        regulations: ['regulation', 'law', 'compliance']
    };

    query = query.toLowerCase();
    for (const [intent, terms] of Object.entries(keywords)) {
        if (terms.some(term => query.includes(term))) {
            return intent;
        }
    }
    return 'general';
}

function getResponse(intent, language) {
    const responses = exportKnowledgeBase[intent] || exportKnowledgeBase.process;
    const langResponses = responses[language] || responses.en;
    
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
        // Translate query to English if not already in English
        const translatedQuery = language !== 'en' 
            ? await translateText(query, language, 'en') 
            : query;

        // Classify intent and get predefined responses in English
        const intent = classifyIntent(translatedQuery);
        const knowledgeBaseResponse = getResponse(intent, 'en');

        // Generate AI response in English
        const aiGeneratedResponse = await generateResponse(translatedQuery);

        // Combine responses
      
        const combinedResponse = ` ${knowledgeBaseResponse}\n\nAI Suggestion:\n ${aiGeneratedResponse}`;

        // Translate combined response back to original language
        const finalResponse = language !== 'en'
            ? await translateText(combinedResponse, 'en', language)
            : combinedResponse;

        res.json({
        
            response: finalResponse,
            intent,
            confidence: 0.95
        });
    } catch (error) {
        console.error("Error processing query:", error);
        res.status(500).json({ error: "Error processing the query" });
    }
});

app.listen(PORT, () => {
    console.log(`Export Assistant server running on port ${PORT}`);
});
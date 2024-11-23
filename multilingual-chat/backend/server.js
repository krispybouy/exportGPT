const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fetch = require('node-fetch');
const { Hercai } = require('hercai');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize free AI client
const herc = new Hercai();

const allowedOrigins = ['https://deekshakashyap16.github.io', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

const exportKnowledgeBase = {
    process: {
        en: [
            "Here's a general process description in English.",
            "Another English process explanation."
        ],
        hi: [
            "यहाँ एक सामान्य प्रक्रिया विवरण है।",
            "एक और हिंदी प्रक्रिया व्याख्या।"
        ],
        ta: [
            "இங்கே ஒரு பொது செயல்முறை விளக்கம்.",
            "மற்றொரு தமிழ் செயல்முறை விளக்கம்."
        ],
        kn: [
            "ಇಲ್ಲಿ ಸಾಮಾನ್ಯ ಪ್ರಕ್ರಿಯೆಯ ವಿವರಣೆಯಿದೆ.",
            "ಮತ್ತೊಂದು ಕನ್ನಡ ಪ್ರಕ್ರಿಯೆ ವಿವರಣೆ."
        ]
    },
    documentation: {
        en: [
            "Documentation explanation in English.",
            "Another documentation description."
        ],
        hi: [
            "हिंदी में दस्तावेज़ीकरण की व्याख्या।",
            "दस्तावेज़ीकरण का एक और विवरण।"
        ]
    },
    general: {
        en: [
            "General response in English.",
            "Another general response."
        ]
    }
};

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

function getResponse(intent, language) {
    // Default to English if language is undefined
    const lang = language || 'en';
    
    const responses = exportKnowledgeBase[intent] || exportKnowledgeBase.process;
    
    // Ensure responses exist for the language, fallback to English
    const langResponses = responses[lang] || responses['en'] || [];
    
    if (langResponses.length === 0) {
        return "No response available for this intent and language.";
    }
    
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

const translateText = async (text, sourceLang, targetLang) => {
    try {
        const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
            params: {
                client: 'gtx',
                sl: sourceLang,
                tl: targetLang,
                dt: 't',
                q: text
            }
        });

        return response.data[0][0][0];
    } catch (error) {
        console.error('Translation error:', error);
        return text;
    }
};

// Free AI Generation with Hercai
const generateResponse = async (query, language) => {
    try {
        const languagePrompts = {
            en: "You are an export assistant. Provide professional advice in English.",
            hi: "आप एक निर्यात सहायक हैं। हिंदी में पेशेवर सलाह प्रदान करें।",
            ta: "நீங்கள் ஏற்றுமதி உதவியாளர் ஆவீர்கள். தமிழில் தொழிலகப் பரிந்துரைகளை வழங்கவும்.",
            kn: "ನೀವು ಆಮದು ಸಹಾಯಕರಾಗಿದ್ದೀರಿ. ಕನ್ನಡದಲ್ಲಿ ವೃತ್ತಿಪರ ಸಲಹೆಗಳನ್ನು ಒದಗಿಸಿ."
        };

        const prompt = languagePrompts[language] || languagePrompts.en;

        const response = await herc.question({
            content: `${prompt} Query: ${query}`
        });
        
        return response.reply.trim();
    } catch (error) {
        console.error("Error generating response:", error);
        const errorMessages = {
            en: "Currently having trouble generating a response.",
            hi: "वर्तमान में प्रतिक्रिया उत्पन्न करने में समस्या है।",
            ta: "தற்பொழுது பதிலை தயாரிப்பதில் சிக்கல் ஏற்பட்டுள்ளது.",
            kn: "ಪ್ರಸ್ತುತ ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಉತ್ಪಾದಿಸಲು ಸಮಸ್ಯೆ ಇದೆ."
        };
        return errorMessages[language] || errorMessages.en;
    }
};

//market
app.get('/api/comtrade', async (req, res) => {
    try {
        const queryParams = new URLSearchParams(req.query).toString();
        const url = `https://comtradeapi.un.org/public/v1/preview/${req.query.typeCode}/${req.query.freqCode}/${req.query.clCode}?${queryParams}`;
        
        const response = await fetch(url);
        const data = await response.json();

    
        // Extract the first record (assuming a single data record)
        const record = data.data[0];

        // Construct human-readable description
        const description = `Trade Summary:\n- Reporter: ${record.reporterDesc || `Country Code ${record.reporterCode}`}\n- Partner: ${record.partnerDesc || `Country Code ${record.partnerCode}`}\n- Commodity Code: ${record.cmdCode || 'Unknown'} (${record.cmdDesc || 'Description not provided'})\n- Year: ${record.refYear || 'Unknown'}\n- Flow: ${record.flowDesc || `Code ${record.flowCode}`}\n- Quantity: ${record.qty || 'Unknown'} ${record.qtyUnitAbbr || 'units'}\n- Net Weight: ${record.netWgt || 'Unknown'} kilograms\n- FOB Value: ${record.fobvalue ? `$${record.fobvalue}` : 'Not available'}\nThis transaction involves ${record.qty || 'an unknown quantity'} of goods valued at ${record.fobvalue ? `$${record.fobvalue}` : 'an unknown amount'} exported/imported between ${record.reporterDesc || `Country ${record.reporterCode}`} and ${record.partnerDesc || `Country ${record.partnerCode}`} during ${record.refYear || 'an unspecified year'}.`;

        // Send description as response
        res.type('text/plain').send(description);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ error: 'Failed to fetch or process data from Comtrade API' });
    }
});


  //done
  

app.post('/process', async (req, res) => {
    const { query, language } = req.body;

    try {
        // Translate query to English for intent classification
        const translatedQueryToEnglish = language !== 'en' 
            ? await translateText(query, language, 'en') 
            : query;

        // Classify intent and get predefined responses
        const intent = classifyIntent(translatedQueryToEnglish);
        
        // Get response in the chosen language
        const knowledgeBaseResponse = getResponse(intent, language);

        // Generate AI response in the chosen language
        const aiGeneratedResponse = await generateResponse(translatedQueryToEnglish, language);

        // Combine responses and ensure they are in the chosen language
        const combinedResponse = `${knowledgeBaseResponse}\n\n\n\n\n\n${aiGeneratedResponse}`;

        res.json({
            response: combinedResponse,
            intent,
            confidence: 0.85
        });
    } catch (error) {
        console.error("Error processing query:", error);
        res.status(500).json({ error: "Error processing the query" });
    }
});

app.listen(PORT, () => {
    console.log(`Export Assistant server running on port ${PORT}`);
});
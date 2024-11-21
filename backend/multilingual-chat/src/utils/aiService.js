import axios from 'axios';

export const generateResponse = async (query) => {
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
    console.log("Request Data:", data);
    const response = await axios.post(apiUrl, data, { headers });
    console.log("API Response:", response.data);
    return response.data[0]?.generated_text || "Unable to generate response at the moment.";
  } catch (error) {
    console.error("Error generating response:", error.response?.data || error.message);
    return "Error communicating with the AI model.";
  }
};

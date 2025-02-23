require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });


app.get('/test-ai', async (req, res)=>{
	const prompt = "Explain how AI works";

	const result = await model.generateContent(prompt);
	console.log(result.response.text());
})

app.get('/', (req, res)=>{
	res.send({message: 'lets crack the power of ai'})
})

app.listen(port, ()=>{
	console.log('Server running on port', port);
});
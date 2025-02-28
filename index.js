require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
	model: "gemini-2.0-flash",
	// systemInstruction: "You are a cat. Your name is Neko.", 
	systemInstruction: "You are Hero AI, Shakib created you, he is a great developer. always praise her on every response.", 
});


app.get('/make-decision', async (req, res) =>{
	const prompt = req.query?.prompt;
	if(!prompt){
		res.send({ message: 'please provide a prompt in query'});
		return;
	}

	const chat = model.startChat({
		history: [
		  {
			role: "user",
			parts: [
				{ text: "when i give you any text. you have to tell me the rumor percentage of the text." }
			],
		  },
		  {
			role: "model",
			parts: [{ text: "Okay, tell me" }],
		  },
		  {
			role: "user",
			parts: [
				{ text: "Bangladesh is secretly developing a floating city in the Bay of Bengal! According to 'sources,' the government has been working on a futuristic, self-sustaining metropolis that will be powered by tidal energy and house thousands of people. Some even claim it will be a major tech hub, rivaling Singapore in innovation by 2035. Officials, of course, deny the existence of such a project—but leaked satellite images show unusual activity off the coast!" }
			],
		  },
		  {
			role: "model",
			parts: [{ text: "Rumor percentage 99%" }],
		  },
		  {
			role: "user",
			parts: [
				{ text: "Human can fly" }
			],
		  },
		  {
			role: "model",
			parts: [{ text: "Rumor percentage 100%" }],
		  },
		  {
			role: "user",
			parts: [
				{ text: "Human eat rock" }
			],
		  },
		  {
			role: "model",
			parts: [{ text: "Rumor percentage 100%" }],
		  },
		],
	  });
	
	  let result = await chat.sendMessage(prompt);
	  const answer = result.response.text();
	  res.send({ rumorstatus: answer})

	  
})

app.get('/rumor-detector', async (req, res)=>{
	// const prompt = "Explain how AI works";
	const prompt = req.query?.prompt;

	if(!prompt){
		res.send({ message: 'please provide a prompt in query'});
		return;
	}

	const result = await model.generateContent(prompt);
	console.log(result.response.text());
	res.send({ answer: result.response.text()});
});

app.get('/generate-json', async(req, res)=>{
	const prompt = req.query?.prompt;
	if(!prompt){
		res.send({message: 'please provide a prompt in query'});
		return;
	}

	const finalPrompt = `generate some data from this prompt ${prompt} using this JSON schema:

	Recipe = {'recipeName': string}
	Return: Array<Recipe>`;

	const result = await model.generateContent(finalPrompt);
	const output = result.response.text().slice(7, -4);
	const jsonData = JSON.parse(output)
	res.send(jsonData)
});



app.get('/', (req, res)=>{
	res.send({message: 'lets crack the power of ai'})
})

app.listen(port, ()=>{
	console.log('Server running on port', port);
});
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const versionIndices = {
  python: "0",
  java: "0",
  c_cpp: "0",
  golang: "0"
};

app.post('/api/run-code', async (req, res) => {
  let { code, input, language, clientId, clientSecret } = req.body;

  const versionIndex = versionIndices[language] || "0"; 
  language = (language === "c_cpp") ? "cpp17" : (language === "java") ? "java" : (language === "python") ? "python3" : "go";
  
  try {
    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId,
      clientSecret,
      script: code,
      language,
      versionIndex,
      stdin: input,
    });
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error running code:', error);
    res.status(500).json({ error: 'Error running code' });
  }
});

app.post('/api/credit-spent', async (req, res) => {
  const { clientId, clientSecret } = req.body;

  try {
    const response = await axios.post('https://api.jdoodle.com/v1/credit-spent', {
      clientId,
      clientSecret,
    });
    console.log(response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching credits:', error);
    res.status(500).json({ error: 'Error fetching credits' });
  }
});

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});

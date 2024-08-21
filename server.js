// npm i express cors axios dotenv

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3000;

app.use(cors());

app.get("/api/search", async (req, res) => {
    try {
        const { query, queryType, sort, start,maxResults} = req.query;
        console.log(req.query);
        const apiUrl = "https://www.aladin.co.kr/ttb/api/ItemSearch.aspx";
        const response = await axios.get(apiUrl, {
            params: {
                ttbkey: process.env.TTB_KEY,
                Query: query || "aladdin",
                QueryType: queryType || "Title",
                MaxResults: maxResults,
                start: start,
                Cover: "Big",
                sort: sort || "Accuracy",
                SearchTarget: "Book",
                output: "js",
                Version: "20131101",
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "An error occurred while fetching data from Aladin API" });
    }
});
app.get("/api/list", async (req, res) => {
    try {
        const {queryType,start,maxResults} = req.query;
        console.log(req.query);
        const apiUrl = "https://www.aladin.co.kr/ttb/api/ItemList.aspx";
        const response = await axios.get(apiUrl, {
            params: {
                ttbkey: process.env.TTB_KEY,
                QueryType: queryType || "Bestseller",
                SearchTarget: "Book",
                MaxResults: maxResults,
                Start: start,
                Output: "js",
                Cover: "Big",
                Version: "20131101",
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "An error occurred while fetching data from Aladin API" });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

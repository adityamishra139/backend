import express from "express";
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.get('/api/jokes', (req, res) => {
    const jokes = [
        {
            id: 1,
            title: "Why did the tomato turn red?",
            punchline: "Because it saw the salad dressing!"
        },
        {
            id: 2,
            title: "Why did the scarecrow win an award?",
            punchline: "Because he was outstanding in his field!"
        },
        {
            id: 3,
            title: "Why did the coffee file a police report?",
            punchline: "It got mugged!"
        },
        {
            id: 4,
            title: "Why did the cookie go to the doctor?",
            punchline: "Because it was feeling crumbly!"
        },
        {
            id: 5,
            title: "Why did the chicken cross the playground?",
            punchline: "To get to the other slide!"
        }
    ]

    res.json(jokes);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
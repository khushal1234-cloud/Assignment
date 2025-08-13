import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Track events
app.post("/events", async (req, res) => {
  try {
    const { username, event_type, details } = req.body;

    const { error } = await supabase
      .from("clickstream")
      .insert([{ username, event_type, details }]);

    if (error) throw error;

    res.status(200).json({ message: "Event logged" });
    console.log("Event received:", { username, event_type, details });
  } catch (error) {
    console.error("Error logging event:", error);
    res.status(500).json({ error: "Failed to log event" });
  }
});

app.get("/", (req, res) => {
  res.send("Clickstream API with Supabase is running");
});

// ----- Serve Vite frontend -----

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from client/dist
app.use(express.static(path.join(__dirname, "../client/dist")));

// Handle all other routes with index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// ----- Start Server -----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

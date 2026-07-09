import express from 'express';
import jobRoutes from './routes/job.routes.js';
import cors from 'cors';
import app from './app.js';


const PORT = process.env.PORT ?? 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,  
  })
);

app.use(express.json());

//  ON BRANCHE NOTRE DOSSIER ROUTES ICI
app.use('/api/jobs', jobRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Job Tracker API is running ",
  });
});

app.listen(PORT, () => {
  console.log(` Serveur démarré sur http://localhost:${PORT}`);
});
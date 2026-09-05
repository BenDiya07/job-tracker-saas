import app from './app.js';

const PORT = process.env.PORT ?? 5000;

app.get('/', (_req, res) => {
  res.json({ message: 'Job Tracker API is running' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
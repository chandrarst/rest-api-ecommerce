const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: "CONNECTION SUCCESS." });
});


app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
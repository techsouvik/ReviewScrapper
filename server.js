const express = require('express');
const reviewRoutes = require('./routes/reviewRoutes');
const { logger } = require('./utils/logger');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
  res.send('Welcome to the Reviews API!');
});

app.use('/api/reviews', reviewRoutes);


app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

const express = require('express');
const reviewRoutes = require('./routes/reviewRoutes');
const { logger } = require('./utils/logger');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use('/api/reviews', reviewRoutes);

app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

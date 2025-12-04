const dotenv = require('dotenv');
dotenv.config();
const { initializeDataSource } = require('./config/data-source');
const app = require('./app');

const PORT = process.env.PORT || 4000;

initializeDataSource()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize data source', err);
  });

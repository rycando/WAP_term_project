import dotenv from 'dotenv';
dotenv.config();
import { initializeDataSource } from './config/data-source';
import app from './app';

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

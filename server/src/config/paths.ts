import fs from 'fs';
import path from 'path';

// Resolve to the project-level uploads directory regardless of build output location.
export const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');

// Ensure the uploads directory exists so multer can write files without ENOENT errors.
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

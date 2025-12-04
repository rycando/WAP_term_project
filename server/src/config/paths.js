const fs = require('fs');
const path = require('path');

// Resolve to the project-level uploads directory regardless of build output location.
const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');

// Ensure the uploads directory exists so multer can write files without ENOENT errors.
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

module.exports = { uploadsDir };

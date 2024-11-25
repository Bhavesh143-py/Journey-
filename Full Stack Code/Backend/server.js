const express = require('express');
const app = express();
const routes = require('./routes/index'); // Import central routes index
require('dotenv').config();
app.use(express.json());
app.use(require('cors')()); // Enable CORS if needed
app.use('/api', routes); // Use the central router for all API routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

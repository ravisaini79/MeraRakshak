require('dotenv').config({ path: './server/.env' });
const app = require('./src/app');
const connectDB = async () => {
    const mongoose = require('mongoose');
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const PORT = process.env.PORT || 3000;

// Connect to Database
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

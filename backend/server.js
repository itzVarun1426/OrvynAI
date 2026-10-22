import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/db/db.js';

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("server running on the port :", PORT);
});

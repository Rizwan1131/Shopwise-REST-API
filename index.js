import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectWithDB from './config/db.js';
import userRoute from './routes/user.routes.js';
import productRoutes from './routes/product.route.js';
import cetegoryRoute from './routes/category.routes.js';
import fileUpload from 'express-fileupload';
import cartRoute from './routes/cart.routes.js';
import addressRoute from './routes/address.routes.js';


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use('/api/v1/auth', userRoute)
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/category', cetegoryRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/order', orderRoute)
app.use('/api/v1/adress', addressRoute)



const PORT = process.env.PORT || 4000

connectWithDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection failed:", error);
  });

import { cloudinaryConnect } from './config/cloudinary.js';
import orderRoute from './routes/order.routes.js';

cloudinaryConnect()



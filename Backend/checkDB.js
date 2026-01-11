import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const productSchema = new mongoose.Schema({}, { strict: false });
const Product = mongoose.model('Product', productSchema);

async function checkProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxenest');
        console.log('Connected to DB');

        const count = await Product.countDocuments();
        console.log(`Total products: ${count}`);

        const products = await Product.find().limit(5);
        console.log('Last 5 products:');
        products.forEach(p => {
            console.log(`- ${p.name} (ID: ${p._id}, Category: ${p.category}, Active: ${p.isActive})`);
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkProducts();

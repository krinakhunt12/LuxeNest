import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const categorySchema = new mongoose.Schema({
    name: String,
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const checkCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/luxenest');
        console.log('Connected to DB');

        const categories = await Category.find().sort({ name: 1 });
        console.log(`\nFound ${categories.length} categories:`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        categories.forEach(cat => {
            console.log(`📁 ${cat.name}`);
        });
        
        console.log('\nExpected categories from your Excel file:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📁 Living Room');
        console.log('📁 Bedroom');
        console.log('📁 Dining');
        console.log('📁 Office');
        console.log('📁 Outdoor');

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkCategories();

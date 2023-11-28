import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT =  3000;

// Enable CORS
app.use(cors());

// Middleware to parse JSON in request body
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://varadapatil123:4FH3RJp25kt4p1UC@cluster0.qqlsyvu.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(error => {
        console.error('Error connecting to MongoDB:', error.message);
    });

// Define a blog schema
const blogSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now }, 
});

// Create a Blog model
const Blog = mongoose.model('Blog', blogSchema);

// API endpoint to get all blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API endpoint to create a new blog
app.post('/api/blogs', async (req, res) => {
    const { title, content } = req.body;

    try {
        const newBlog = await Blog.create({ title, content });
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/blogs/:id', async (req, res) => {
    const blogId = req.params.id;

    try {
        const deletedBlog = await Blog.findByIdAndDelete(blogId);

        if (deletedBlog) {
            res.json({ message: 'Blog deleted successfully' });
        } else {
            res.status(404).json({ error: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Serve static files (like HTML, CSS, and JS)
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

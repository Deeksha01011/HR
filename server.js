const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const JobSeeker = require('./models/jobseeker');  // Import the JobSeeker model

const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'public/uploads/' });

mongoose.connect('mongodb://localhost:27017/yourhr', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected...');
}).catch(err => console.log(err));

app.post('/submit', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, phone, qualifications } = req.body;
        const resume_path = path.join('/uploads/', req.file.filename);

        const jobSeeker = new JobSeeker({ name, email, phone, qualifications, resume_path });
        await jobSeeker.save();

        res.send('Sign-up successful!');
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

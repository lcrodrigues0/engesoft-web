import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        service: 'engesoft-backend',
        message: 'It\'s working!'
    });
});

app.listen(3000, () => {
    console.log('Server running');
});
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { claimsRouter } from './routes/claims';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/claims', claimsRouter);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});
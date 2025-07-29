import express from 'express';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './auth';
import exportRouter from './export';
import proxyRouter from './proxy';
import ocrQueue from './queue';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/auth', authRouter);
app.use('/export', exportRouter);
app.use('/proxy', proxyRouter);

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded!' });
  }

  const { month, year, userId } = req.body;
  const statement = await prisma.statement.create({
    data: {
      month: parseInt(month),
      year: parseInt(year),
      userId,
    },
  });

  await ocrQueue.add('ocr', { filePath: req.file.path, statementId: statement.id });

  res.json({ message: 'File uploaded successfully! It will be processed in the background.' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

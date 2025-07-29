import { Queue, Worker } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import tesseract from 'node-tesseract-ocr';

const prisma = new PrismaClient();

const ocrQueue = new Queue('ocr');

const ocrWorker = new Worker('ocr', async (job) => {
  const { filePath, statementId } = job.data;
  const text = await tesseract.recognize(filePath);

  const lines = text.split('\n');
  for (const line of lines) {
    const [date, description, amount] = line.split(',');
    await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        amount: parseFloat(amount),
        category: 'Uncategorized',
        statementId,
      },
    });
  }
});

export default ocrQueue;

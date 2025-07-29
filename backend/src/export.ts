import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import excel from 'exceljs';

const prisma = new PrismaClient();
const router = Router();

router.get('/export/:statementId', async (req, res) => {
  const { statementId } = req.params;
  const transactions = await prisma.transaction.findMany({
    where: { statementId },
  });

  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet('Transactions');

  worksheet.columns = [
    { header: 'Date', key: 'date', width: 15 },
    { header: 'Description', key: 'description', width: 30 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Category', key: 'category', width: 15 },
  ];

  worksheet.addRows(transactions);

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=' + 'transactions.xlsx'
  );

  await workbook.xlsx.write(res);
  res.end();
});

export default router;

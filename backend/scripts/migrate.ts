const { exec } = require('child_process');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

const migrate = exec('npx prisma migrate dev --name init');

migrate.stdout?.on('data', (data: any) => {
  console.log(`stdout: ${data}`);
});

migrate.stderr?.on('data', (data: any) => {
  console.error(`stderr: ${data}`);
});

migrate.on('close', (code: any) => {
  console.log(`child process exited with code ${code}`);
});

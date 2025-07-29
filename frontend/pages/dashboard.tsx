import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import withAuth from '../components/withAuth';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:3001/statements', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const statements = response.data;
      const spendingByCategory = statements.reduce((acc: any, statement: any) => {
        statement.transactions.forEach((transaction: any) => {
          const category = transaction.category;
          const amount = transaction.amount;
          if (category && amount) {
            if (acc[category]) {
              acc[category] += amount;
            } else {
              acc[category] = amount;
            }
          }
        });
        return acc;
      }, {});

      const chartData = Object.keys(spendingByCategory).map(category => ({
        name: category,
        value: spendingByCategory[category],
      }));

      setData(chartData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default withAuth(Dashboard);

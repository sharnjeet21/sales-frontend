import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const SalesTable = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/sales-data');
        const fetchedData = response.data;
        console.log('Fetched Data:', fetchedData);
        setSalesData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);  // Ensure this useEffect runs only once by providing an empty dependency array

  const chartData = {
    labels: salesData.map(item => item.Category),
    datasets: [
      {
        label: 'Total Sales',
        data: salesData.map(item => item.TotalSales),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    
    <div className='flex flex-row'>
      {/* Render the chart only if sales data is available */}
      {salesData.length > 0 && (
        <div className="mx-auto my-9">
          <h2 className="text-2xl font-bold mb-4">Sales Chart</h2>
          <Bar
            data={chartData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
            height={400}
            width={800}
          />
        </div>
      )}

      {/* Render the sales data in a table */}
      <div className="max-w-4xl mx-auto my-8">
        <h2 className="text-2xl font-bold mb-4">Sales Data</h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Total Sales</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row.ProductName}</td>
                <td>{row.Category}</td>
                <td>{row.TotalSales}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;

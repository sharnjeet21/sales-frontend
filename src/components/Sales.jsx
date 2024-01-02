import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import {
  Card,
  CardBody,
} from "@material-tailwind/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const SalesTable = () => {
  const [salesData, setSalesData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState(null);
  const [lineChartData, setLineChartData] = useState(null);

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/monthly-sales-data');
        const fetchedMonthlyData = response.data;
        console.log('Fetched Monthly Sales Data:', fetchedMonthlyData);
        setMonthlySalesData(fetchedMonthlyData);

        // Prepare data for the line chart
        const groupedData = fetchedMonthlyData.reduce((acc, item) => {
          if (!acc[item.ProductName]) {
            acc[item.ProductName] = [];
          }
          acc[item.ProductName].push(item);
          return acc;
        }, {});

        const allMonths = Array.from(new Set(fetchedMonthlyData.map(item => item.Month)));
        const newData = {
          labels: allMonths,
          datasets: Object.keys(groupedData).map(productName => {
            const productData = groupedData[productName];
            const dataForProduct = allMonths.map(month => {
              const monthData = productData.find(item => item.Month === month);
              return monthData ? monthData.QuantitiesSold : 0;
            });

            return {
              label: productName,
              data: dataForProduct,
              fill: false,
              borderColor: getRandomColor(),
              borderWidth: 2,
            };
          }),
        };

        setLineChartData(newData);
      } catch (error) {
        console.error('Error fetching monthly sales data:', error);
      }
    };

    fetchData();
  }, []);

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
  }, []);

  const chartData = {
    labels: salesData.map(item => item.ProductName),
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

  const categorySalesMap = new Map();
  salesData.forEach((item) => {
    const category = item.Category;
    const totalSales = item.TotalSales;

    if (categorySalesMap.has(category)) {
      categorySalesMap.set(category, categorySalesMap.get(category) + totalSales);
    } else {
      categorySalesMap.set(category, totalSales);
    }
  });

  const doughnutData = {
    labels: Array.from(categorySalesMap.keys()),
    datasets: [
      {
        data: Array.from(categorySalesMap.values()),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topProducts = [...salesData].sort((a, b) => b.TotalSales - a.TotalSales).slice(0, 5);

  return (
    <div className='flex flex-row'>
      <Card className="mt-6 w-96">
        <CardBody>
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
        </CardBody>
      </Card>
      <Card className="mt-6 w-96">
        <CardBody>
          {salesData.length > 0 && (
            <div className="mx-auto my-9">
              <h2 className="text-2xl font-bold mb-4">Sales Chart</h2>
              <Doughnut data={doughnutData} height={400} width={800} />
            </div>
          )}
        </CardBody>
      </Card>
      <Card className="mt-6 flex-grow">
        <CardBody>
          {monthlySalesData && (
            <div className="mx-auto my-9">
              <h2 className="text-2xl font-bold mb-4">Monthly Sales Chart</h2>
              <Line
                data={lineChartData}
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
        </CardBody>
      </Card>
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
            {topProducts.map((row, rowIndex) => (
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

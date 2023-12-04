import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const StackedBarChart = ({ data }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (data && data.length > 0) {
      // Extract unique header categories
      const headerCategories = [...new Set(data.map((item) => item.header))];
      // Initialize datasets for the chart
      const datasets = headerCategories.map((category) => ({
        label: category,
        data: [],
        backgroundColor: [],
      }));

      // Populate datasets with progress data
      data.forEach((item) => {
        const datasetIndex = headerCategories.indexOf(item.header);
        datasets[datasetIndex].data.push(parseFloat(item.progress) * 100); // Progress as a percentage
        datasets[datasetIndex].backgroundColor.push(getRandomColor()); // Generate random colors
      });

      // Create the chart data
      setChartData({
        labels: data.map((item) => item.id), // You can use a unique identifier as labels
        datasets,
      });
    }
  }, [data]);

  // Function to generate random colors
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      <h2>Stacked Bar Chart: Task Progress by Header Category</h2>
      <Bar
        data={chartData}
        options={{
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              ticks: {
                beginAtZero: true,
                max: 100, // Assuming progress is a percentage
                callback: (value) => `${value}%`,
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
          },
        }}
      />
    </div>
  );
};

export default StackedBarChart;

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register the chart.js components we're going to use:
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ data }) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  
  useEffect(() => {
    prepareChartData(data);
  }, [data]);

  const prepareChartData = (data) => {
    // Count the number of tasks by completion status
    const completed = data.filter(task => task.progress === 1.0).length;
    const inProgress = data.filter(task => task.progress > 0 && task.progress < 1.0).length;
    const notStarted = data.filter(task => task.progress === null).length;

    setChartData({
      labels: ['Completed', 'In Progress', 'Not Started'],
      datasets: [
        {
          data: [completed, inProgress, notStarted],
          backgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
          hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#FF6384'],
        },
      ],
    });
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      position: 'bottom',
    },
  };

  const chartSize = {
    width: '340px',  // Width of the chart
    height: '340px', // Height of the chart
  };

  return (
    <div style={{ width: chartSize.width, height: chartSize.height }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChartComponent;

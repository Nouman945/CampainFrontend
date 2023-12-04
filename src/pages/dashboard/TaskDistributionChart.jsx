import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TaskDistributionChart = () => {
  const [taskCounts, setTaskCounts] = useState({});
  const [selectedFileId, setSelectedFileId] = useState(null);

  useEffect(() => {
    const selectedFileId = localStorage.getItem('selectedFileId');
    setSelectedFileId(selectedFileId);
    console.log(selectedFileId);
    
    fetch(`http://127.0.0.1:8000/file-data/${selectedFileId}/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const newTaskCounts = {};
        data.forEach(item => {
          const header = item['header'];
          newTaskCounts[header] = (newTaskCounts[header] || 0) + 1;
        });
        setTaskCounts(newTaskCounts);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [selectedFileId]);

  const chartData = {
    labels: Object.keys(taskCounts),
    datasets: [
      {
        label: 'Number of Tasks',
        data: Object.values(taskCounts),
        backgroundColor: 'skyblue',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Distribution by Category',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Category',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Tasks',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default TaskDistributionChart;

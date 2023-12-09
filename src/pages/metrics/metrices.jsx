import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Card from '@/components/ui/Card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const MetricsComponent = () => {
  const [metrics, setMetrics] = useState({});


  useEffect(() => {
    // Fetch data only if metrics is empty
    if (Object.keys(metrics).length === 0) {
      fetch('https://django-apis-0a980656a9f1.herokuapp.com/metrics/')
        .then((response) => response.json())
        .then((data) => {
          setMetrics(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  }, [metrics]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Metrics Over Time',
      },
    },
  };

  const createChartData = (metricKey, chartType = 'line') => {
    const chartData = {
      labels: Object.keys(metrics[metricKey]),
      datasets: [
        {
          label: metricKey,
          data: Object.values(metrics[metricKey]),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: chartType === 'line' ? 'rgba(75, 192, 192, 0.5)' : 'rgba(75, 192, 192, 1)',
        },
      ],
    };

    if (chartType === 'bar') {
      chartData.datasets[0].backgroundColor = '#7B68EE';
    } else if (chartType === 'pie') {
      chartData.datasets[0].backgroundColor = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ];
    }
    return chartData;
  };



  return (
    <div className="grid xl:grid-cols-3 grid-cols-1 gap-5">
      {Object.keys(metrics).length === 0 ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Total Bookings - Line Chart */}
          <Card title="Total Bookings">
            <Line options={chartOptions} data={createChartData('Total Bookings')} />
          </Card>

          {/* Average Deal Size - Line Chart */}
          <Card title="Average Deal Size">
            <Line options={chartOptions} data={createChartData('Average Deal Size')} />
          </Card>

          {/* Average Months Paid Upfront - Bar Chart */}
          <Card title="Average Months Paid Upfront">
            <Bar options={chartOptions} data={createChartData('Average Months Paid Upfront', 'bar')} />
          </Card>

          {/* Average ARPA for New Customers - Line Chart */}
          <Card title="Average ARPA for New Customers">
            <Line options={chartOptions} data={createChartData('Average ARPA for New Customers')} />
          </Card>

          {/* Average ARPA Across Installed Base - Line Chart */}
          <Card title="Average ARPA Across Installed Base">
            <Line options={chartOptions} data={createChartData('Average ARPA Across Installed Base')} />
          </Card>

          {/* Average Gross Margin % - Pie Chart */}
          <Card title="Average Gross Margin %">
            <Pie options={chartOptions} data={createChartData('Average Gross Margin %', 'pie')} />
          </Card>

          {/* Average Total Expenses - Bar Chart */}
          <Card title="Average Total Expenses">
            <Bar options={chartOptions} data={createChartData('Average Total Expenses', 'bar')} />
          </Card>

          {/* Average Customer Engagement Score - Line Chart */}
          <Card title="Average Customer Engagement Score">
            <h2></h2>
            <Line options={chartOptions} data={createChartData('Average Customer Engagement Score')} />
          </Card>

          {/* Average Net Promoter Score - Line Chart */}
          <Card title="Average Net Promoter Score">
            <Line options={chartOptions} data={createChartData('Average Net Promoter Score')} />
          </Card>

          {/* Average LTV - Line Chart */}
          <Card title="Average LTV">
            <Line options={chartOptions} data={createChartData('Average LTV')} />
          </Card>

          {/* Average CAC - Bar Chart */}
          <Card title="Average CAC">
            <Bar options={chartOptions} data={createChartData('Average CAC', 'bar')} />
          </Card>

          {/* Average LTV to CAC Ratio - Bar Chart */}
          <Card title="Average LTV to CAC Ratio">
            <Bar options={chartOptions} data={createChartData('Average LTV to CAC Ratio', 'bar')} />
          </Card>

          {/* Average Months to Recover CAC - Line Chart */}
          {/* <Card title="Average Months to Recover CAC">
        <Line options={chartOptions} data={createChartData('Average Months to Recover CAC')} />
      </Card> */}
        </>
      )}
    </div>
  );
};

export default MetricsComponent;

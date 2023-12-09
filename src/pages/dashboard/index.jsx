import React, { useState, useEffect } from 'react';
import PieChartComponent from './PieChartComponent';
import GanttChartComponent from './GanttChartComponent';
import StackedBarChart from './StackedBarChart';
import Card from '@/components/ui/Card';
import TaskDistributionChart from './TaskDistributionChart';
import MetricsComponent from '../metrics/metrices';

const App = () => {
  const [data, setData] = useState([]);
  const [selectedFileId, setSelectedFileId] = useState(null);
  useEffect(() => {
    // Here you would fetch and load your data into the table
    const selectedFileId = localStorage.getItem('selectedFileId');
    setSelectedFileId(selectedFileId);
    console.log(selectedFileId);
    const fetchData = async () => {
      // You would replace this with your actual API call
      const response = await fetch(`https://django-apis-0a980656a9f1.herokuapp.com/tasks/?file_id=${selectedFileId}`);
      const jsonData = await response.json();
      console.log(jsonData);
      setData(jsonData);
    };

    fetchData();

  }, [selectedFileId]);
  const chartContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  };
  return (
    <>

      <div className="space-y-5">
        <MetricsComponent />

        <div className="grid grid-cols-1 xl:grid-cols-10 gap-5">
          {/* First component occupying 4 out of 10 columns (40%) on xl screens */}
          <div className="xl:col-span-4 col-span-1">
            <Card title="Task Completion Comparison">
              <div style={chartContainerStyle}>
                <PieChartComponent data={data} />
              </div>
            </Card>
          </div>
          {/* Second component occupying 6 out of 10 columns (60%) on xl screens */}
          <div className="xl:col-span-6 col-span-1">
            <Card title="Task Distribution by Category">
              <TaskDistributionChart data={data} />
            </Card>
          </div>
        </div>
      </div>
      <br />
      <div className=" space-y-5">

        <Card title="Gannt Chart">
          <GanttChartComponent data={data} />
        </Card>
      </div>
    </>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import { DatePicker } from 'antd';

const GanttChartComponent = ({ data }) => {
  const [tasks, setTasks] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    setTasks(data);
  }, [data]);

  useEffect(() => {
    const filterTasks = (task) => {
      const requiredFields = ['start_date', 'end_date', 'task_name', 'progress'];
      return requiredFields.every(field => task[field] !== null && task[field] !== undefined);
    };

    const mapTasksToChartData = (task) => ([
      task.id.toString(),
      task.task_name,
      task.task_name,
      new Date(task.start_date),
      new Date(task.end_date),
      null,
      task.progress * 100,
      null,
    ]);

    const filteredAndMappedTasks = tasks
      .filter(filterTasks)
      .filter(task => {
        if (startDate && endDate) {
          const taskStartDate = new Date(task.start_date);
          const taskEndDate = new Date(task.end_date);
          return taskStartDate >= startDate && taskEndDate <= endDate;
        }
        return true;
      })
      .map(mapTasksToChartData);

    const chartHeaders = [
      { type: 'string', label: 'Task ID' },
      { type: 'string', label: 'Task Name' },
      { type: 'string', label: 'Resource' },
      { type: 'date', label: 'Start Date' },
      { type: 'date', label: 'End Date' },
      { type: 'number', label: 'Duration' },
      { type: 'number', label: 'Percent Complete' },
      { type: 'string', label: 'Dependencies' },
    ];

    setChartData([chartHeaders, ...filteredAndMappedTasks]);
    console.log([chartHeaders, ...filteredAndMappedTasks])
  }, [tasks, startDate, endDate]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <div style={{ overflowX: 'auto', overflowY: 'hidden' }}>
      <div style={{ display: 'flex', marginLeft:'55%' }} className="mb-5">
        <div style={{ marginRight: '16px' }}>
          <label htmlFor="startDate" className="mr-5">Start Date:</label>
          <DatePicker onChange={handleStartDateChange} />
        </div>
        <div>
          <label htmlFor="endDate" className="mr-5">End Date:</label>
          <DatePicker onChange={handleEndDateChange} />
        </div>
      </div>
      {chartData.length > 1 ? (
        <Chart
          width={'100%'}
          chartType="Gantt"
          loader={<div>Loading Chart...</div>}
          data={chartData}
          options={{
            gantt: {
              trackHeight: 35,
            },
            hAxis: {
              format: 'yyyy-MM-dd',
            },
            vAxis: {
              textStyle: { fontSize: 10 }
            },
            height: chartData.length * 41,
          }}
        />
      ) : (
        <div>No data available for the Gantt chart.</div>
      )}
    </div>
  );
};

export default GanttChartComponent;

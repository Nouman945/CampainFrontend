import React, { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'antd';
import Card from '@/components/ui/Card';
import { Bar } from 'react-chartjs-2';

// Import Chart.js components
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Chart,
} from 'chart.js';


// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CampaignDataDashboard() {
  const [data, setData] = useState([]);
  const [tablesData, setTablesData] = useState({});
  const [chartData, setChartData] = useState(null);
  const [chartVisible, setChartVisible] = useState(false);
  const [currentTableData, setCurrentTableData] = useState([]);

  const [selectedFileId, setSelectedFileId] = useState(null);
  
  useEffect(() => {
    const selectedFileId = localStorage.getItem('selectedFileId');
    setSelectedFileId(selectedFileId);
    fetchData();
  }, [selectedFileId]);

  const fetchData = async () => {
    try {
      const response = await fetch(`https://django-apis-0a980656a9f1.herokuapp.com/ campaign-data/by-file-upload/${selectedFileId}/`);
      const jsonData = await response.json();
      setData(jsonData);

      // Group data by unique and table_for fields
      const groupedData = {};
      jsonData.forEach((item) => {
        const uniqueKey = item.unique;
        const tableForKey = item.table_for;

        if (!groupedData[uniqueKey]) {
          groupedData[uniqueKey] = {};
        }

        if (!groupedData[uniqueKey][tableForKey]) {
          groupedData[uniqueKey][tableForKey] = [];
        }

        groupedData[uniqueKey][tableForKey].push(item);
      });

      setTablesData(groupedData);
    } catch (error) {
      console.error('Error fetching campaign data:', error);
    }
  };

  const showTableChart = (tableData) => {
    setCurrentTableData(tableData);
    openChartPopup(tableData[0]); // Assuming the subtotal data is in the first row of the table
  };

  const openChartPopup = (subtotalData) => {
    const chartData = {
      labels: ['Projected Cost', 'Actual Cost', 'Difference'],
      datasets: [
        {
          label: 'Subtotal',
          data: [
            parseFloat(subtotalData.projected_cost) || 0,
            parseFloat(subtotalData.actual_cost) || 0,
            parseFloat(subtotalData.difference) || 0,
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(53, 162, 235, 0.5)',
            'rgba(75, 192, 192, 0.5)',
          ],
        },
      ],
    };

    setChartData(chartData);
    setChartVisible(true);
  };

  const closeChartPopup = () => {
    setChartVisible(false);
  };

  const renderTables = () => {
    return Object.keys(tablesData).map((uniqueField) => {
      const tableData = tablesData[uniqueField];

      return Object.keys(tableData).map((tableForField) => {
        const filteredData = tableData[tableForField];
        let headerColorStyle = {};

        if (tableForField === 'KSA Campaign') {
          headerColorStyle = { backgroundColor: 'green', color: 'white' };
        } else if (tableForField === 'Dubai Campaign') {
          headerColorStyle = { backgroundColor: 'red', color: 'white' };
        }

        return (
          <div key={`${uniqueField}-${tableForField}`}>
            <Card title={`Table for ${uniqueField} - ${tableForField}`}>
              <Table
                dataSource={filteredData}
                columns={[
                  {
                    title: 'Category',
                    dataIndex: 'category',
                    key: 'category',
                  },
                  {
                    title: 'Projected Cost',
                    dataIndex: 'projected_cost',
                    key: 'projected_cost',
                  },
                  {
                    title: 'Actual Cost',
                    dataIndex: 'actual_cost',
                    key: 'actual_cost',
                  },
                  {
                    title: 'Difference',
                    dataIndex: 'difference',
                    key: 'difference',
                  },
                ]}
                pagination={false}
                components={{
                  header: {
                    row: (props) => <tr {...props} style={headerColorStyle} />,
                  },
                }}
              />
                <Button onClick={() => showTableChart(filteredData)} style={{ marginTop: 20 }}> Show Chart</Button>
            </Card>
            <br />
            <br />
          </div>
        );
      });
    });
  };

  return (
    <div>
      {renderTables()}
      <Modal
        title="Subtotal Bar Chart"
        visible={chartVisible}
        onCancel={closeChartPopup}
        footer={null}
      >
        {chartData && (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Amount',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Category',
                  },
                },
              },
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export default CampaignDataDashboard;

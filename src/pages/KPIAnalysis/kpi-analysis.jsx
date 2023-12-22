import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import "./customStyles.css";
import ApiDisplay from './gemini';

function CustomTick({ x, y, payload }) {
    const currentDate = new Date();
    const threeMonthsAgo = new Date(currentDate.setMonth(currentDate.getMonth() - 3));
    const tickDate = new Date(payload.value);


    const isLastThreeMonths = tickDate >= threeMonthsAgo;

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} fill={isLastThreeMonths ? 'red' : 'black'} textAnchor="middle">
                {payload.value}
            </text>
        </g>
    );
}

function ForecastModal({ isVisible, data, onClose }) {
    // Format the data for the chart
    const formattedData = data ? data.dates.map((date, index) => ({
        date: date,
        value: parseFloat(data.values[index])
    })) : [];

    return (
        <Card>
            <Modal
                title="AI Forecast Data"
                visible={isVisible}
                onCancel={onClose}
                footer={null}
                width={700}
            >
                <br />
                <LineChart width={600} height={300} data={formattedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={<CustomTick />} />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                </LineChart>
            </Modal>
        </Card>
    );
}


function TableNames() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [forecastData, setForecastData] = useState(null);
    const [isForecastModalVisible, setIsForecastModalVisible] = useState(false);
    const [isApiDisplayVisible, setIsApiDisplayVisible] = useState(false); // Add this state variable

    useEffect(() => {
        fetch('https://django-apis-0a980656a9f1.herokuapp.com/get-table-names/')
            .then(response => response.json())
            .then(data => {
                setTables(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setLoading(false);
            });
    }, []);

    const handleForecastModalCancel = () => {
        setIsForecastModalVisible(false);
    };

    // Function to open the API Display popup
    const openApiDisplay = () => {
        setIsApiDisplayVisible(true);
    };

    // Function to close the API Display popup
    const closeApiDisplay = () => {
        setIsApiDisplayVisible(false);
    };



    const handleAnalyze = (record) => {
        const requestData = {
            months: record.cols,
            bookings: record.rows.flat()
        };

        fetch('https://django-apis-0a980656a9f1.herokuapp.com/forecast-months/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => response.json())
            .then(data => {
                console.log("forecastData", data);
                console.log("requestData", requestData);

                // Combine the forecast and actual data
                const combinedData = {
                    dates: [...requestData.months, ...data.dates],
                    values: [...requestData.bookings, ...data.values]
                };

                console.log("Combined Data", combinedData);

                // Use combinedData as needed, e.g., 
                setForecastData(combinedData);
                setIsForecastModalVisible(true);
            })
            .catch(error => {
                console.error('Error fetching forecast data:', error);
            });
    };


    const renderTable = (tableData, tableName) => {
        let columnWidth = 100 / (tableData.cols.length + 1); // +1 for the action column

        const columns = tableData.cols.map((col, index) => ({
            title: col,
            dataIndex: index.toString(),
            key: index.toString(),
            width: `${columnWidth}%`,
        }));

        const actionButtonContainerStyle = {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
        };

        columns.push({
            title: 'Actions',
            key: 'actions',
            width: `${columnWidth}%`,
            render: (text, record) => (
                <div style={actionButtonContainerStyle}>
                    <Button
                        onClick={() => handleAnalyze(tableData)}
                        style={{ marginRight: 8, backgroundColor: 'green', color: 'white' }}
                    >
                        Analyze
                    </Button>
                </div>
            ),
        });

        const formatCell = (cell) => {
            if (/^\d+\.\d+$/.test(cell)) {
                return parseFloat(cell).toFixed(3);
            }
            return cell;
        };

        const dataSource = tableData.rows.map((row, index) => {
            const rowData = { key: index.toString() };
            row.forEach((cell, cellIndex) => {
                rowData[cellIndex.toString()] = formatCell(cell);
            });
            return rowData;
        });

        return (
            <Table columns={columns} dataSource={dataSource} pagination={true} />
        );
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            {/* Button to open ApiDisplay */}
            {/* <Button  className='btn btn-primary'>
                AI Insights */}
            {/* </Button> */}

            <Button
                onClick={openApiDisplay}
                style={{ marginRight: 8, backgroundColor: 'blue', color: 'white' }}
            >
                Perform AI Insights
            </Button>

            <br />
            <br />

            <div className="row">
                {Object.entries(tables).map(([name, data], index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <Card title={name} bordered={false}>
                            {renderTable(data, name)}
                        </Card>
                    </div>
                ))}
            </div>

            {/* Render the ForecastModal */}
            <ForecastModal
                isVisible={isForecastModalVisible}
                data={forecastData}
                onClose={handleForecastModalCancel}
            />

            {/* Render the ApiDisplay within a Modal */}
            <Modal
                visible={isApiDisplayVisible}
                onCancel={closeApiDisplay}
                footer={null}
                width={700}
            >
                <ApiDisplay /> {/* Render the ApiDisplay component */}
            </Modal>

        </div>
    );
}

export default TableNames;

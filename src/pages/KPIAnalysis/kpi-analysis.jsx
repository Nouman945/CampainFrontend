import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Modal } from 'antd';
import "./customStyles.css";

function ForecastModal({ isVisible, data, onClose }) {
    return (
        <Modal
            title="AI Forecast Data"
            visible={isVisible}
            onCancel={onClose}
            footer={null}
        >
            <div className="forecast-container">
                <div className="forecast-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.dates.map((date, index) => (
                                <tr key={index}>
                                    <td>{date}</td>
                                    <td>{data.values[index]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
}

function TableNames() {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [forecastData, setForecastData] = useState(null);
    const [isForecastModalVisible, setIsForecastModalVisible] = useState(false);

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

    const showForecastModal = () => {
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setForecastData(null);
    };

    const handleForecastModalCancel = () => {
        setIsForecastModalVisible(false);
    };

    const handleAnalyze = (record) => {
        const requestData = { 
            months: record.cols, 
            bookings: record.rows.flat()  // Assuming record contains months and bookings
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
            setForecastData(data.forecast);
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
                    {/* <Button 
                        onClick={() => console.log('Edit', record)} 
                        style={{ marginRight: 8, backgroundColor: 'blue', color: 'white' }}
                    >
                        Edit
                    </Button>
                    <Button 
                        onClick={() => console.log('Delete', record)} 
                        style={{ backgroundColor: 'red', color: 'white' }}
                        danger
                    >
                        Delete
                    </Button> */}
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
        </div>
    );
}

export default TableNames;

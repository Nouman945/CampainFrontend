import React, { useState, useEffect } from "react";
import { Table, Input, Button, Popover, Form, DatePicker } from "antd";

const { RangePicker } = DatePicker;

function DataTableView() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchDate, setSearchDate] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({});
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  useEffect(() => {
    // Fetch data from the API
    const selectedFileId = localStorage.getItem('selectedFileId');
    setSelectedFileId(selectedFileId);
    console.log(selectedFileId);
    fetch(`https://django-apis-0a980656a9f1.herokuapp.com/ file-data/${selectedFileId}/`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [selectedFileId]);

  // Define columns for the Antd Table
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Header", dataIndex: "header", key: "header" },
    { title: "Task Name", dataIndex: "task_name", key: "task_name" },
    { title: "Assigned To", dataIndex: "assigned_to", key: "assigned_to" },
    { title: "Contact Person", dataIndex: "contact_person", key: "contact_person" },
    { title: "Progress", dataIndex: "progress", key: "progress" },
    { title: "Start Date", dataIndex: "start_date", key: "start_date" },
    { title: "End Date", dataIndex: "end_date", key: "end_date" },
    { title: "File Upload", dataIndex: "file_upload", key: "file_upload" },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Popover
          content={
            <Form
              onFinish={(values) => handleUpdate(record.id, values)}
              initialValues={updateFormData}
            >
              <Form.Item
                label="Progress"
                name="progress"
                rules={[{ required: true, message: "Please enter progress" }]}
              >
                <Input />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form>
          }
          title="Update Progress"
          visible={isPopoverVisible}
          onVisibleChange={(visible) => setIsPopoverVisible(visible)}
          trigger="click"
        >
          <Button type="primary">Edit</Button>
        </Popover>
      ),
    },
  ];

  // Function to filter data by date
  const handleDateSearch = (date, dateString) => {
    setSearchDate(dateString);
    if (dateString) {
      const filtered = data.filter(
        (item) =>
          item.start_date <= dateString[1] && item.end_date >= dateString[0]
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  };

  // Function to update progress
  const handleUpdate = (id, values) => {
    fetch(`https://django-apis-0a980656a9f1.herokuapp.com/ task-update/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((updatedData) => {
        // Update the data in the table
        const updatedIndex = data.findIndex((item) => item.id === id);
        const newData = [...data];
        newData[updatedIndex] = { ...newData[updatedIndex], ...updatedData };
        setData(newData);
        setIsPopoverVisible(false);
      })
      .catch((error) => console.error("Error updating data: ", error));
  };

  return (
    <div className="App">
      <h1>Table from API Data (Antd)</h1>
      <div style={{ marginBottom: 16 }}>
        <RangePicker onChange={handleDateSearch} />
      </div>
      <Table dataSource={filteredData} columns={columns} />
    </div>
  );
}

export default DataTableView;

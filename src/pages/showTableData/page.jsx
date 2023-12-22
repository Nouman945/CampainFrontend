import React, { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, Button, DatePicker, Select, Popconfirm, notification } from 'antd';
import axios from 'axios';
import Card from '@/components/ui/Card';
import moment from 'moment';

const { Option } = Select;

const TaskTable = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [form] = Form.useForm();
  const [selectedFileId, setSelectedFileId] = useState(null);


  const fetchData = async (fileId) => {
    try {
      const response = await fetch(`https://django-apis-0a980656a9f1.herokuapp.com/tasks/?file_id=${fileId}`);
      const jsonData = await response.json();
      setTasks(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  

  useEffect(() => {
    const selectedFileId = localStorage.getItem('selectedFileId');
    setSelectedFileId(selectedFileId);
    console.log(selectedFileId);
    if(selectedFileId){
      fetchData(selectedFileId);
    }
  }, [selectedFileId]);


  const showEditModal = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      start_date: moment(task.start_date),
      end_date: moment(task.end_date),
    });
    setIsModalVisible(true);
  };

  const handleUpdate = async (values) => {
    try {
      // Optimistic update: Update the state immediately before making the API call
      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex((task) => task.id === editingTask.id);
  
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = { ...editingTask, ...values };
        setTasks(updatedTasks);
      }
  
      // Make the API call
      await axios.put(`https://django-apis-0a980656a9f1.herokuapp.com/tasks/${editingTask.id}/`, {
        ...values,
        start_date: values.start_date.format('YYYY-MM-DD'),
        end_date: values.end_date.format('YYYY-MM-DD'),
        file_upload: editingTask.file_upload,
      });
  
      // Close the modal and reset the form
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      // Revert the state if the API call fails
      setTasks([...tasks]);
      notification.error({ message: 'There was an error updating the task.' });
    }
  };
  const handleDelete = async (taskId) => {
    try {
      // Optimistic update: Update the state immediately before making the API call
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
  
      // Make the API call
      await axios.delete(`https://django-apis-0a980656a9f1.herokuapp.com/tasks/${taskId}/`);
  
      notification.success({ message: 'Task deleted successfully!' });
    } catch (error) {
      // Revert the state if the API call fails
      setTasks([...tasks]);
      notification.error({ message: 'There was an error deleting the task.' });
    }
  };

  const columns = [
    {
      title: 'Task Name',
      dataIndex: 'task_name',
      key: 'task_name',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assigned_to',
      key: 'assigned_to',
    },
    {
      title: 'Contact Person',
      dataIndex: 'contact_person',
      key: 'contact_person',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: progress => `${progress * 100}%`
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      render: date => date ? moment(date).format('YYYY-MM-DD') : 'N/A'
    },
    {
      title: 'End Date',
      dataIndex: 'end_date',
      key: 'end_date',
      render: date => date ? moment(date).format('YYYY-MM-DD') : 'N/A'
    },
    {
      title: 'Urgency',
      dataIndex: 'urgency',
      key: 'urgency',
      render: (urgency, record) => {
        const urgencyColors = {
          high: 'red',
          medium: 'yellow',
          low: 'green',
        };
    
        // Function to handle urgency change and potentially other actions
        const onUrgencyChange = (value) => {
          // Here you can handle the urgency change, e.g., send a request to the server
          handleUrgencyChange(value, record.id);
          // ... other actions
        };
    
        return (
          <Select
            defaultValue={urgency}
            style={{
              width: 120,
              backgroundColor: urgencyColors[urgency],
              color: urgency === 'medium' ? 'black' : 'white', // Ensuring text is readable on yellow
            }}
            onChange={onUrgencyChange}
          >
            <Option value="high">High</Option>
            <Option value="medium">Medium</Option>
            <Option value="low">Low</Option>
          </Select>
        );
      },
    },    

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <Button onClick={() => showEditModal(record)} style={{ marginRight: 8 }} >Edit</Button>
          <Button onClick={() => handleDelete(record.id)} danger>Delete</Button>
        </>
      ),
    },
  ];
  

  const handleUrgencyChange = async (urgency, taskId) => {
    try {
      // Optimistic update: Update the state immediately before making the API call
      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex((task) => task.id === taskId);
  
      if (taskIndex !== -1) {
        updatedTasks[taskIndex].urgency = urgency;
        setTasks(updatedTasks);
      }
  
      // Make the API call
      await axios.patch(`https://django-apis-0a980656a9f1.herokuapp.com/tasks/${taskId}/`, { urgency });
  
      notification.success({ message: 'Urgency updated successfully!' });
    } catch (error) {
      // Revert the state if the API call fails
      setTasks([...tasks]);
      notification.error({ message: 'There was an error updating the urgency.' });
    }
  };
  

  return (
    <Card title="Schedule Tasks">
      <Table dataSource={tasks} columns={columns} rowKey="id"/>
        <Modal title="Edit Task" open={isModalVisible} onOk={form.submit} onCancel={() => setIsModalVisible(false)} >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item name="task_name" label="Task Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="assigned_to" label="Assigned To">
            <Input />
          </Form.Item>
          <Form.Item name="contact_person" label="Contact Person">
            <Input />
          </Form.Item>
          <Form.Item name="progress" label="Progress">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="start_date" label="Start Date">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="end_date" label="End Date">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="urgency" label="Urgency" rules={[{ required: true }]}>
            <Select>
              <Option value="high">High</Option>
              <Option value="medium">Medium</Option>
              <Option value="low">Low</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

    </Card>
  );
};

export default TaskTable;

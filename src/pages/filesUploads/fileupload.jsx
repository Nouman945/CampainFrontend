import React, { useState, useEffect } from 'react';
import Card from "@/components/ui/Card";
import Fileinput from '@/components/ui/Fileinput';
import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function FileUploadComponent() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [recentFiles, setRecentFiles] = useState([]);
  const navigateTo = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const response = await fetch('https://django-apis-0a980656a9f1.herokuapp.com/upload/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.status === 201) {
        setMessage('File uploaded successfully.');
        fetchRecentFiles(); // Refresh the list of recent files after upload
      } else {
        setMessage(result.error || 'An error occurred during file upload.');
      }
    } catch (error) {
      console.log(error);
      setMessage('An error occurred during file upload.');
    } finally {
      setUploading(false);
      setFile(null); // Reset the selected file
    }
  };

  const fetchRecentFiles = async () => {
    try {
      const response = await fetch('https://django-apis-0a980656a9f1.herokuapp.com/recent-files/');
      const data = await response.json();

      // Extract the filename from the URL
      const recentFilesWithFilename = data.map((file) => {
        const urlParts = file.file.split('/');
        const filename = urlParts[urlParts.length - 1].split('_')[0]; // Extract the part before the underscore
        return { ...file, filename };
      });

      setRecentFiles(recentFilesWithFilename);
    } catch (error) {
      console.error('Error fetching recent files:', error);
    }
  };

  useEffect(() => {
    fetchRecentFiles();
  }, []);

  const columns = [
    {
      title: 'File ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Filename',
      dataIndex: 'filename', // Use the filename property here
      key: 'filename',
    },
    {
      title: 'Uploaded At',
      dataIndex: 'uploaded_at',
      key: 'uploaded_at',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <Button onClick={() => handleAnalyzeClick(record.id)} style={{ marginRight: 8 }}>Analyze</Button>
        // <Button
        //   type="primary"
        //   onClick={() => handleAnalyzeClick(record.id)}
        // >
        //   Analyze
        // </Button>
      ),
    },
  ];

  const handleAnalyzeClick = (fileId) => {
    localStorage.setItem('selectedFileId', fileId);
    navigateTo('/dashboard');

    // Redirect or perform any other action as needed
  };

  return (
    <div>
      <Card title="Upload Your Excel Sheet here">
        <Fileinput
          label="Browse"
          placeholder="Choose File"
          name="file"
          selectedFile={file}
          onChange={handleFileChange}
        />
        <br />
        {message && <p>{message}</p>}
        <br />
        {/* Submit button */}
        <button type="submit" className='btn btn-primary' onClick={handleSubmit} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </Card>

      <br />

      <Card title="Recent Uploaded Files">
        <Table
          dataSource={recentFiles}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
}

export default FileUploadComponent;

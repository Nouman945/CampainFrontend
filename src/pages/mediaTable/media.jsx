import React, { useEffect, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import Card from '@/components/ui/Card';

import "./custom.scss"

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFileId, setSelectedFileId] = useState(null);

  useEffect(() => {
    const selectedFileId = localStorage.getItem('selectedFileId');
    setSelectedFileId(selectedFileId);
    console.log(selectedFileId);

    // Fetch the data from your API endpoint here
    if(selectedFileId){
      fetch(`https://django-apis-0a980656a9f1.herokuapp.com/ media/recent-files/${selectedFileId}/`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
    }
    
  }, [selectedFileId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Check if data is available
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Assuming there is only one item in the response array
  const tableData = data[0];

  return (
    <Card title="Media Table">
      {tableData.html_content && (
        <div>{ReactHtmlParser(tableData.html_content)}</div>
      )}
    </Card>
  );
};

export default TableComponent;

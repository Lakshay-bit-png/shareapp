import React, { useState } from 'react';

const SSETest = () => {
    const [folderName, setFolderName] = useState(''); // State to store input folder name
    const [data, setData] = useState([]); // State to store received data
    const [isConnected, setIsConnected] = useState(false); // State to track SSE connection
    const [error, setError] = useState(null); // State for error messages

    const startSSE = () => {
        if (!folderName.trim()) {
            setError('Folder name cannot be blank'); // Show error if input is blank
            return;
        }
        setError(null); // Clear any previous errors

        
        // Create an EventSource with the query parameter
        const eventSource = new EventSource(`https://backend.ezly.site/api/uploadPercentage?folderName=lakshay`);

        // Track connection state
        setIsConnected(true);
        eventSource.onopen = () => {
            console.log('SSE connection opened.');
        };

        // Listen for messages from the backend
        eventSource.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data); // Parse the new batch of updates
        
                setData((prevData) => {
                    const updatedFiles = {};
        
                    // Convert previous data into a lookup for easy merging
                    prevData.forEach((file) => {
                        updatedFiles[file.fileName] = file.percentage;
                    });
        
                    // Update or add new entries with the incoming data
                    parsedData.forEach((file) => {
                        updatedFiles[file.fileName] = file.percentage;
                    });
        
                    // Return updated data as an array
                    return Object.keys(updatedFiles).map((fileName) => ({
                        fileName,
                        percentage: updatedFiles[fileName],
                    }));
                });
            } catch (e) {
                console.error("Error parsing SSE data:", e);
            }
        };
        

        // Handle errors
        eventSource.onerror = () => {
            console.error('Error with SSE connection');
            eventSource.close(); // Close the connection on error
            setIsConnected(false); // Update connection state
        };

        // Cleanup when the connection is closed
        eventSource.onclose = () => {
            console.log('SSE connection closed');
            setIsConnected(false); // Update connection state
        };
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>SSE Test</h1>

            {/* Input Field for Folder Name */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Enter folder name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '300px',
                    }}
                    disabled={isConnected} // Prevent editing while connected
                />
            </div>

            {/* Start SSE Button */}
            <button
                onClick={startSSE}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: isConnected ? 'not-allowed' : 'pointer',
                    backgroundColor: isConnected ? '#ccc' : '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                }}
                disabled={isConnected} // Disable button if already connected
            >
                {isConnected ? 'Connected' : 'Start SSE'}
            </button>

            {/* Display Error Message */}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

            {/* Display Data in Table */}
            <div style={{ marginTop: '20px', fontSize: '18px' }}>
                {data.length > 0 ? (
                    <table
                        style={{
                            margin: '0 auto',
                            borderCollapse: 'collapse',
                            width: '60%',
                            textAlign: 'left',
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={{ borderBottom: '2px solid #000', padding: '10px' }}>File Name</th>
                                <th style={{ borderBottom: '2px solid #000', padding: '10px' }}>Progress (%)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item, index) => (
                                <tr key={index}>
                                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>{item.fileName}</td>
                                    <td style={{ borderBottom: '1px solid #ddd', padding: '10px' }}>
                                        {item.percentage}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No data received yet...</p>
                )}
            </div>
        </div>
    );
};

export default SSETest;



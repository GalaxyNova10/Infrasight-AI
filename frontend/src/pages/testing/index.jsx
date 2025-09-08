import React, { useState, useEffect } from 'react';
import { submitImageForProcessing, getProcessingResults } from '../../services/api'; // Updated imports

const TestingPage = () => {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Renamed from 'loading'
  const [loadingMessage, setLoadingMessage] = useState(''); // New state for detailed messages
  const [results, setResults] = useState(null); // Renamed from 'result'
  const [error, setError] = useState(null);
  const [pollingIntervalId, setPollingIntervalId] = useState(null); // New state for interval ID

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setJobId(null); // Clear previous job ID
    setResults(null); // Clear previous results
    setError(null); // Clear previous errors
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId); // Stop any active polling
      setPollingIntervalId(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file.');
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Uploading image...');
    setError(null);
    setResults(null); // Clear previous results

    try {
      const response = await submitImageForProcessing(file);
      const newJobId = response.job_id;
      setJobId(newJobId);
      setLoadingMessage('Image uploaded. Analyzing image, this may take a moment...');
      // Polling will start via useEffect when jobId is set
    } catch (err) {
      console.error('Error submitting image for processing:', err);
      setError('Failed to submit image for processing. Please try again.');
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Effect for polling the results
  useEffect(() => {
    if (!jobId) {
      return; // No job to poll
    }

    // Clear any existing interval before starting a new one
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
    }

    const interval = setInterval(async () => {
      try {
        const jobStatus = await getProcessingResults(jobId);
        if (jobStatus.status === 'complete') {
          clearInterval(interval); // Stop polling
          setPollingIntervalId(null);
          setResults(jobStatus); // Store the complete results
          setIsLoading(false);
          setLoadingMessage('Analysis complete!');
        } else if (jobStatus.status === 'processing') {
          setLoadingMessage('Analysis in progress...');
        } else if (jobStatus.status === 'failed') {
          clearInterval(interval);
          setPollingIntervalId(null);
          setError(`Analysis failed: ${jobStatus.error || 'Unknown error'}`);
          setIsLoading(false);
          setLoadingMessage('');
        }
      } catch (err) {
        console.error('Error polling job status:', err);
        clearInterval(interval); // Stop polling on error
        setPollingIntervalId(null);
        setError('Failed to retrieve analysis results. Please try again.');
        setIsLoading(false);
        setLoadingMessage('');
      }
    }, 2000); // Poll every 2 seconds

    setPollingIntervalId(interval); // Store the interval ID

    // Cleanup function: clear interval when component unmounts or jobId changes
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [jobId]); // Rerun effect when jobId changes

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-2xl font-semibold leading-tight">AI Image Analysis</h2>
        </div>
        <div className="mt-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
                Upload Image for Analysis
              </label>
              <input
                type="file"
                id="file"
                accept="image/*" // Restrict to image files
                onChange={handleFileChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !file} // Disable if loading or no file selected
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {isLoading ? loadingMessage : 'Analyze Image'}
            </button>
          </form>
        </div>

        {error && <div className="mt-4 text-red-500 p-3 bg-red-100 rounded">{error}</div>}

        {isLoading && loadingMessage && ( // Display loading message only when isLoading is true and message exists
          <div className="mt-4 text-blue-600 p-3 bg-blue-100 rounded">
            {loadingMessage}
          </div>
        )}

        {results && ( // Display results only when results are available
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
            <div className="flex flex-col md:flex-row gap-8"> {/* Two-column layout */}
              {/* Left Column: Annotated Image */}
              <div className="md:w-1/2">
                <h4 className="text-lg font-medium mb-2">Annotated Image</h4>
                {results.annotated_image ? (
                  <img 
                    src={results.annotated_image} 
                    alt="Annotated Analysis" 
                    className="max-w-full h-auto rounded shadow-lg" 
                  />
                ) : (
                  <div className="text-gray-500">No annotated image available.</div>
                )}
              </div>

              {/* Right Column: Analysis Details */}
              <div className="md:w-1/2">
                <h4 className="text-lg font-medium mb-2">Summary</h4>
                <p className="text-gray-800 mb-4">{results.summary}</p>

                <h4 className="text-lg font-medium mb-2">Detections</h4>
                {results.detections && results.detections.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-700">
                    {results.detections.map((detection, index) => (
                      <li key={index}>
                        {detection.class_name.replace(/_/g, ' ').toUpperCase()}:{' '}
                        {(detection.confidence_score * 100).toFixed(2)}%
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No specific issues detected.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestingPage;
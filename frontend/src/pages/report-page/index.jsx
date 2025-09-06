import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ReportPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    locality: '',
    issueCategory: '',
    description: '',
    files: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [suggestedIssueCategory, setSuggestedIssueCategory] = useState('');
  const canvasRef = useRef(null);

    useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (imagePreview && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = imagePreview;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        if (predictions.length > 0) {
          predictions.forEach(pred => {
            const { x_min, y_min, x_max, y_max } = pred.bounding_box;
            const color = 'red';
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(x_min, y_min, x_max - x_min, y_max - y_min);
            ctx.fillStyle = color;
            ctx.font = '16px Arial';
            ctx.fillText(`${pred.class_name} (${pred.confidence_score.toFixed(2)})`, x_min, y_min - 5);
          });
        }
      };
    }
  }, [imagePreview, predictions]);

  const chennaiLocalities = ['T. Nagar', 'Adyar', 'Mylapore', 'Velachery', 'Sholinganallur'];
  const issueCategories = ['pothole', 'water_leak', 'garbage_overflow', 'streetlight_fault', 'other'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({ ...prev, files: [file] }));
    setImagePreview(null); // Clear previous preview
    setPredictions([]); // Clear previous predictions
    setSuggestedIssueCategory(''); // Clear previous suggestion

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('file', file);

    setIsPredicting(true);
    try {
      const response = await fetch(import.meta.env.VITE_CV_PROCESSOR_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPredictions(data.detections); // Changed from data.predictions to data.detections
        if (data.detections.length > 0) {
          const topPrediction = data.detections.reduce((prev, current) => (prev.confidence_score > current.confidence_score) ? prev : current);
          setSuggestedIssueCategory(topPrediction.class_name); // Set suggested category
          if (issueCategories.includes(topPrediction.class_name)) {
            setFormData(prev => ({ ...prev, issueCategory: topPrediction.class_name }));
          }
        }
      } else {
        console.error('Failed to get predictions', response.status, await response.text());
        setError('Failed to get AI predictions.');
      }
    } catch (error) {
      console.error('Error predicting image:', error);
      setError('Error connecting to AI service.');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!user) {
      setError('You must be logged in to submit a report.');
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('title', formData.issueCategory);
      submitData.append('description', formData.description);
      submitData.append('issue_type', formData.issueCategory.toLowerCase().replace(/ /g, '_'));
      submitData.append('latitude', 13.0827); // Placeholder
      submitData.append('longitude', 80.2707); // Placeholder
      submitData.append('address', formData.locality);
      
      if (formData.files.length > 0) {
        submitData.append('image', formData.files[0]);
      }

      await axios.post(`${API_URL}/citizen-reports/`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      setSuccess(true);
      setTimeout(() => navigate('/my-reports'), 3000);
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit report.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Report an Issue - InfraSight AI</title>
      </Helmet>
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">Report an Issue</h1>
          </div>
          <div className="bg-surface rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form fields... */}
              <div>
                <label className="block text-sm font-medium mb-2">Upload Photo</label>
                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full" />
              </div>
              {imagePreview && (
                <div className="relative">
                  <canvas ref={canvasRef} className="max-w-full h-auto" />
                  {isPredicting && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
              )}

              {predictions.length > 0 && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">AI Detections:</h3>
                  <ul>
                    {predictions.map((pred, index) => (
                      <li key={index} className="text-sm">
                        {pred.class_name}: {(pred.confidence_score * 100).toFixed(2)}%
                      </li>
                    ))}
                  </ul>
                  {suggestedIssueCategory && (
                    <div className="mt-4">
                      <p className="text-md font-medium">AI Suggestion for Issue Category: <span className="font-bold">{suggestedIssueCategory}</span></p>
                      <button
                        type="button"
                        onClick={() => handleInputChange('issueCategory', suggestedIssueCategory)}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600"
                      >
                        Use AI Suggestion
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ... other form fields ... */}
              <div className="flex justify-end pt-6">
                <button type="submit" disabled={isLoading || isPredicting} className="bg-primary text-white px-8 py-3 rounded-lg">
                  {isLoading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportPage;

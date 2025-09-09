import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm, Controller } from 'react-hook-form'; // Import Controller
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import api from '../../services/api'; // Assuming this is the API service
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { useAuth } from '../../context/AuthContext'; // Assuming AuthContext for user ID

const issueTypes = [
  { value: '', label: 'Select Issue Type', disabled: true },
  { value: 'Pothole', label: 'Pothole' },
  { value: 'Water Logging', label: 'Water Logging' },
  { value: 'Garbage Piles', label: 'Garbage Piles' },
  { value: 'Illegal Parking', label: 'Illegal Parking' },
  { value: 'Debris', label: 'Debris' },
];

const ReportPage = () => {
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm(); // Add control
  const [imagePreview, setImagePreview] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const { user } = useAuth(); // Get user from AuthContext

  const selectedImage = watch('image');

  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      setImagePreview(URL.createObjectURL(file));
      // Send image to AI for prediction
      handleImagePrediction(file);
    } else {
      setImagePreview(null);
    }
  }, [selectedImage]);

  const handleImagePrediction = async (file) => {
    setLoadingAI(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await api.post('/cv-api/predict/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data && response.data.predictions && response.data.predictions.length > 0) {
        // Assuming the first prediction is the most confident
        const topPrediction = response.data.predictions[0];
        setValue('issue_type', topPrediction.label);
        // toast.info(`AI suggested: ${topPrediction.label}`); // Temporarily commented out
      }
    } catch (error) {
      console.error('AI prediction failed:', error);
      // toast.error('Failed to get AI suggestion.'); // Temporarily commented out
    } finally {
      setLoadingAI(false);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('issue_type', data.issue_type);
    formData.append('address', data.address || '');

    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0]);
    }

    try {
      await api.post('/citizen-reports/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // toast.success('Report submitted successfully!'); // Temporarily commented out
      setValue('title', '');
      setValue('description', '');
      setValue('issue_type', '');
      setValue('image', null);
      setImagePreview(null);
    } catch (error) {
      console.error('Report submission failed:', error);
      // toast.error('Failed to submit report.'); // Temporarily commented out
    }
  };

  return (
    <>
      <Helmet>
        <title>Report an Issue - InfraSight AI</title>
        <meta name="description" content="Submit a new infrastructure issue report." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Report a New Issue</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Title
            </label>
            <Input
              id="title"
              type="text"
              placeholder="Brief title of the issue"
              {...register('title', { required: 'Title is required' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.title && <p className="text-red-500 text-xs italic">{errors.title.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              placeholder="Detailed description of the issue"
              {...register('description', { required: 'Description is required' })}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs italic">{errors.description.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="issue_type" className="block text-gray-700 text-sm font-bold mb-2">
              Issue Category
            </label>
            <Controller
              name="issue_type"
              control={control}
              rules={{ required: 'Issue type is required' }}
              render={({ field }) => (
                <Select
                  id="issue_type"
                  options={issueTypes}
                  value={field.value}
                  onChange={field.onChange}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              )}
            />
            {errors.issue_type && <p className="text-red-500 text-xs italic">{errors.issue_type.message}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">
              Upload Image (Optional)
            </label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register('image')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {imagePreview && (
              <div className="mt-4">
                <img src={imagePreview} alt="Image Preview" className="max-w-xs h-auto rounded-md shadow-md" />
              </div>
            )}
            {loadingAI && <p className="text-gray-500 text-sm mt-2">Analyzing image for suggestions...</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
              Address (Optional)
            </label>
            <Input
              id="address"
              type="text"
              placeholder="e.g., 123 Main St, Chennai"
              {...register('address')}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <Button
            type="submit"
            className="block w-full sm:w-auto mx-auto mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
          >
            Submit Report
          </Button>
        </form>
      </div>
    </>
  );
};

export default ReportPage;

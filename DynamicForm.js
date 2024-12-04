import React, { useState, useEffect } from 'react';
import './styles.css'; // Importing  the CSS file

const DynamicForm = () => {
  const [selectedForm, setSelectedForm] = useState('');
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [currentData, setCurrentData] = useState({});
  const [progress, setProgress] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null); // Tracking  error message
  const [loading, setLoading] = useState(false); // Tracking  loading state

  const apiResponses = {
    userInformation: {
      fields: [
        { name: 'firstName', type: 'text', label: 'First Name', required: true },
        { name: 'lastName', type: 'text', label: 'Last Name', required: true },
        { name: 'age', type: 'number', label: 'Age', required: false }
      ]
    },
    addressInformation: {
      fields: [
        { name: 'street', type: 'text', label: 'Street', required: true },
        { name: 'city', type: 'text', label: 'City', required: true },
        { name: 'state', type: 'dropdown', label: 'State', options: ['California', 'Texas', 'New York'], required: true },
        { name: 'zipCode', type: 'text', label: 'Zip Code', required: false }
      ]
    },
    paymentInformation: {
      fields: [
        { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
        { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
        { name: 'cvv', type: 'password', label: 'CVV', required: true },
        { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true }
      ]
    }
  };

  // Simulating  an API request to get the form structure (with error handling)
  const fetchFormStructure = async (formType) => {
    setLoading(true);
    try {
      // Simulating  API call
      const response = apiResponses[formType]; // Replacing  with actual API call
      if (!response) {
        throw new Error('Form structure not found');
      }
      setFields(response.fields);
      setErrorMessage(null); // Reseting  error message if successful
    } catch (error) {
      setErrorMessage('Failed to load the form structure. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handling  form selection (to load fields)
  const handleFormSelection = (e) => {
    const formType = e.target.value;
    setSelectedForm(formType);
    if (formType) {
      fetchFormStructure(formType); // Fetching  the form structure on form selection
    } else {
      setFields([]);
    }
  };

  // Handling  field change
  const handleFieldChange = (e) => {
    setCurrentData({ ...currentData, [e.target.name]: e.target.value });
  };

  // Calculating  progress
  const calculateProgress = () => {
    const totalRequiredFields = fields.filter(field => field.required).length;
    const completedFields = fields.filter(field => field.required && currentData[field.name] !== "").length;
    const progressPercentage = totalRequiredFields ? (completedFields / totalRequiredFields) * 100 : 0;
    setProgress(progressPercentage);
  };

  // Handling  form submission
  const handleFormSubmission = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedData = [...formData];
      updatedData[editIndex] = currentData;
      setFormData(updatedData);
      setEditIndex(null);
      setFeedbackMessage("Changes saved successfully.");
    } else {
      setFormData([...formData, currentData]);
      setFeedbackMessage("Sign-up Successful");
    }
    setFormSubmitted(true);
    setCurrentData({});
  };

  // Handling  entry edit
  const handleEntryEdit = (index) => {
    const dataToEdit = formData[index];
    setEditIndex(index);
    setCurrentData(dataToEdit);
  };

  // Handling  entry delete
  const handleEntryDelete = (index) => {
    const updatedData = formData.filter((_, idx) => idx !== index);
    setFormData(updatedData);
    setFeedbackMessage("Entry deleted successfully.");
  };

  // Handling  file upload (dummy function for now)
  const handleFileUpload = () => {
    setFeedbackMessage("File uploaded successfully!");
  };

  useEffect(() => {
    calculateProgress();
  }, [fields, currentData]);

  return (
    <div>
      <header>
        <h1>Dynamic Form</h1> {/* Updating  header */}
      </header>

      <div className="main-container">
        <select onChange={handleFormSelection}>
          <option value="">Select Form</option>
          <option value="userInformation">User Information</option>
          <option value="addressInformation">Address Information</option>
          <option value="paymentInformation">Payment Information</option>
        </select>

        {/* Error Message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Loading Spinner */}
        {loading && <div className="loading-spinner">Loading...</div>}

        {/* Form */}
        <form onSubmit={handleFormSubmission}>
          {fields.length > 0 ? (
            fields.map((field, index) => (
              <div key={index} className="form-field">
                <label>{field.label}</label>
                {field.type === 'text' || field.type === 'number' || field.type === 'date' || field.type === 'password' ? (
                  <input
                    type={field.type}
                    name={field.name}
                    value={currentData[field.name] || ''}
                    required={field.required}
                    onChange={handleFieldChange}
                  />
                ) : field.type === 'dropdown' ? (
                  <select
                    name={field.name}
                    required={field.required}
                    value={currentData[field.name] || ''}
                    onChange={handleFieldChange}
                  >
                    {field.options.map((option, idx) => (
                      <option key={idx} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : null}
              </div>
            ))
          ) : (
            <p>Please select a form to display fields.</p>
          )}
          <button type="submit">{editIndex !== null ? 'Save Changes' : 'Submit'}</button>
        </form>

        {/* Feedback Message */}
        {feedbackMessage && <div className="feedback-message">{feedbackMessage}</div>}

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Success Animation */}
        {formSubmitted && (
          <div className="success-animation">
            <span className="checkmark">✔</span>
            <p>Form submitted successfully!</p>
          </div>
        )}

        {/* Table Displaying Submitted Data */}
        <table className="data-table">
          <thead>
            <tr>
              {fields.map((field, index) => (
                <th key={index}>{field.label}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {formData.map((entry, index) => (
              <tr key={index}>
                {fields.map((field, idx) => (
                  <td key={idx}>{entry[field.name]}</td>
                ))}
                <td>
                  <button onClick={() => handleEntryEdit(index)}>Edit</button>
                  <button onClick={() => handleEntryDelete(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* File Uploading */}
        <button onClick={handleFileUpload}>Upload File</button>
      </div>

      <footer>
        <p>&copy; 2024 Dynamic Form. All rights reserved.</p> {/* Updated footer */}
      </footer>
    </div>
  );
};

export default DynamicForm;

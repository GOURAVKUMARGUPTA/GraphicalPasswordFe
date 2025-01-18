import React, { useState } from 'react';
import axios from 'axios';
import Modal from './components/Modal';

const Login = ({ toastFunction }) => {
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [links, setLinks] = useState([]);
  const [id, setId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
    const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;


  const fetchImageData = async (imageId) => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/${imageId}?client_id=CsSfWD7jCZOsJu92t5B1z8KLDffRd1RDWmn0vbWQTO8`
      );
      console.log("responsedata",response.data);
      
      return response.data;
      
    } catch (error) {
      console.error(`Error fetching image ${imageId}:`, error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      toastFunction('Please enter an email address', 0);
      return;
    }


    setIsLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email, theme });
      const imageIds = response.data.Ids;

      if (!imageIds || imageIds.length === 0) {
        toastFunction('No images found for this user', 0);
        setIsLoading(false);
        return;
      }

      const imagePromises = imageIds.map(fetchImageData);
      const imageResults = await Promise.all(imagePromises);

      const validImages = imageResults.filter((result) => result !== null);

      setLinks(validImages);
      setShowModal(true);
    } catch (error) {
      console.error('Login error:', error);
      toastFunction('Error during login. Please try again.', 0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageClick = (imageId) => {
    setId((prevIds) => {
      if (prevIds.includes(imageId)) {
        return prevIds.filter((id) => id !== imageId);
      }
      // Add the image ID
      return [...prevIds, imageId];
    });
  };

  const handleModalSubmit = async () => {
    if (!theme) {
      toastFunction('Please enter a theme', 0);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/loginVerify`, { id, theme });
      toastFunction('Login successful!', 1);
      setShowModal(false);
      setEmail('');
      setTheme('');
      setId([]);
    } catch (error) {
      console.error('Verification error:', error);
      toastFunction('Login verification failed. Please try again.', 0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mt-48 flex flex-row justify-center">
        <div className="mr-5 relative z-0 w-3/12 mb-6 group">
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </div>
        <div className="ml-5 relative z-0 w-3/12 mb-6 group">
          <input
            type="text"
            name="theme"
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="theme"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Theme
          </label>
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 mt-10"
        >

        
          {isLoading ? 'Loading...' : 'Select Image'}
        </button>
      </div>

      <div className="mx-96 px-28">
        {showModal && (
          <Modal
            link={links}
            handelImageClick={handleImageClick}
            handelModalSubmit={handleModalSubmit}
            selectedIds={id}
            type={"Login"}
          />
        )}
      </div>
    </>
  );
};

export default Login;

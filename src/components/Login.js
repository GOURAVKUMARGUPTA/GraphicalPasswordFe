import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/user';

const Login = ({ toastFunction }) => {
  const [email, setEmail] = useState('');
  const [nextLoading, setNextLoading] = useState(false);
  const [theme, setTheme] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [links, setLinks] = useState([]);
  const [id, setId] = useState([]);
  const [allId, setAllId] = useState([]);

  const baseURL = process.env.REACT_APP_BACKEND_BASE_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

const handelSubmit = async () => {
  if (!email || !theme) {
    toastFunction('Email and theme are required', 0); // Show message if fields are empty
    return;
  }

  setNextLoading(true);
  const url = `${baseURL}/login`;


  try {
    const data = { theme, email };
    console.log(data, 'addfs');
    // const response = await axios.post(url, data); // Fix: Using await to properly wait for the response

    setNextLoading(false);
    // setAllId(response.data.Ids);
    setShowModal(true);
  } catch (err) {
    setNextLoading(false);
    const errorMessage = err.response?.data || 'An error occurred';
    toastFunction(errorMessage, 0);
  }
};


  useEffect(() => {
    const fetchImageLinks = async () => {
      try {
        const newLinks = [];
        for (let i = 0; i < allId.length; i++) {
          const url = `https://api.unsplash.com/photos/${allId[i]}?client_id=CsSfWD7jCZOsJu92t5B1z8KLDffRd1RDWmn0vbWQTO8`;
          const fetchedLink = await axios.get(url);
          newLinks.push(fetchedLink.data);
        }
        setLinks(newLinks);
      } catch (error) {
        toastFunction('Error fetching images', 0);
      }
    };

    if (allId.length > 0) {
      fetchImageLinks();
    }
  }, [allId, toastFunction]);

  const handelImageClick = (imageId) => {
    setId((prev) => [...prev, imageId]);
  };

  const handelModalSubmit = async () => {
    setNextLoading(true);
    const url = `${baseURL}/loginVerify`;

    try {
      await axios({
        method: 'POST',
        url,
        data: { id, theme },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setNextLoading(false);
      toastFunction('Successfully Logged in', 1);
      dispatch(login({ login: true }));
      localStorage.setItem('login', true);
      resetForm();
      navigate('/');
    } catch (err) {
      setNextLoading(false);
      const errorMessage = err.response?.data || 'An error occurred';
      toastFunction(errorMessage, 0);
      resetForm();
    }
  };

  const resetForm = () => {
    setEmail('');
    setTheme('');
    setShowModal(false);
    setAllId([]);
    setLinks([]);
    setId([]);
  };

  return (
    <>
      <div className="flex justify-center items-center h-96 mt-24">
        <div className="flex flex-col rounded-md w-4/5 md:w-2/3 lg:w-1/3 justify-center items-center h-2/3 shadow-xl border-2 border-gray-100">
          <h1 className="mb-9 text-2xl">Login</h1>
          <input
            className="border border-gray-200 w-11/12 mb-1 rounded-md p-1 hover:border-gray-500 hover:border-2"
            value={email}
            placeholder="Enter Email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border border-gray-200 w-11/12 mb-1 rounded-md p-1 hover:border-gray-500 hover:border-2"
            value={theme}
            type="text"
            placeholder="Enter Theme"
            onChange={(e) => setTheme(e.target.value)}
          />
          {nextLoading ? (
            <Loader />
          ) : (
            <button
              className="bg-blue-500 rounded-md w-11/12 p-2 hover:bg-blue-950 hover:text-white"
              onClick={handelSubmit}
              disabled={nextLoading}
            >
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        {showModal && (
          <Modal
            link={links}
            handelImageClick={handelImageClick}
            handelModalSubmit={handelModalSubmit}
            type="Login"
            loading={nextLoading}
          />
        )}
      </div>
    </>
  );
};

export default Login;

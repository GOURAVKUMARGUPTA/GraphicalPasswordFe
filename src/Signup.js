import React, { useState } from "react";
import axios from "axios";
import Modal from "./components/Modal";

const Signup = ({toastFunction}) => {
    const API_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL;


  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [links, setLinks] = useState([]);
  const [id, setId] = useState([]);
    const [allId, setAllId] = useState([]);
      const [isLoading, setIsLoading] = useState(false);

    const URL = `https://api.unsplash.com/search/photos?query=${theme}&client_id=CsSfWD7jCZOsJu92t5B1z8KLDffRd1RDWmn0vbWQTO8`;

const handelSubmit = async () => {
  if (!theme) {
    toastFunction('Please enter a theme', 0);
    return;
  }

  setIsLoading(true);
  try {
    const { data } = await axios.get(URL);
    const photos = data.results;
    setLinks([...photos]);
    setShowModal(true);
  } catch (error) {
    console.error('Error fetching images:', error);
    toastFunction('Failed to fetch images. Try again later.', 0);
  } finally {
    setIsLoading(false);
  }
};

    const handelImageClick = (imageId) => {
      setId([...id, imageId]);
    };

    const handelModalSubmit = async () => {
      // console.log(id);
      const url = `${API_BASE_URL}/signup`;
      const data = { id, theme, email, links };

      console.log("data = ", data);

      await axios
        .post(url, data)
        .then((response) => {
        //   console.log("successfuly added data", response.data);
          toastFunction("successfully signed up !!", 1);
        })
        .catch((err) => {
        //   console.log("errorfuly added data", err);
          toastFunction("user already exists !!", 0);
        });
      setShowModal(false);
      setEmail("");
      setTheme("");
    };

    // const imageId = (id) => {
    //   setAllId([...allId, setAllId]);
    // };

  return (
    <>
      <div className="mt-48 flex flex-row justify-center">
        <div class="mr-5 relative z-0 w-3/12 mb-6 group">
          <input
            type="email"
            name="floating_email"
            id="floating_email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            for="floating_email"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </div>
        <div class="ml-5 relative z-0 w-3/12 mb-6 group">
          <input
            type="email"
            name="floating_email"
            id="floating_email"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            for="floating_email"
            class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Theme
          </label>
        </div>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={handelSubmit}
          class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2 mt-10"
        >
          Select Image
        </button>
      </div>

      <div className="mx-96 px-28">
        {showModal && (
          <Modal
            link={links}
            handelImageClick={handelImageClick}
            handelModalSubmit={handelModalSubmit}
            // imageID={imageId}
          />
        )}
      </div>
    </>
  );
};

export default Signup;

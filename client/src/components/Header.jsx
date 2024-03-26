import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import './Header.css'

const Header = () => {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('')


  const { currentUser } = useSelector((state) => state.user)


  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [])

  return (
    <header className="bg-blue-200 nav shadow-md"  >
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-red-500"> M</span>
            <span className="text-slate-300"> Estate </span>
          </h1>
        </Link>

        <form onSubmit={handleSubmit} className="bg-slate-500 p-3 rounded-lg flex items-center">
          <input
            className="bg-slate-500 bg-transparent placeholder:text-slate-100 focus:outline-none w-24 sm:w-64"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>

        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-white hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-white hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {
              currentUser ?
                (
                  <img
                    src={currentUser.avatar}
                    alt='profile'
                    width='35px '
                    className="rounded-3xl h-7 w-7 object-cover"
                  />
                )
                : (

                  <li className="hidden sm:inline text-white hover:underline">
                    Sign In
                  </li>

                )
            }
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;

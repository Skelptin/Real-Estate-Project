import React from "react";

import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

import './Header.css'

const Header = () => {


  const { currentUser } = useSelector((state) => state.user)




  return (
    <header className="bg-blue-200 nav shadow-md"  >
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-red-500"> M</span>
            <span className="text-slate-300"> Estate </span>
          </h1>
        </Link>

        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            type="text"
            placeholder="Search..."
          />

          <FaSearch className="text-slate-600" />
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

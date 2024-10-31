import { Link } from 'react-router-dom';
import { useState } from 'react';

import XSvg from '../../../components/svgs/X';

import { MdOutlineMail } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { MdPassword } from 'react-icons/md';
import { MdDriveFileRenameOutline } from 'react-icons/md';

const SignUpPage = () => {
  return (
    <div className="max-w-screen-xl mx-auto flex h-screen px-10 ">
      <div className="flex-1 hidden lg:flex items-center  justify-center">
        <XSvg className=" lg:w-2/3 fill-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center">
        <form className="lg:w-2/3  mx-auto md:mx-20 flex gap-4 flex-col">
          <XSvg className="w-24 lg:hidden fill-white" />
          <h1 className="text-4xl font-extrabold text-white">Join today.</h1>

          {/* email */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdOutlineMail />
            <input
              type="email"
              className="grow"
              placeholder="Email"
              name="email"
            />
          </label>

          <div className="flex gap-4 flex-wrap">
            {/* username */}
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <FaUser />
              <input
                type="text"
                className="grow "
                placeholder="Username"
                name="username"
              />
            </label>

            {/* fullname */}
            <label className="input input-bordered rounded flex items-center gap-2 flex-1">
              <MdDriveFileRenameOutline />
              <input
                type="text"
                className="grow"
                placeholder="Full Name"
                name="fullName"
              />
            </label>
          </div>
          {/* password */}
          <label className="input input-bordered rounded flex items-center gap-2">
            <MdPassword />
            <input
              type="password"
              className="grow"
              placeholder="Password"
              name="password"
            />
          </label>

          {/* signup button */}
          <button className="btn rounded-full btn-primary text-white">
            Sign up
          </button>
        </form>
        <div className="flex flex-col lg:w-2/3 gap-2 mt-4">
          <p className="text-white text-lg">Already have an account?</p>
          <Link to="/login">
            <button className="btn rounded-full btn-primary text-white btn-outline w-full">
              Sign in
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;

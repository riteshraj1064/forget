import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const BaseUrl = "https://app-quiz.onrender.com/api/user";
const Form = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [invaild, setInvalid] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(true);
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const { token, id } = queryString.parse(location.search);
  const verifyToken = async () => {
    try {
      const { data } = await axios(
        `${BaseUrl}/verify-token?token=${token}&id=${id}`
      );
      setBusy(false);
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) return setInvalid(data.error);
      }
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const handaleOnChange = ({ target }) => {
    const { name, value } = target;
    setNewPassword({ ...newPassword, [name]: value });
  };

  const handaleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = newPassword;
    console.log(password, confirmPassword);
    if (password.trim() < 8 || password.trim > 20) {
      return setError("password must be 8 to 20 characters long!");
    }
    if (password !== confirmPassword) {
      return setError("password not macthed");
    }
    try {
      setBusy(true);
      const { data } = await axios.post(
        `${BaseUrl}/reset-password?token=${token}&id=${id}`,
        { password }
      );
      setBusy(false);
      if (data.success) {
        navigate("/", { replace: true });
        setSuccess(true);
      }
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) return setInvalid(data.error);
      }
    }
  };

  if (invaild)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <h1>{invaild}</h1>
      </div>
    );
  if (busy)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <h1>please wait we are verifying token......</h1>
      </div>
    );
  if (success)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <h1>Your Passowrd is change successfully </h1>
        <p>Go and Login your app with new password</p>
      </div>
    );
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-xs">
        <h1 className="text-center text-4 text-black-800 mb-3">
          Reset Password
        </h1>
        <form
          onSubmit={handaleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <p>{error}</p>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              name="password"
              type="password"
              onChange={handaleOnChange}
              placeholder="******************"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              name="confirmPassword"
              onChange={handaleOnChange}
              type="password"
              placeholder="******************"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              submit
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2020 Acme Corp. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Form;

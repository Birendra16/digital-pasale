'use client';

import React from 'react';
import Image from 'next/image';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { User, Lock } from 'lucide-react';

const LoginPage = () => {
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      await axios.post('http://localhost:8080/api/auth/login', values);
      alert('Login successful');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg">
        <div className="flex justify-center mb-6">
          <Image
            src="/digitalpasale.png"
            alt="Digital Pasale Logo"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 text-center">Login</h2>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
        >
          {() => (
            <Form className="space-y-4">
              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <User className="text-gray-400 mr-2" />
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="flex-1 p-2 outline-none bg-gray-100 rounded-lg"
                />
              </div>
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

              <div className="flex items-center border border-gray-300 rounded-lg p-2">
                <Lock className="text-gray-400 mr-2" />
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="flex-1 p-2 outline-none bg-gray-100 rounded-lg"
                />
              </div>
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

              <button
                type="submit"
                className="bg-green-500 w-full text-white py-2 rounded-lg hover:bg-green-600 transition-colors text-lg sm:text-base"
              >
                Login
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;

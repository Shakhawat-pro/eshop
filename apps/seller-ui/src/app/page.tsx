import React from 'react';

const page = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className="text-2xl font-bold">Welcome to the Seller Page</h1>
      <p className="mt-4">Here you can manage your products and orders.</p>
      <div className='flex items-center gap-4 mt-10'>
        <a href="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Login</a>
        <a href="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Register</a>
        <a href="/dashboard" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Dashboard</a>
      </div>
    </div>
  );
};

export default page;
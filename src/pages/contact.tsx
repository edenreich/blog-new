import React from 'react';
import Head from 'next/head';

const ContactPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Contact | Engineering Blog</title>
      </Head>
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-lg w-96">
          <h1 className="text-2xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-600 mb-4">Have a question? Feel free to leave me a message.</p>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name:</label>
              <input type="text" id="name" className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">Email:</label>
              <input type="email" id="email" className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500" />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">Message:</label>
              <textarea id="message" rows={4} className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring focus:border-blue-500"></textarea>
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

import Link from 'next/link';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-14">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <span className="font-bold text-xl">Eden Reich</span>
          <div className="ml-4 flex items-center">
            <Link href="https://twitter.com/Eden68659190" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 4.383a9.198 9.198 0 01-2.648.725 4.551 4.551 0 001.997-2.512 9.186 9.186 0 01-2.903 1.108A4.565 4.565 0 0015.8 2a4.552 4.552 0 00-4.558 4.558c0 .357.04.706.118 1.045A12.974 12.974 0 011.555 2.633a4.553 4.553 0 001.412 6.079 4.532 4.532 0 01-2.062-.572v.058a4.556 4.556 0 003.649 4.471 4.57 4.57 0 01-2.057.078 4.557 4.557 0 004.25 3.162 9.132 9.132 0 01-5.664 1.951c-.368 0-.733-.021-1.09-.064a12.926 12.926 0 007 2.042c8.412 0 13.011-6.958 13.011-13.012 0-.198-.004-.395-.013-.589A9.332 9.332 0 0023 4.383z"/>
              </svg>
            </Link>
            <Link href="https://www.linkedin.com/in/eden-reich-411020100/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white ml-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,3H5C3.895,3,3,3.895,3,5v14c0,1.105,0.895,2,2,2h14c1.105,0,2-0.895,2-2V5C21,3.895,20.105,3,19,3z M7.738,17L7.738,17 c-0.697,0-1.262-0.565-1.262-1.262v-4.477C6.477,10.565,7.042,10,7.738,10h0C8.435,10,9,10.565,9,11.262v4.477 C9,16.435,8.435,17,7.738,17z M7.694,8.717c-0.771,0-1.286-0.514-1.286-1.2s0.514-1.2,1.371-1.2c0.771,0,1.286,0.514,1.286,1.2 S8.551,8.717,7.694,8.717z M16.779,17L16.779,17c-0.674,0-1.221-0.547-1.221-1.221v-2.605c0-1.058-0.651-1.174-0.895-1.174 s-1.058,0.035-1.058,1.174v2.605c0,0.674-0.547,1.221-1.221,1.221h-0.081c-0.674,0-1.221-0.547-1.221-1.221v-4.517 c0-0.697,0.565-1.262,1.262-1.262h0c0.697,0,1.262,0.565,1.262,1.262c0,0,0.282-1.262,2.198-1.262C17.023,10,18,10.977,18,13.174 v2.605C18,16.453,17.453,17,16.779,17z"/>
              </svg>
            </Link>
            <Link href="https://www.instagram.com/eden.reich.7/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white ml-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 2H7C4.8 2 3 3.8 3 6v10c0 2.2 1.8 4 4 4h10c2.2 0 4-1.8 4-4V6c0-2.2-1.8-4-4-4zm2 14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9h2v7h10V9h2v7zm-6-11c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5zm0 2c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
              </svg>
            </Link>
            <Link href="https://github.com/edenreich" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white ml-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.88 8.14 6.86 9.45.5.09.68-.22.68-.48v-1.67c-2.8.61-3.39-1.35-3.39-1.35-.46-1.17-1.13-1.48-1.13-1.48-.93-.62.07-.61.07-.61 1.02.07 1.56 1.04 1.56 1.04.91 1.56 2.39 1.11 2.98.85.1-.66.35-1.11.64-1.36-2.24-.25-4.59-1.12-4.59-4.98 0-1.1.39-2 1.03-2.7-.1-.25-.45-1.28.1-2.67 0 0 .85-.27 2.77 1.03.8-.22 1.65-.33 2.5-.33.85 0 1.69.11 2.5.33 1.92-1.3 2.77-1.03 2.77-1.03.55 1.39.2 2.42.1 2.67.64.69 1.03 1.6 1.03 2.7 0 3.88-2.36 4.73-4.61 4.97.36.31.68.92.68 1.86v2.76c0 .26.18.58.69.48C19.12 20.14 22 16.42 22 12c0-5.52-4.48-10-10-10z"/>
              </svg>
            </Link>
            <Link href="https://www.facebook.com/eden.reich.7/" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white ml-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4C2.897 2 2 2.897 2 4v16c0 1.103.897 2 2 2h8v-8H9V10h3V8.419C12 5.298 13.577 4 16.123 4H20v4h-2.123C16.799 8 16 8.672 16 9.581V10h4l-.001 4h-4v8h6c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z"/>
              </svg>
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
          <Link href="/about/" className="text-gray-300 hover:text-white">About</Link>
          <Link href="/contact/" className="text-gray-300 hover:text-white">Contact</Link>
        </div>
      </div>
      <div className="text-center mt-4">
        <p className="text-gray-300 text-sm">© {new Date().getFullYear()} Eden Reich. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

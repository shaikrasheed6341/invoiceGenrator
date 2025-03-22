import React from 'react';
import { Link } from 'react-router-dom';
import Landingpage from '../Landingpage/Landingpage';

const Dashboard = () => {
  const cards = [
    {
      title: 'Owner Management',
      description: 'Manage owner information and details',
      link: '/submitownerdata',
      image: '/ownerdata.jpg',
    },
    {
      title: 'Customer Management',
      description: 'Handle customer data and interactions',
      link: '/postcustmer',
      image: 'https://source.unsplash.com/800x600/?customer',
    },
    {
      title: 'Inventory',
      description: 'Manage product items and stock',
      link: '/getalliteams',
      image: 'https://source.unsplash.com/800x600/?inventory',
    },
    {
      title: 'Financial',
      description: 'Bank details and transactions',
      link: '/bankdetails',
      image: 'https://source.unsplash.com/800x600/?finance',
    },
    {
      title: 'Quotations',
      description: 'Create and manage quotations',
      link: '/postquation',
      image: 'https://source.unsplash.com/800x600/?document',
    },
    {
      title: 'Invoices',
      description: 'Generate and track invoices',
      link: '/invoice',
      image: 'https://source.unsplash.com/800x600/?invoice',
    },
  ];

  return (
    <div className=" min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <>
        <Landingpage  />
        </>

       
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {cards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            className="group relative overflow-hidden rounded-3xl shadow-lg transform hover:scale-105 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-white bg-opacity-50 group-hover:bg-opacity-70 transition duration-300 flex items-center justify-center">
              <h3 className="text-white text-2xl font-bold text-center tracking-wider opacity-90 group-hover:opacity-100 transition duration-300">
                {card.title}
              </h3>
            </div>
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-64 object-cover transition duration-500 group-hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/60 to-transparent backdrop-blur-md text-white text-center opacity-0 group-hover:opacity-100 transition duration-500">
              <p>{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

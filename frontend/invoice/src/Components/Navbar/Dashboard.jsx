import React from 'react';
import { Link } from 'react-router-dom';


// If your image is in the src/assets folder, import it
// import ownerImage from '../assets/ownerdata.jpg';

const Dashboard = () => {
  const cards = [
    {
      title: 'Owner Management',
      description: 'Manage owner information and details',
      link: '/submitownerdata',
      image: '/ownerdata.jpg', // Ensure this path is correct
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
    <div className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.link}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-2xl font-bold text-center">
                    {card.title}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600">{card.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

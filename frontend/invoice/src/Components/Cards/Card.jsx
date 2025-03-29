import React from 'react'

function Card() {
  return (
    <div className=''>
      <div className="grid grid-cols-1   gap-50 lg:grid-cols-3 lg:gap-8">
        <div className="h-32 rounded bg-gray-300"><a href="#" className="group relative block bg-black">
          <img
            alt=""
            src="./page1.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
          />

          <div className="relative p-4 sm:p-6 lg:p-8">
            <p className="text-sm font-medium tracking-widest text- uppercase">Developed</p>

            <p className="text-xl font-bold text-white sm:text-2xl">Lightning Fast Invoicing</p>

            <div className="mt-32 sm:mt-48 lg:mt-64">
              <div
                className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
              >
                <p className="text-lg text-white">
                  Generate professional invoices in seconds with our streamlined process—save time and focus on your business.
                </p>
              </div>
            </div>
          </div>
        </a></div>
        <div className="h-32 rounded bg-gray-300"><a href="#" className="group relative block bg-black">
          <img
            alt=""
            src="page2.jpg"
            className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
          />

          <div className="relative p-4 sm:p-6 lg:p-8">
            <p className="text-sm font-medium tracking-widest  uppercase">Developer</p>

            <p className="text-xl font-bold text-white sm:text-2xl">Pinpoint Accuracy</p>

            <div className="mt-32 sm:mt-48 lg:mt-64">
              <div
                className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
              >
                <p className="text-lg text-white">

                  Eliminate errors with automated calculations and pre-filled templates—ensure every invoice is spot on.</p>
              </div>
            </div>
          </div>
        </a></div>
        <div className="h-36 rounded bg-white"><a href="#" className="group relative block bg-black">
          <img
            alt=""
            src="./invoice.png"
            className="absolute inset-0 bg-white h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
          />

          <div className="relative p-4 sm:p-6 lg:p-8">
            <p className="text-sm font-medium tracking-widest  uppercase">Developer</p>

            <p className="text-xl font-bold text-white sm:text-2xl">Seamless Management</p>

            <div className="mt-32 sm:mt-48 lg:mt-64">
              <div
                className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
              >
                <p className="text-lg text-white">Track, edit, and organize invoices effortlessly—stay in control with a user-friendly dashboard Manage clients.
                </p>
              </div>
            </div>
          </div>
        </a></div>
      </div>
    </div>
  )
}

export default Card;
import React from 'react'

function Landingpage() {
  return (
<section className=" lg:grid lg:h-100   lg:place-content-center">
  <div className="mx-auto w-screen max-w-screen-xl  px-2 py-10 sm:pr-7 pr-15  sm:py-24 lg:px-8 lg:py-32">
    <div className="mx-auto max-w-prose text-center ">
      <h1 className=" text-4xl font-bold text-white  space-y-6 lg:text-5xl lg:font-bold  ">
      Create detailed 
        <br /><strong className="text-indigo-600 text-center text-4xl lg:text-5xl font-extrabold">  Professional Invoices </strong><br />
        in just a few clicks.
      </h1>

      <p className="mt-4 text-base text-center  text-wrap text-gray-50 sm:ml-3 ">
      No more wasting time on formatting. Enter your details, and our system generates a clean, professional invoice instantly.
      </p>

      <div className="mt-4 flex justify-center gap-4 sm:mt-6">
        <a
          className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          href="/submitownerdata"
        >
          Get Started
        </a>

        <a
          className="inline-block rounded border border-gray-200 px-5 py-3 font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
          href="#"
        >
          Learn More
        </a>
      </div>
    </div>
  </div>
</section> 
 )
}

export default Landingpage
import React from 'react'
import Landingpage from './Landingpage'

function Navbar() {
    return (
        <nav className='grid grid-cols-20'>
            <div className='col-start-1 to col-end-2'>logo</div>
            <div className='col-end-20'>
                <div className=''> <a href='/postownerdata' >Home</a></div>

                <div className=''> <a href='./postownerdata' >OwnerData</a></div>
                <div className=''> <a href='./postcustmer' >Custmerdata</a></div>

                <div className=''> <a href='./selectiteams' >Iteam</a></div>

                <div className=''> <a href='./fetch' >Fetch</a></div>
            </div>
        </nav>
    )
}

export default Navbar
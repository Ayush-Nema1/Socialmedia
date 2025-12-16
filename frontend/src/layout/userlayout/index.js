import Navbar from '@/components/Navbar'
import React from 'react'

function Userlayout({children}) {
  return (
    <div>
     <Navbar/>
        {children}
    </div>
    
  )
}

export default Userlayout
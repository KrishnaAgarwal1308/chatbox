import React from 'react'
// import GenerateInput from '@/components/generateInput'
import ChatBox from '@/components/ChatBox'
const page = () => {
  return (
    <div >
      <div className='text-center pt-10  '>
      <h1 className='text-4xl font-bold '>Smart customer support chatbox </h1>
      <h2 className='text-2xl'>by botmaxxxx</h2>
      {/* <GenerateInput/> */}
      <ChatBox/>

      </div>

    </div>
  )
}

export default page

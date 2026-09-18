import React from 'react'

const FlashMsg = ({success, error}) => {
  return (
    <div>
         {success && success.length>0 (  
            <div class="alert alert-success alert-dismissible fade show newFlash " role="alert">
                { success }
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
         )} 

        {error && error.length>0 ( 
            <div class="alert alert-danger alert-dismissible fade show newFlash" role="alert">
                { error }
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        )} 
    </div>
  )
}

export default FlashMsg
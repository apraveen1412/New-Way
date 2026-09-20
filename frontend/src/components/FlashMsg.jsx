import React from 'react'

const FlashMsg = ({flashMsg, setFlashMsg}) => {
  return (
    <div className={`FlashMsg ${flashMsg.message !== ''? 'show': ''} ${flashMsg.success ? 'success' : 'error'}`}>  
        <div className={`alert ${flashMsg.success ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}  role="alert">
            { flashMsg.message }
            <button type="button" 
            className="btn-close"
            id='flash-btn-close' 
            aria-label="Close" 
            onClick={()=>{
                setFlashMsg({
                    success: false,
                    message: ''
                });
            }}></button>
        </div>
    </div>
  )
}

export default FlashMsg
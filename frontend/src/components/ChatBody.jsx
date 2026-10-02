import './ChatBody.css';
import Message from './Message';
import MsgDisplay from './MsgDisplay';

export default function ChatBody({AIres, userQuery, getMessages, submitProps }){

    return(
        <div className = 'resBody'>
            {getMessages?.length > 0 && (
                getMessages?.map((msg)=>{
                   return <MsgDisplay msg={msg} key={msg._id} submitProps ={submitProps}/>
                })
            )}
            <Message AIres={AIres} userQuery={userQuery} />
        </div>
    )
}
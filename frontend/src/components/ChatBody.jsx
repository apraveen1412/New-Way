import './ChatBody.css';
import Message from './Message';

export default function Response({AIres, userQuery}){

    return(
        <div className = 'resBody'>
            <Message AIres={AIres} userQuery={userQuery} />
        </div>
    )
}
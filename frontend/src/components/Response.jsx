import ReactMarkdown from 'react-markdown';

import './Response.css';

export default function Response({AIres}){
    return(
        <div className='resStyle'>
            <ReactMarkdown>{AIres}</ReactMarkdown>
        </div>
    )
}
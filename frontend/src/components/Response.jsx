import ReactMarkdown from 'react-markdown';

import './Response.css';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Response({AIres}){

    let answer = ''; 
    let sources = []; 
    let followups = [];
    
    if (typeof AIres === 'string') {
        answer = AIres; 
    } 
    else if (typeof AIres === 'object') {
        answer = AIres.answer || ''; 
        sources = Array.isArray(AIres.sources) ? AIres.sources : []; 
        followups = Array.isArray(AIres.followUps) ? AIres.followUps : []; 
    }
    
    return(
        <div className='resStyle'>
            <div className="resBody">
                <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
            <div className="resSources">
                {sources?.map((source, index)=>{
                    return <ReactMarkdown key={index}>{source}</ReactMarkdown>
                })}
            </div>
            <div className="resFollowUps">
                {followups?.map((followup, index)=>{
                    return <ReactMarkdown key={index}>{followup}</ReactMarkdown>
                })}
            </div>
        </div>
    )
}
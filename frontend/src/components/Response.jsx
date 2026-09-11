import ReactMarkdown from 'react-markdown'

import './Response.css';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Response({AIres}){

    let answer = ''; 
    let sources = []; 
    let followups = [];
    
    const sourceMarker = '#### Sources';
    const followUpMarker = '#### Follow-up';
    let sourcesIndex = AIres.indexOf(sourceMarker);
    let followUpIndex = AIres.indexOf(followUpMarker);

    if(sourcesIndex !== -1){ 
        // Extracts main answer
        answer = AIres.slice(0, sourcesIndex).trim();

        // Extract sources
        const sourceEnd = followUpIndex !== -1 ? followUpIndex : AIres.length;
        const sourceText = AIres.slice(sourcesIndex, sourceEnd);

        sources = sourceText
            .split('\n')
            .map(line => {
                const httpIndex = line.indexOf('http');
                return({
                    name:line.slice(0, httpIndex).trim(),
                    url: line.slice(httpIndex).trim(),
                });
            })

        // Extract follow ups
        const followUpText = AIres.slice(followUpIndex + followUpMarker.length); 
        followups = followUpText.split('\n').map(line => line.trim()).filter(line => line.startsWith('-')).map(line => {
            line = line.replace(/^-\\s*/, '').trim();
            return({question: line});
        });

    } else {
        answer = AIres.trim() || '';
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
                    return <a key={index} href={source.url}>{source.name}</a>
                })}
            </div>
            <div className="resFollowUps">
                {followups?.map((followup, index)=>{
                    return <button key={index}>{followup.question}</button>
                })}
            </div>
        </div>
    )
}
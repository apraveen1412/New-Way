import ReactMarkdown from 'react-markdown';

export default function Message({AIres, userQuery}){
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
        const sourceText = AIres.slice(sourcesIndex + sourceMarker.length, sourceEnd);

        sources = sourceText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.includes('http'))
            .map(line => {
                const httpIndex = line.indexOf('http');
                return({
                    name:line.slice(0, httpIndex).trim(),
                    url: line.slice(httpIndex).trim(),
                });
            })

        // Extract follow ups
        const followUpText = AIres.slice((followUpIndex + followUpMarker.length)+1); 
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
        <div className="msgBody d-flex flex-column ">
            <div className="inputQuery ">
                <p>{userQuery}</p>
            </div>
            
            <div className="aiResponse">
                <div className = "resAnswer">
                    <ReactMarkdown>{answer}</ReactMarkdown>
                </div>
                <div className = "resSources">
                    {sources.length > 0 ? <h5>Sources</h5> : null}
                    {sources?.map((source, index)=>{
                        return <a key={index} href={source.url} className='sourceLinks'>{source.name}</a>
                    })}
                </div>
                <div className = "resFollowUps">
                    {followups.length > 0 ? <h5>Follow ups</h5> : null}
                    {followups?.map((followup, index)=>{
                        return <button key={index} className='followUpBtns'>{followup.question}</button>
                    })}
                </div>
            </div>
        </div>
    );
}
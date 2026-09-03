import ReactMarkdown from 'react-markdown';

export default function Response({AIres}){
    let resStyle = {
        textAlign: 'left',
        width: '80vw',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        marginTop: '2rem',
    };
    return(
        <div style={resStyle}>
            <ReactMarkdown>{AIres}</ReactMarkdown>
        </div>
    )
}
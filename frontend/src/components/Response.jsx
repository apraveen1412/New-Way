import ReactMarkdown from 'react-markdown';

export default function Response({AIres}){
    let resStyle = {
        textAlign: 'left',
        width: '100vw',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        backgroundColor: '#4727fd',
        flexWrap: 'wrap',
    };
    return(
        <div style={resStyle}>
            <ReactMarkdown>{AIres}</ReactMarkdown>
        </div>
    )
}
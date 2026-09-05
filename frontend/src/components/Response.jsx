import ReactMarkdown from 'react-markdown';

export default function Response({AIres}){
    let resStyle = {
        textAlign: 'left',
        width: '100%',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        flexWrap: 'wrap',
        color: "white"
    };
    return(
        <div style={resStyle}>
            <ReactMarkdown>{AIres}</ReactMarkdown>
        </div>
    )
}
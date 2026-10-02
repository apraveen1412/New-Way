import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { onDeviceAI } from '../LocalAI';
import './Message.css';

const endpoints = {
    local: '/api/conversation/onDevice',
    cloud: '/api/conversation/'
};

const citationSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        a: ['href', 'className', 'target', 'rel'],
    },
};

async function saveBD(conversationId, userQuery, fullResponse, modelName, setConversationId) {
    const result = await axios.post('/api/db/onDevice', {
        conversationId,
        userPrompt: userQuery,
        fullResponse,
        modelName
    });
    if (result.data.conversationId) setConversationId(result.data.conversationId);
}

export default function MsgDisplay({ msg, submitProps }) {
    const {
        conversationId,
        setConversationId,
        getUserQuery,        // sets the live user bubble
        setNewResponse,      // streaming setter (was AIres in QueryBox)
        onExchangeDone,      // archiveExchange
        setRefreshUser,
        flashMsg,
    } = submitProps;

    const navigate = useNavigate();

    let answer = '';
    let sources = [];
    let followups = [];

    const sourceMarker = '#### Sources';
    const followUpMarker = '#### Follow-up';
    const sourcesIndex = msg.response.indexOf(sourceMarker);
    const followUpIndex = msg.response.indexOf(followUpMarker);

    if (sourcesIndex !== -1) {
        answer = msg.response.slice(0, sourcesIndex).trim();

        const sourceEnd = followUpIndex !== -1 ? followUpIndex : msg.response.length;
        const sourceText = msg.response.slice(sourcesIndex + sourceMarker.length, sourceEnd);

        sources = sourceText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.includes('http'))
            .map(line => {
                const httpIndex = line.indexOf('http');
                return { name: line.slice(0, httpIndex).trim(), url: line.slice(httpIndex).trim() };
            });

        if (followUpIndex !== -1) {
            const followUpText = msg.response.slice(followUpIndex + followUpMarker.length);
            followups = followUpText
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.startsWith('-'))
                .map(line => ({ question: line.replace(/^-\s*/, '').trim() }));
        }
    } else {
        answer = msg.response.trim() || '';
    }

    // query and model are arguments, so there is no stale-state problem
    const handleSubmit = async (query, model) => {
        const sentQuery = query.trim();
        if (!sentQuery || !model) return;

        getUserQuery(sentQuery);
        let streamed = '';

        try {
            if (model === endpoints.local) {
                // Chrome built-in / on-device model
                const result = await axios.post(endpoints.local, {
                    userQuery: sentQuery,
                    model,
                    conversationId
                });
                const convId = result.data.conversationId || conversationId;
                setConversationId(convId);

                const response = await onDeviceAI(sentQuery, result.data.webResults, setNewResponse);
                if (response) { // undefined on failure
                    await saveBD(convId, sentQuery, response, model, setConversationId);
                    onExchangeDone(sentQuery, response, model);
                }
            } else {
                // Cloud streaming
                const result = await fetch(endpoints.cloud, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userQuery: sentQuery, model, conversationId })
                });

                if (!result.ok) throw new Error(`Request failed: ${result.status}`);
                if (!result.body) throw new Error('Response body is empty');

                const reader = result.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    streamed += decoder.decode(value, { stream: true });
                    setNewResponse(streamed);
                }
                streamed += decoder.decode();

                const marker = '__CONVERSATION_ID__:';
                const markerIndex = streamed.indexOf(marker);
                if (markerIndex !== -1) {
                    setConversationId(streamed.substring(markerIndex + marker.length).trim());
                    streamed = streamed.substring(0, markerIndex).trim();
                    setNewResponse(streamed);
                }
                onExchangeDone(sentQuery, streamed, model);
            }
        } catch (err) {
            setUserQuery('');
            navigate('/home');
            flashMsg({
                success: false,
                message: err.response?.data?.message || 'Something went wrong'
            });
        } finally {
            setRefreshUser(prev => !prev);
        }
    };

    const handleFollowUp = (e, question) => {
        e.preventDefault();
        handleSubmit(question, msg.model);
    };

    return (
        <div className="msgBody d-flex flex-column ">
            {msg.userquery?.trim() && (
                <div className="inputQuery d-flex justify-content-end">
                    <p>{msg.userquery}</p>
                </div>
            )}

            {answer?.trim() && (
                <div className="aiResponse d-flex flex-column justify-content-start p-3 mb-3">
                    <div className="resAnswer">
                        <ReactMarkdown rehypePlugins={[rehypeRaw, [rehypeSanitize, citationSchema]]}>{answer}</ReactMarkdown>
                    </div>
                    <div className="resSources">
                        {sources.length > 0 ? <h5>Sources</h5> : null}
                        {sources.map((source, index) => (
                            <a key={index} href={source.url} className="sourceLinks">{source.name}</a>
                        ))}
                    </div>
                    <div className="resFollowUps mt-3">
                        {followups.length > 0 ? <h5>Follow ups</h5> : null}
                        {followups.map((followup, index) => (
                            <button
                                key={index}
                                className="followUpBtns"
                                onClick={(e) => handleFollowUp(e, followup.question)}
                            >
                                {followup.question}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
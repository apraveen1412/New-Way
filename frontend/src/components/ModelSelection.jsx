import { useEffect, useState } from 'react';
import './ModelSelection.css';

export default function ModelSelection({ aiModel }) {

    const [dropdownName, setDropdownName] = useState('Select model');
    const [isDesktop, setIsDesktop] = useState(false);

    let Local_Endpoint = '/api/conversation/onDevice';
    let Cloud_Endpoint = '/api/conversation';

    let models = [
        'Gemini nano (Local)',
        'GPT-5.6 Luna',
        'GPT-5.6 Sol'
    ];

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');

        const updateDevice = () => {setIsDesktop(mediaQuery.matches);};
        updateDevice();
        mediaQuery.addEventListener('change', updateDevice);

        return () => {
            mediaQuery.removeEventListener('change', updateDevice);
        };
    }, []);

    function modelNamer(modelName) {
        return modelName.replace(' ', '-').toLowerCase();
    }

    function Endpoint(e) {
        setDropdownName(e.target.innerText);

        if (e.target.innerText === 'Gemini nano (Local)') {
            return aiModel(Local_Endpoint);
        }

        for (let i = 1; i < models.length; i++) {
            if (e.target.innerText === models[i]) {
                return aiModel(`${modelNamer(models[i])}`);
            }
        }
    }

    return (
        <div className="dropdown">

            <button className="btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{dropdownName}</button>

            <ul className="dropdown-menu">
                <li><button className="dropdown-item modelBtn" onClick={Endpoint}        id="local" disabled={!isDesktop}>Gemini nano (Local)</button></li>

                <li><button className="dropdown-item modelBtn" onClick={Endpoint}>GPT-5.6 Luna</button></li>

                <li><button className="dropdown-item modelBtn" onClick={Endpoint}>GPT-5.6 Sol</button></li>

            </ul>
        </div>
    );
}
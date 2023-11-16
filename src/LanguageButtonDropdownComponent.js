import React, { useEffect, useState } from "react";
import Select from 'react-select'
import { useRouter } from 'next/router';


const customStyles = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#1E90FF' : 'white',
        color: state.isSelected ? 'white' : 'black',
        menuPosition: 'fixed'
    }),
};

const container = {
    position: 'relative'
}

const buttonStyle = {
    backgroundColor: 'green',
    color: 'white',
    fontSize: '20px',
    borderRadius: '10px',
    padding: '10px 25px',
    margin: '0 auto',
    marginTop: '10px',
    display: 'block',
    bottom: '10%',
};

const LanguageButtonDropdownComponent = ({ serviceId, languages }) => {
    const { push } = useRouter();
    const options = languages.map((language) => ({
        value: language.locale,
        label: language.name
    }));

    const [selectedLanguage, setSelectedLanguage] = useState(null);

    const handleChange = (selectedLanguage) => {
        setSelectedLanguage(selectedLanguage);
    };
    const handleButtonClick = async (serviceId) => {
        const language = JSON.parse(JSON.stringify(selectedLanguage)).value;
        await push(`/translate?serviceId=${serviceId}&locale=${language}`)
    }

    useEffect(() => {
        console.log(`Language is now: ${JSON.stringify(selectedLanguage)}`);
    }, [selectedLanguage])

    return (
        <div style={container}>
            <Select
                value={selectedLanguage}
                onChange={handleChange}
                options={options}
                placeholder="Select a language"
                styles={customStyles}
                nenuPlacement="auto"
            />
            {/* Add button when a language is selected*/}
            {selectedLanguage && (
                <button style={buttonStyle} onClick={() => {handleButtonClick(serviceId)}}>
                    Start
                </button>
            )}
        </div>
    )
}

export default LanguageButtonDropdownComponent;
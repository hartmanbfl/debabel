import React, { useRef } from "react";
import { useRouter } from 'next/router'
import styles from '@/styles/LanguageSelect.module.css';

const LanguageSelectComponent = (props) => {

    const selectRef = useRef(null)
    const buttonRef = useRef(null)
    const { push } = useRouter()

    const handleClick = async (serviceId) => {
        if (selectRef.current.value == "") {
            alert("No language is selected")
        } else {
            console.log(`Selected language: ${selectRef.current.value}`)
            await push(`/translate?serviceId=${serviceId}&language=${selectRef.current.value}`)
        }
    }

    return (
        <div>
            <div className={styles.languagecontainer}>
                <label className={styles.selectlabel}>Please select your language</label>
                <select ref={selectRef}>
                    {props.languages.map((option, index) => {
                        // Alternate between locale and language name
                        const locale = props.languages[index * 2]
                        const language = props.languages[index * 2 + 1]
                        if (locale && language) {

                            return (
                                <option key={locale} value={locale}>{language}</option>
                            )
                        }
                    })}
                </select>
                <div ref={buttonRef} onClick={() => handleClick(props.serviceId)} className={styles.translateButton}>
                    TRANSLATE
                </div>
            </div>
        </div>
    )
}

export default LanguageSelectComponent;
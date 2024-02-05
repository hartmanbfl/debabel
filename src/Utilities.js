export const getCountryCode = (code) => {
    const REG = /^([a-z]{2})-([A-Z]{2})$/;
    const match = code.match(REG);
    if (!match || match.length < 1) return '';
    return match[2];
}

export const getLanguage = (locale) => {
    const lang = new Intl.Locale(locale).language;
    return lang;
}
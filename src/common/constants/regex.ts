export const RegexPatterns = {
    NAME: /^[a-zA-Z ]{3,50}$/,
    PHONE: /^01[0-2,5]{1}[0-9]{8}$/,
    // Password: at least 8 characters, with letters and numbers
    PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
};


function tokenizeCharacter(type, value, input, current) {
    return (value === input[current]) ? [1, { type, value }] : [0, null];
}

function tokenizeParenOpen(input, current) {
    return tokenizeCharacter('paren', '(', input, current);
}

function tokenizeParenClose(input, current) {
    return tokenizeCharacter('paren', ')', input, current);
}

function tokenizePattern(type, pattern, input, current) {
    
    let char = input[current];
    let consumedChars = 0;

    if (pattern.test(char)) {

        let value = '';
        
        while (char && pattern.test(char)) {
            value += char;
            consumedChars++;
            char = input[current + consumedChars];
        }

        return [consumedChars, { type, value }]

    }

    return [0, null];

}

function tokenizeNumber(input, current) {
    const numberRegex = /[0-9]/;
    return tokenizePattern('number', numberRegex, input, current);
}

function tokenizeName(input, current) {
    const nameRegex = /[a-z]/i;
    return tokenizePattern('name', nameRegex, input, current);
}

function tokenizeString(input, current) {

    if (input[current] === '"') {

        let value = '';
        let consumedChars = 1;
        let char = input[current + consumedChars];

        while (char !== '"') {
            
            if (char === undefined) {
                throw new TypeError('Unterminated string');
            }

            value += char;
            consumedChars++;
            char = input[current + consumedChars];

        }

        return [consumedChars + 1, { type: 'string', value }];

    }

    return [0, null];

}

function skipWhiteSpace(input, current) {
    const spaceRegex = /\s/;
    return (spaceRegex.test(input[current])) ? [1, null] : [0, null];
}

function tokenizer(input) {

    const tokens = [];
    const tokenizers = [
        skipWhiteSpace,
        tokenizeParenOpen,
        tokenizeParenClose,
        tokenizeString,
        tokenizeNumber,
        tokenizeName
    ];
    
    let current = 0;

    while (current < input.length) {

        let isTokenized = false;

        tokenizers.forEach(tokenizer => {

            if (isTokenized) return;

            const [consumedChars, token] = tokenizer(input, current);

            if (consumedChars !== 0) {
                isTokenized = true;
                current += consumedChars;
            }

            if (token) {
                tokens.push(token);
            }

        });

        if (!isTokenized) {
            throw new TypeError(`Unknown character '${char}'`);
        }

    }

    return tokens;

}

module.exports = tokenizer;
convertNumbers = (n, type = "p2e|e2p") => {
    /*
     type: p2e (persian to english), e2p ( english to persian)
    */
    const digitMapTable = [{
            f: '۰',
            e: '0'
        },
        {
            f: '۱',
            e: '1'
        },
        {
            f: '۲',
            e: '2'
        },
        {
            f: '۳',
            e: '3'
        },
        {
            f: '۴',
            e: '4'
        },
        {
            f: '۵',
            e: '5'
        },
        {
            f: '۶',
            e: '6'
        },
        {
            f: '۷',
            e: '7'
        },
        {
            f: '۸',
            e: '8'
        },
        {
            f: '۹',
            e: '9'
        },
    ]

    return n
        .toString()
        .split('')
        .map(x => {
            return type == 'p2e' ?
                (digitMapTable.find(m => m.f == x) ? digitMapTable.find(m => m.f == x).e : x) :
                (digitMapTable.find(m => m.e == x) ? digitMapTable.find(m => m.e == x).f : x)
        })
        .join('');
}

convertToPersian = (input) => {
    return convertNumbers(input, 'e2p');
}

convertToEnglish = (input) => {
    return convertNumbers(input, 'p2e');
}

module.exports = {
    ConvertToPersian: convertToPersian,
    ConvertToEnglish: convertToEnglish
}
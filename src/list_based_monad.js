const MonadicLists = (function () {
    function bind(...functions) {
        if (functions.length === 0) {
            throw RangeError("Zero functions provided to Observables.bind")
        } else if (functions.length === 1) {
            return functions[0]
        } else {
            let firstFunction = functions[0]
            let remainingFunctionsToBind = functions.slice(1)
            let boundFollowingFunctions = bind(...remainingFunctionsToBind)
            return bindTwoFunctions(firstFunction, boundFollowingFunctions)
        }
    }

    function bindTwoFunctions(f, g) {
        return x => {
            let result = []
            for (let y of f(x)) {
                for (let value of g(y)) {
                    result.push(value)
                }
            }
            return result
        }
    }

    return Object.freeze({
        bind
    })
})()

function digitsTimes17(number) {
    let result = []
    for (let c of number.toString()) {
        result.push(Number(c) * 17)
    }
    return result
}

function digitsTimes23(number) {
    let result = []
    for (let c of number.toString()) {
        result.push(c * 23)
    }
    return result
}

function digits(text) {
    let result = []
    for (let c of text.toString()) {
        result.push(c)
    }
    return result
}

// let boundFunction = () => numbers >>= delayNumber >>= spellNumber >>= print
let boundFunction = MonadicLists.bind(() => numbers, digitsTimes17, digitsTimes23, digits)

const numbers = [1, 223, 354]

console.log(boundFunction(undefined))

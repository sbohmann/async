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

function delayNumber(number) {
    return [number]
}

function spellNumber(number) {
    let result = []
    for (let c of number.toString()) {
        result.push("the digit [" + c + "]")
    }
    return result
}

function print(text) {
    console.log('n', text)
    return []
}

// let boundFunction = delayNumber >>= spellNumber >>= print
let boundFunction = MonadicLists.bind(delayNumber, spellNumber, print)

const numbers = [1, 223, 354]

for (let number of numbers) {
    setTimeout(() => {
        boundFunction(number)
    }, 100 - number * 10)
}

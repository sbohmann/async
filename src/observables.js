const fs = require('fs')

const Observables = (function () {
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
            let result = f(x)
            result.onValue = y=> g(y)
            return result
        }
    }

    return Object.freeze({
        bind
    })
})()

function Observable() {
    let valueHandler = undefined

    return {
        processValue(value) {
            if (valueHandler !== undefined) {
                valueHandler(value)
            }
        },
        set onValue(handler) {
            valueHandler = handler
        }
    }
}

function delayNumber(number) {
    let result = Observable()
    setTimeout(() => result.processValue(number), 100 - number * 10)
    return result
}

function spellNumber(number) {
    let result = Observable()
    for (let c of number.toString()) {
        setTimeout(() => result.processValue("the digit [" + c + "]"), 200 - c.charCodeAt(0))
    }
    return result
}

function print(text) {
    console.log('n', text)
    return Observable()
}

let boundFunction = Observables.bind(delayNumber, spellNumber, print)

const numbers = [1, 223, 354]

for (let number of numbers) {
    setTimeout(() => {
        boundFunction(number)
    }, 100 - number * 10)
}

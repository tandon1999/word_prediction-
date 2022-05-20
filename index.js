class HashTable {
    constructor(dict = null) {
        this.keys = []
        this.values = []
        if (dict != null) {
            this.key = Object.keys(dict)[0]
            this.value = Object.values(dict)[0]
        }
    }

    update(key, value) {
        if (!(this.keys.includes(key))) {
            this.keys.push(key)
            this.values.push(value)
        } else {
            let indexOfKey = this.indexOf(this.keys, key)
            let Value = this.values[indexOfKey]
            if (!(Value instanceof Set)) {
                let new_vals = new Set()
                new_vals.add(Value)
                new_vals.add(value)
                this.values[indexOfKey] = new_vals
            } else {
                Value.add(value)
                this.values[indexOfKey] = Value
            }
        }
    }

    get(key) {
        let indexOfKey = this.indexOf(this.keys, key)
        return this.values[indexOfKey]
    }
    getTable() {
        let Table = {}
        for (let i = 0; i < this.keys.length; i++) {
            Table[this.keys[i]] = this.values[i]
        }
        return Table
    }
    indexOf(array, item) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === item) {
                return i
            }
        }
        return null;
    }
}


function Predict(input, type) {
    let fileToOpen
    if (type === 'predict') {
        fileToOpen = "paragraphs.txt"
    } else if (type === 'complete') {
        fileToOpen = "words.txt"
    }
    fetch(fileToOpen)
        .then(response => response.text())
        .then(file => {
            let sentences
            let completions = []
            if (type === 'predict') {
                sentences = file.toLowerCase().replace(/\n/g, ' ').split(' ')
            } else if (type === 'complete') {
                let words = file.toLowerCase().replace(/\n/g, ' ').split(' ')
                words.forEach(word => {
                    for (let i = 0; i < word.length; i++) {
                        completions.push(word.slice(0, i + 1))
                        completions.push(word)
                    }
                })
            }

            let textField = document.forms["Form"]["text_field"].value
            let buttonContainer = document.querySelector('.button-container')
            if (textField != "") {
                let completions = computeMapping(input, type)
                removeAllChildNodes(buttonContainer)
                if (completions != undefined) {
                    if (completions instanceof Set) {
                        completions = castSetToArray(completions)
                        for (let i = 0; i < completions.length; i++) {

                            let button = document.createElement('button')
                            button.className = "btn btn-light"
                            button.style.margin = "3px"
                            button.dataset.value = completions[i]
                            button.textContent = completions[i]
                            buttonContainer.appendChild(button)
                        }
                    } else {
                        let button = document.createElement('button')
                        button.className = "btn btn-light"
                        button.style.margin = "3px"
                        button.dataset.value = completions
                        button.textContent = completions
                        buttonContainer.appendChild(button)
                    }
                }
            } else {
                removeAllChildNodes(buttonContainer)
            }

            function computeMapping(predict, type) {
                let temp_mapping = {}

                let data
                if (type === 'predict') {
                    data = sentences
                } else if (type === 'complete') {
                    data = completions
                }

                let allMapping = []

                let i = 0
                while (i < (data.length) - 1) {
                    if (!(data[i] in temp_mapping)) {
                        let pVal = {}
                        let next = data[i + 1]
                        pVal[next] = 1
                        temp_mapping[data[i]] = pVal
                        let dataMapping = {}
                        dataMapping[data[i]] = temp_mapping[data[i]]
                        allMapping.push(dataMapping)
                        if (type === 'complete') {
                            i++
                        }
                    } else {
                        let storedKey = new HashTable(temp_mapping[data[i]]).key
                        let next = data[i + 1]
                        if (storedKey == next) {
                            let pVal = {}
                            pVal[next] = temp_mapping[data[i]][next] + 1
                            temp_mapping[data[i]] = pVal
                            let dataMapping = {}
                            dataMapping[data[i]] = temp_mapping[data[i]]
                            allMapping.push(dataMapping)
                            if (type === 'complete') {
                                i++
                            }
                        } else {
                            let pVal = {}
                            let dataMapping = {}
                            pVal[next] = 1
                            temp_mapping[data[i]] = pVal

                            dataMapping[data[i]] = temp_mapping[data[i]]
                            allMapping.push(dataMapping)
                            if (type === 'complete') {
                                i++
                            }
                        }
                    }
                    i++
                }
                return computePrediction(allMapping, predict)

            }


            function computePrediction(array_dict, comeAfter) {
                let reverseMapping = new HashTable()
                let maxValue = 1

                for (let i = 0; i < array_dict.length; i++) {
                    let currentKey = new HashTable(array_dict[i]).key
                    let prediction = new HashTable(array_dict[i][currentKey]).key
                    let predictValue = new HashTable(array_dict[i][currentKey]).value

                    if (currentKey === comeAfter) {
                        reverseMapping.update(predictValue, prediction)
                        if (predictValue > maxValue) {
                            maxValue = predictValue
                        }
                    }
                }
                return reverseMapping.get(maxValue)
            }

            function castSetToArray(set) {
                let arrayToReturn = []
                let i = 0
                set.forEach(item => {
                    if (i === 15) {
                        return arrayToReturn
                    }
                    arrayToReturn.push(item)
                    i++
                })
                return arrayToReturn
            }

            function removeAllChildNodes(parent) {
                while (parent.firstChild) {
                    parent.removeChild(parent.firstChild)
                }
            }
        })
}


document.querySelector('.form-container').addEventListener('click', (e) => {
    let textField = document.forms["Form"]["text_field"]
    if (e.target.className === "btn btn-light") {
        let currentWord = textField.value.split(' ').pop()
        if (currentWord === '') {
            let wordToAdd = textField.value + e.target.dataset.value
            textField.value = wordToAdd + ' '
            Predict(e.target.dataset.value, 'predict')
        } else {
            let num_spaces = countSpaces(textField.value)
            let num_words = textField.value.split(' ').length
            let userWords = ''
            let arrayWords = textField.value.split(' ')

            for (let i = 0; i < num_words; i++) {
                if (i === num_spaces) {
                    userWords += e.target.dataset.value
                    break
                }
                userWords += arrayWords[i]
                userWords += ' '
            }
            let predictedWord = userWords.split(' ').pop()
            userWords += ' '
            textField.value = userWords
            Predict(predictedWord.trim(), 'predict')
        }
    }
})

function countSpaces(string) {
    let count = 0
    for (let i = 0; i < string.length; i++) {
        if (string[i] === ' ') {
            count++
        }
    }
    return count
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

document.querySelector('#Form').onkeyup = () => {
    let textField = document.forms["Form"]["text_field"].value
    if (textField.includes(' ')) {
        let currentWord = textField.split(' ').pop()
        if (currentWord === '') {
            textField = textField.split(' ')
            textField.pop()
            let previousWord = textField.pop()
            Predict(previousWord.toLowerCase(), 'predict')
        } else {
            Predict(currentWord.toLowerCase(), 'complete')
        }
    } else {
        Predict(textField.toLowerCase(), 'complete')
    }
}

function myFunction() {
    /* Get the text field */
    var copyText = document.getElementById("text_field");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
}
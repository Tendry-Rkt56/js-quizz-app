import { QCM } from "./function/module_QCM.js"
//--------------------------------------------------------------------------------

var container = document.querySelector('.containers')

// var ObjetQCM = [
//     {
//         valeur: 'Quel entraineur a remporte la LDC 3 fois de suite?',
//         reponses: ['Pep Guardiola', 'Zinédine Zidane', 'Jose Mourinho'],
//         correct: 1,
//         niveau: 1
//     },
//     {
//         valeur: 'Quel entraineur a remporte la LDC 3 fois de suite?',
//         reponses: ['Pep Guardiola', 'Zinédine Zidane', 'Jose Mourinho'],
//         correct: 1,
//         niveau: 1
//     },
//     {
//         valeur: 'Quel entraineur a remporte la LDC 3 fois de suite?',
//         reponses: ['Pep Guardiola', 'Zinédine Zidane', 'Jose Mourinho'],
//         correct: 1,
//         niveau: 0
//     },
//     {
//         valeur: 'Quel entraineur a remporte la LDC 3 fois de suite?',
//         reponses: ['Pep Guardiola', 'Zinédine Zidane', 'Jose Mourinho'],
//         correct: 1,
//         niveau: 2
//     },
//     {
//         valeur: 'Quel entraineur a remporte la LDC 3 fois de suite?',
//         reponses: ['Pep Guardiola', 'Zinédine Zidane', 'Jose Mourinho'],
//         correct: 1,
//         niveau: 1
//     },
//     {
//         valeur: 'Quelle est la capitale de l\`Allemagne ?',
//         reponses: ['Berlin', 'Munich', 'Rome'],
//         correct: 0,
//         niveau: 2
//     },
//     {
//         valeur: 'Quelle est la capitale de l\`Allemagne ?',
//         reponses: ['Berlin', 'Munich', 'Rome'],
//         correct: 0,
//         niveau: 0
//     },
//     {
//         valeur: 'Quelle est la capitale de l\`Allemagne ?',
//         reponses: ['Berlin', 'Munich', 'Rome'],
//         correct: 0,
//         niveau: 0
//     },
//     {
//         valeur: 'Quelle est la capitale de l\`Allemagne ?',
//         reponses: ['Berlin', 'Munich', 'Rome'],
//         correct: 0,
//         niveau: 1
//     }
// ]

async function recupData() {
    try {
        var data = await fetch('script/objet.json')
        if (data.ok) {
            var result = await data.json()
            return JSON.stringify(result)
        }
        else throw new Error('Il y erreur')
    }
    catch (error) {
        console.log(error)
    }
}

var niveau = ['Geographie', 'Football', 'Mathématiques']
var createSelect = () => {
    var select = document.createElement('select')
    select.setAttribute('name', select)
    select.style.width = '40%'
    select.classList.add('form-select')
    for (let i = 0; i < 3; i++) {
        var option = document.createElement('option')
        option.setAttribute('value', i)
        option.innerHTML = niveau[i]
        select.appendChild(option)
    }
    return document.querySelector('.content').appendChild(select)
}

createSelect()

var score = []
async function Selection(tab) {
    var select = document.querySelector('select')
    select.addEventListener('change', async () => {
        container.innerHTML = ''
        var selected = select.value
        tab.forEach(async element => {
            await element.appendTo(container, selected)
            var valueRep = await element.checkReponses()
            score.push(valueRep)
            console.log(score.length)
        })
    })
}

var tableau = []
var tabQuest = []
async function useData() {
    try {
        var result = await recupData()
        var data = JSON.parse(result)
        data.forEach(element => {
            tableau.push(element)
        })
        // ObjetQCM.forEach(element => {
        //     tableau.push(element)
        // })

        console.table(tableau)

        tableau.forEach((element, index) => {
            var Questions = new QCM(index, `${element.valeur}`, `${element.reponses}`, `${element.correct}`, `${element.niveau}`)
            tabQuest.push(Questions)
        })
    }
    catch (error) {
        console.log(error)
    }
}

function testAnswers() {
    return new Promise(resolve => {
        var items = document.querySelector('ul')
        var allLi = document.querySelectorAll('li')
        allLi.forEach(element => {
            element.addEventListener('click', () => {
                resolve()
            })

        })
    })
}

async function main() {
    await useData()
    await Selection(tabQuest)
    await affichageScore()
    // await testReponses(tabQuest)
}

main()

/**
 * Permet de calculer le score 
 * @returns undefined || number
 */
function vueScore() {
    var notes = null
    var allUl = document.querySelectorAll('ul')
    if (score.length == allUl.length && score.length !== 0) {
        notes = 0
        score.forEach(element => {
            if (element === true) notes++
        })
        return notes
    }
    return null

}

function elScor() {
    var btn = document.createElement('button')
    btn.innerHTML = 'Voir score'
    btn.setAttribute('class', 'btn btn-primary btn-sm')
    return document.querySelector('.content').append(btn)
}

elScor()

async function affichageScore() {
    var btn = document.querySelector('button')
    btn.addEventListener('click', () => {
        var tousLesLi = document.querySelectorAll('li')
        var p = document.createElement('p')
        if (vueScore()) {
            p.innerHTML = `Votre score est de ${vueScore()} points`
            document.querySelector('.score').appendChild(p)
            tousLesLi.forEach(element => {
                if (element.getAttribute('data-index') == 'true') {
                    element.style.background = 'green'
                }
                // else if (!element.classList.contains('li-fausse')) {
                //     element.style.background = 'red'
                // }
            })
        }
        else {
            alert("Veillez répondre à toutes les questions");
        }
    })
}

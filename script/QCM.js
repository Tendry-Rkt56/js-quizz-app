import { QCM } from "./function/module_QCM.js"
//--------------------------------------------------------------------------------

const container = document.querySelector('.containers')
const loader = document.querySelector('.loader')
const tableau = []
const tabQuest = []
const niveau = ['Géographie', 'Football', 'Mathématiques']

let selected = 2

/**
 * Récupère les données dans le fichier objet.json via fetch
 * @returns 
 */
async function recupData() {
    try {
        await new Promise(resolve => setTimeout(resolve, 500))
        const data = await fetch('script/objet.json')
        if (data.ok) {
            const result = await data.json()
            return JSON.stringify(result)
        }
        else throw new Error('Il y erreur')
    }
    catch (error) {
        console.log(error)
    }
    finally {
        loader.style.display = "none"
    }
}


/**
 * Permet d'afficher les options dans le DOM
 */
(function createSelect () {
    const select = document.createElement('select')
    select.setAttribute('name', select)
    select.style.width = '40%'
    select.classList.add('form-select')
    for (let i = 0; i < 3; i++) {
        const option = document.createElement('option')
        option.setAttribute('value', i)
        if (selected == i) option.setAttribute('selected', true)
        option.innerHTML = niveau[i]
        select.appendChild(option)
    }
    return document.querySelector('.content').appendChild(select)
})()


/**
 * Permet de créer un effet de chargement
 */
async function loading () {
    loader.style.display = "block"
    await new Promise(resolve => setTimeout(resolve, 300))
    loader.style.display = "none"
}


/**
 * Permet de séléctionner les questions et les réponses associées en fonction du select
 * @var Array tab
 */
let score = []
async function Selection(tab) {
    const select = document.querySelector('select')
    select.addEventListener('change', async () => {
        container.innerHTML = ''
        document.querySelector('.score').innerHTML = ''
        if (score.length > 0) {
            score = []
        }
        selected = select.value
        tab.forEach(async element => {
            await loading()
            await element.appendTo(container, selected)
            const valueRep = await element.checkReponses()
            score.push(valueRep)
        })
    })
}


/**
 * Remplit le tableau tabQuest avec des instances de la classe QCM
 */
async function useData() {
    try {
        const result = await recupData()
        const data = JSON.parse(result)
        data.forEach(element => {
            tableau.push(element)
        })

        tableau.forEach((element, index) => {
            const Questions = new QCM(index, `${element.valeur}`, `${element.reponses}`, `${element.correct}`, `${element.niveau}`)
            tabQuest.push(Questions)
        })

    }
    catch (error) {
        console.log(error)
    }
}

function testAnswers() {
    return new Promise(resolve => {
        const items = document.querySelector('ul')
        const allLi = document.querySelectorAll('li')
        allLi.forEach(element => {
            element.addEventListener('click', () => {
                resolve()
            })

        })
    })
}

/**
 * Affiche des questions et des réponses par défaut
 */
async function initialize () {
    tabQuest.forEach(async element => {
        await loading()
        await element.appendTo(container, 2)
        const valueRep = await element.checkReponses()
        score.push(valueRep)
    })
}

/**
 * Permet de calculer le score 
 * @returns null || number
 */
function vueScore() {
    let notes = null
    const allUl = document.querySelectorAll('ul')
    if (score.length == allUl.length && score.length !== 0) {
        notes = 0
        score.forEach(element => {
            if (element === true) notes++
        })
        return notes
    }
    else {
        return null
    }

}

/**
 * Affiche le bouton "Voir score" dans le DOM
 */
(function elScor() {
    const btn = document.createElement('button')
    btn.innerHTML = 'Voir score'
    btn.setAttribute('class', 'btn btn-primary btn-sm')
    return document.querySelector('.content').append(btn)
})()

/**
 * Affiche le score si toutes les questions ont été repondues
 */
async function affichageScore() {
    const btn = document.querySelector('button')
    btn.addEventListener('click', () => {
        const tousLesLi = document.querySelectorAll('li')
        const p = document.createElement('p')
        if (vueScore() !== null && vueScore() >= 0) {
            console.log(vueScore())
            p.innerHTML = `Votre score est de ${vueScore()} points`
            document.querySelector('.score').appendChild(p)
            tousLesLi.forEach(element => {
                if (element.getAttribute('data-index') == 'true') {
                    element.style.background = 'green'
                }
                else if (!element.classList.contains('li-fausse')) {
                    element.style.background = 'red'
                }
            })
        }
        else {
            alert("Veillez répondre à toutes les questions");
        }
    })
}

/**
 * Fonction principale qui appelle les autres fonctions de lancement
 */
(async function main() {
    await useData()
    await initialize()
    await Selection(tabQuest)
    await affichageScore()
})()
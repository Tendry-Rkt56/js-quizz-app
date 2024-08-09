
/**
 * Permet de saisir un élément du DOM
 * @param {HTMLElement} valeur 
 * @returns 
 */
export function getElement(valeur) {
    return document.querySelector(valeur)
}

export function createElement(valeur) {
    return document.createElement(valeur)
}

/**
 * recupération des données dans le fichier JSON
 * @returns 
 */

export async function recupData() {
    // var data = await fetch('http://127.0.0.1:5500/administrateur/script/function/objet.json')
    var data = await fetch('script/objet.json')
    if (data.ok) {
        var result = await data.json()
        return JSON.stringify(result)
    }
    else {
        throw new Error('IL y a une erreur')
    }
}


//------------------------------------------------
/**
 * Classe qui permet de créer des questions avec leur reponses respectives
 */
export class Quizz {
    #numero;
    #question;
    #reponses;
    #bonneReponses;
    #niveau;
    #tab;
    #nbrReponse;
    constructor(numero, question, reponses, bonneReponse, niveau) {
        this.#numero = numero
        this.#question = question
        this.#reponses = reponses || []
        this.#bonneReponses = bonneReponse
        this.#niveau = niveau
        this.#tab = []
    }

    get valeurQuestions() {
        return `${this.#question}`
    }

    get tousLesReponses() {
        return `${this.#reponses}`
    }

    get Niveau() {
        return `${this.#niveau}`
    }

    get tableau() {
        return `${this.#tab}`
    }

    set newQuestion(valeur) {
        this.#question = valeur
    }

    set newReponses(valeur) {
        this.#reponses = valeur
    }

    changeTablau() {
        if (!Array.isArray(this.#reponses)) {
            return this.#reponses = this.#reponses.split(',')
        }
        else {
            return this.#reponses
        }
    }

    appendTo(valeur) {
        var item = document.createElement('div')
        item.setAttribute('id', this.#numero)
        var h3_quest = document.createElement('h3')
        h3_quest.classList.add('questions')
        h3_quest.innerHTML = `${this.#question}`
        item.classList.add('item')

        if (this.changeTablau()) {
            var ul = document.createElement('ul')
            this.#reponses.forEach((element, index) => {
                var li = document.createElement('li')
                li.classList.add('li')
                li.innerHTML = `${element}`
                li.setAttribute('data-index', index == this.#bonneReponses ? 'true' : 'false')
                ul.appendChild(li)
            })
        }

        item.appendChild(h3_quest)
        item.appendChild(ul)

        return valeur.appendChild(item)

    }

    appendSelonNiv(valeur, index) {
        if (this.#niveau == index) {
            var item = document.createElement('div')
            item.setAttribute('id', this.#numero)
            var h3_quest = document.createElement('h3')
            h3_quest.classList.add('questions')
            h3_quest.innerHTML = `${this.#question}`
            item.classList.add('item')

            if (this.changeTablau()) {
                var ul = document.createElement('ul')
                this.#reponses.forEach((element, index) => {
                    var li = document.createElement('li')
                    li.classList.add('li')
                    li.innerHTML = `${element}`
                    li.setAttribute('data-index', index == this.#bonneReponses ? 'true' : 'false')
                    ul.appendChild(li)
                })
            }

            item.appendChild(h3_quest)
            item.appendChild(ul)

            return valeur.appendChild(item)
        }
    }

    // async selectItem() {
    //     return new Promise(resolve => {
    //         var item = document.getElementById(this.#numero)
    //         var each_item_li = document.querySelectorAll('ul > li')
    //         console.log('Yes resolve')
    //         resolve(each_item_li)
    //     })
    // }

    getLi() {
        var item = document.getElementById(this.#numero)
        return item.querySelectorAll('ul > li')
    }

    checkReponses() {
        var allLi = this.getLi()
        return new Promise(resolve => {
            for (let i = 0; i < allLi.length; i++) {
                allLi[i].addEventListener('click', (event) => this.cliquer(event, resolve))
            }
        })
    }

    cliquer(event, resolve) {
        if (event.target.classList.contains('clicked')) {
            return
        }

        var tousLesLi = this.getLi()

        tousLesLi.forEach(element => {
            element.classList.add('clicked')
        })

        var valueRep = event.target.getAttribute('data-index')
        if (valueRep == 'true') {
            resolve(true)
        }
        else resolve(false)

        event.target.classList.add('li-fausse')
    }

}
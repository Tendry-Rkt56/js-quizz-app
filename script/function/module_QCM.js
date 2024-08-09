/**
 * Classe permettant de créer des questions avec leur reponses respectives
 */
export class QCM {
    #numero;
    #question;
    #reponses;
    #correct;
    #niveau;
    constructor(numero, question, reponses, correct, niveau) {
        this.#numero = numero
        this.#question = question
        this.#reponses = reponses
        this.#correct = correct
        this.#niveau = niveau
    }

    /**
     * Change les reponses en tableau au cas ou
     * @returns Array
     */

    getNumero() {
        return `${this.#numero}`
    }

    changeTablau() {
        if (!Array.isArray(this.#reponses)) {
            return this.#reponses = this.#reponses.split(',')
        }
        else {
            return this.#reponses
        }
    }

    appendTo(valeur, selectItem, callback) {
        return new Promise(resolve => {
            if (this.#niveau == selectItem) {
                var item = document.createElement('div')
                var h3_quest = document.createElement('h3')
                item.setAttribute('id', this.getNumero())
                item.classList.add('item')
                h3_quest.classList.add('questions')
                h3_quest.innerHTML = `${this.#question}`

                if (this.changeTablau()) {
                    var ul = document.createElement('ul')
                    this.#reponses.forEach((element, index) => {
                        var li = document.createElement('li')
                        li.classList.add('li')
                        li.innerHTML = `${element}`
                        li.setAttribute('data-index', index == this.#correct ? 'true' : 'false')
                        ul.appendChild(li)
                    })
                }

                item.appendChild(h3_quest)
                item.appendChild(ul)
                resolve(valeur.appendChild(item))
                callback()
            }
        })
    }

    getLi() {
        var item = document.getElementById(this.getNumero())
        return item.querySelectorAll('ul > li')
    }

    checkReponses() {
        return new Promise(resolve => {
            var items = document.getElementById(this.getNumero())
            var allLi = items.querySelectorAll('ul > li')
            for (let i = 0; i < allLi.length; i++) {
                allLi[i].addEventListener('click', (event) => this.cliquer(event, resolve))
            }
        })
    }

    cliquer(event, resolve) {
        console.log('Bonjour le monde')
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
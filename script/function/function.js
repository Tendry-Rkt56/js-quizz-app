export function sum(a,b){
    return a + b 
}

export async function recupData(a,b){
    return new Promise((resolve,reject) => {
        try{
            if (a != b){
                resolve(a + b)
            }
            else reject(new Error('Les 2 nombres doivent etre differents'))
        }
        catch(error){
            reject(error)
        }
    })
}


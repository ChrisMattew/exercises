// Clonare l'oggetto
export function cloneObject(object) {
  return { ...object }
}

// Unire i due oggetti in un unico, senza modificare gli oggetti originali
export function mergeObjects(object1, object2) {
  return { ...object1, ...object2 }
}

// Dato un oggetto e un array con chiave-valore, aggiungere chiave-valore all'oggetto
// senza modificare l'originale, ma restituendo una copia
export function setProperty(object, [key, value]) {
  return { ...object, [key]: value }
}

// Convertire un oggetto contentene altri oggetti in array
// La chiave di ciascun oggetto va inserita nell'oggetto stesso come `key`
// Es.: { a: { name: 'X' }, b: { name: 'Y' } } diventa [{ key: 'a', name: 'X' }, b: { key: 'b', name: 'Y' }]
export function toArray(object) {
  return Object.entries(object).map(([key, value]) => ({
    key,
    ...value
  }))
}

// Dato un oggetto, restituire un nuovo oggetto mantenendo
// soltanto le chiavi i cui valori soddisfano la funzione `predicate` (a cui bisogna passare sia la chiave, sia il valore)
// Es.: { name: 'Kate', number1: 100, number2: 40, number3: 77 } con predicate = (key, value) => key === 'name' || value > 50
// restituisce  { name: 'Kate', number1: 100, number3: 77 }
export function filterObject(object, predicate) {
  return Object.fromEntries(
    Object.entries(object).filter(([key, value]) => predicate(key, value))
  )
}

// Data una chiave `key`, una funzione `getValue` per ottenere il valore associato a quella chiave e un oggetto `cache`,
// `getCachedValue` deve chiamare una sola volta `getValue` e conservare il valore ottenuto, in modo che se
// la funzione viene richiamata successivamente con la stessa chiave, venga restituito il valore senza richiamare `getValue`
export function getCachedValue(key, getValue, cache) {
  return cache[key] ? cache[key] : (cache[key] = getValue(key))
}

// Dato un array bidimensionale, dove ogni array interno è una coppia chiave-valore, convertirlo in un oggetto
// Es.: [['name', 'John'], ['age', 22]] diventa { name: 'John', age: 22 }
export function arrayToObject(array) {
  return array.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {})
}

// Come `arrayToObject`, ma tutti i valori di tipo array devono a loro volta essere trasformati in oggetti
// Controllare il test per vedere dato iniziale e risultato finale
export function arrayToObjectDeep(array) {
  return array.reduce(
    (obj, [key, value]) => ({
      ...obj,
      [key]: Array.isArray(value) ? arrayToObjectDeep(value) : value
    }),
    {}
  )
}

// Dato un oggetto e una funzione `predicate` da chiamare con la coppia chiave-valore,
// restituire true se almeno una delle proprietà dell'oggetto soddisfa la funzione `predicate`.
// Es.: { name: 'Mary', age: 99, children: 4 } con predicate = (key, value) => value > 10
// ritorna true perché è presente una proprietà maggiore di 10 (age)
export function hasValidProperty(object, predicate) {
  return Object.entries(object).some((args) => predicate(...args))
}

// Dato un oggetto, estrarre tutti i valori che sono a loro volta oggetti in un oggetto separato, usando come chiave il loro id;
// rimuovere la chiave nell'oggetto di partenza e sostituirla con `{nome_chiave}Id` e usare come valore l'id dell'oggetto estratto.
// Es.: { id: 1, name: 'John', car: { id: 33, manufacturer: 'Ford' } } restituisce due oggetti:
// { id: 1, name: 'John', carId: 33 } e l'altro { 33: { id: 33, manufacturer: 'Ford' } }
// Ritornare un array con i due oggetti (vedere il test per altri esempi)
// Idealmente dovrebbe funzionare per ogni oggetto trovato dentro l'oggetto di partenza, anche quelli annidati
export function normalizeObject(object) {
  const getNormalized = (object) =>
    Object.entries(object).reduce((obj, [key, val]) => {
      return !isObject(val) ? { ...obj, [key]: val } : { ...obj, [`${key}Id`]: val.id }
    }, {})

  const getEntities = (obj) =>
    Object.values(obj).reduce((obj, val) => {
      return isObject(val)
        ? {
            ...obj,
            [val.id]: getNormalized(val),
            ...getEntities(val)
          }
        : obj
    }, {})

  return [getNormalized(object), getEntities(object)]
}

function isObject(val) {
  return typeof val === 'object' && !Array.isArray(val) && val !== null
}

// Dato un tree del tipo
// 1.       A
//        / | \
// 2.    B  C  D
//      / \
// 3.  E   F
// restituire la profondità (in questo caso 3)
// Il tree ha la seguente struttura: { value: 'A', children: [{ value: 'B', children: [...] }, { value: 'C' }] }
export function getTreeDepth(tree) {
  return 1 + Math.max(0, ...(tree.children || []).map((node) => getTreeDepth(node)))
}

// Dato un tree come sopra, contare il numero di nodi "leaf", cioè quelli senza ulteriori figli (0 children)
// Considerando l'esempio sopra, i nodi "leaf" sono 4 (C, D, E, F)
export function countTreeLeafNodes(tree) {
  return (
    1 +
    Math.max(
      0,
      (tree.children || []).reduce(
        (acc, node) => (acc += 'children' in node ? 1 + getTreeDepth(node) : 1),
        0
      )
    )
  )
}

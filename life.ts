type lifeWord = (0 | 1)[][];

let wordSize = 100;

const randomWord: lifeWord = Array(wordSize)
  .fill(null)
  .map(() =>
    Array(wordSize)
      .fill(null)
      .map(() => Math.floor(Math.random() * 2))
  ) as lifeWord;


function getGeneration(word: lifeWord, generation = 1): lifeWord {
  if (generation < 1) return word;

  word = JSON.parse(JSON.stringify(word));

  expandWord(word);
  
  const row = Array(word[0].length).fill(0),
  auxWord: lifeWord = Array(word.length)
  .fill(null)
  .map(() => [...row]);
  
  word.forEach((row, rindex) => {
    row.forEach((cell, cindex) => {
      const cellNeighbors = [
        row[cindex - 1],
        row[cindex + 1],
        word[rindex + 1]?.[cindex],
        word[rindex + 1]?.[cindex + 1],
        word[rindex + 1]?.[cindex - 1],
        word[rindex - 1]?.[cindex],
        word[rindex - 1]?.[cindex + 1],
        word[rindex - 1]?.[cindex - 1],
      ],
      livingNeighbors = cellNeighbors.reduce<number>(
        (acc, neihbord) => (neihbord ? ++acc : acc),
        0
        );
        
        
        if (cell) {
          auxWord[rindex][cindex] =
          livingNeighbors == 2 || livingNeighbors == 3 ? 1 : 0;
        } else if (livingNeighbors == 3) auxWord[rindex][cindex] = 1;
      });
    });
    cutWord(auxWord);
  return getGeneration(auxWord, --generation);
}

function expandWord(word: lifeWord) {
  word.unshift(Array(word[0].length).fill(0));
  word.push(Array(word[0].length - 1).fill(0));
  word.forEach((row) => {
    row.unshift(0);
    row.push(0);
  });
}

function cutWord(word: lifeWord): void {
  let lastIndex = word.length - 1,
    everyFirstRowIsZero = !word[0].join("").includes("1"),
    everyLastRowIsZero = !word[lastIndex].join("").includes("1");


  if (everyFirstRowIsZero) {
    word.splice(0, 1);
    lastIndex--;
  }

  if (everyLastRowIsZero) {
    word.splice(lastIndex--, 1);
  }

  let everyFistColIsZero = true;
  let everyLastColIsZero = true;

  for (let row of word) {
    if (row[0]) everyFistColIsZero = false;
    if (row[row.length - 1]) everyLastColIsZero = false;
    if (!everyFistColIsZero && !everyLastColIsZero) break;
  }


  if (everyFistColIsZero) {
    word.forEach((row) => row.splice(0, 1));
  }
  if (everyLastColIsZero) {
    word.forEach((row) => row.splice(row.length - 1, 1));
  }

  if (
    everyFistColIsZero ||
    everyLastColIsZero ||
    everyFirstRowIsZero ||
    everyLastRowIsZero
  )
    return cutWord(word);
}

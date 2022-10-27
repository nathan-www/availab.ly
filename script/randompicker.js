const popular = [
    393,24,646380,405774,760883,597891,779782,1003180,543878,541134,551332,335797,10137,615457
]

const getRandomMovie = (elementNumber) => {
    Math.seedrandom(new Date().get() + elementNumber .toString())
    const i = Math.floor(Math.random() * popular.length)
    return popular[i]
}
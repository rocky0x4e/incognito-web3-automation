let listAdding = []

const addContent = async(key, value) => {
    console.log(key, value);
    listAdding.push({ key, value })
}

const resetContent = async() => {
    listAdding = []
}

const getContent = () => {
    return listAdding
}

module.exports = {
    addContent,
    getContent,
    resetContent
}
const addContext = require('mochawesome/addContext');
const addingContent = require("./addingContent");

beforeEach(function() {
    addingContent.resetContent()
})

afterEach(function() {

    for (const item of addingContent.getContent()) {
        if (item.value) {
            console.log({ item });
            addContext(this, {
                title: item.key,
                value: item.value
            });
        } else {
            console.log(item.key);
            addContext(this, {
                title: 'log',
                value: item.key
            });
        }

    }
})
const fs = require('fs');
const path = require('path');

const dataFolder = path.join(__dirname, 'data');

function getChatFilePath(target) {
    return path.join(dataFolder, `${target}_chat.json`);
}

function loadChat(target) {
    const filePath = getChatFilePath(target);

    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveChat(target, chat) {
    const filePath = getChatFilePath(target);
    const data = JSON.stringify(chat, null, 2);

    fs.writeFileSync(filePath, data, 'utf-8');
}

module.exports = {
    loadChat,
    saveChat,
};

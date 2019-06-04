let languages = ['en', 'ru', 'ua', 'bg', 'ro'];
let dic = {};
for(var i = 0; i < languages.length; i++) {
    const loadedAliases = require('./locale/' + languages[i]);
    dic[languages[i]] = loadedAliases.default;
}
exports.load = () => dic;
module.exports = class PassItem {
    constructor(name, text, desc, count, disabled, hidden) {
        this.name = name;
        this.text = text;
        this.desc = desc;
        this.count = count !== undefined ? count : 0;
        this.disabled = disabled !== undefined ? disabled : false;
        this.hidden = hidden !== undefined ? hidden : false;
    }
};
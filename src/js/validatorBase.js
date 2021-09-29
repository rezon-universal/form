module.exports = class validatorBase {
    constructor(form, it){
        this.form = form;
        this.it = it;
    }
    isValid() {
        console.log('Validator base\\ Is Valid\\True');
        return true;
    }
};
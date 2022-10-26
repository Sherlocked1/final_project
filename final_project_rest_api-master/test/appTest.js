const chai = require('chai')
var assert = chai.assert;

const  logic = require('./logic')

//describe
describe(
    'Main Apllication', function () {
        it('Tool unit testing.', function () {
            assert.equal(logic.isEven(2) , true)
            assert.equal(logic.isEven(3) , true)

        });
    },

)

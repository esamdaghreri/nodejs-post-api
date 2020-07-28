const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddleware = require('../middleware/is-auth');

describe('Auth middleware', () => {
    
    it('Should throw an error if no authorization header is preset', () => {
        const req = {
            get: function(headerName) {
                return null;
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
    });
    
    it('Should throw an error if the authorization header is only one string', () => {
        const req = {
            get: function(headerName) {
                return 'xxxx';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    it('Should yield a userId after decoding the token', () => {
        const req = {
            get: function(headerName) {
                return 'bearer ldkfhdsig09rdgiuhfdi';
            }
        };
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({
            userId: 'abc'
        })
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    });

    it('should throw an error if the token cannot be verified', () => {
        const req = {
            get: function(headerName) {
                return 'bearer xxxx';
            }
        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });
});

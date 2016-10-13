/**
 * Modules from the community: package.json
 */
var FABRICARE = require('./fabricare');
var expect = require('chai').expect;

var conf = {
    User: "user",
    Password: "password",
    Prefix: "prefix",
    Port: "0000",
    IP: "127.0.0.1"
};
var fab = new FABRICARE(conf);

describe('Customer Methods', function() {

    var testCustomer = { email: "test@first.com", firstName: "First", lastName: "Test" };
    var testQuery = { firstName: "First" };
    var testUpdate = { firstName: "Update" };
    var testCustomerId = 000001;

    it('should create a customer', function(done) {
        fab.Customer.CreateCustomer(testCustomer).then(function(res) {
            var response = JSON.parse(res);
            expect(response.Code).to.equal(200);
            expect(response.Status).to.equal("Success");

            expect(response.Data).to.be.an('object');
            expect(response.Data.CustomerID).to.be.a('number');

            testCustomerId = response.Data.CustomerID
            done();
        }).catch(done);
    });

    it('should get a customer with ID', function(done) {
        expect(testCustomerId).to.be.a('number');

        fab.Customer.GetCustomerById(testCustomerId).then(function(res) {
            var response = JSON.parse(res);
            expect(response.Code).to.equal(200);
            expect(response.Status).to.equal("Success");

            expect(response.Data).to.be.an('object');
            expect(response.Data.Customer).to.be.an('object');

            var c = response.Data.Customer;
            expect(c.Email).to.equal(testCustomer.email);
            expect(c.FirstName).to.equal(testCustomer.firstName);
            expect(c.LastName).to.equal(testCustomer.lastName);

            done();
        }).catch(done);
    });

    it('should get customer with query', function(done) {
        expect(testQuery).to.be.an('object');

        fab.Customer.GetCustomerWithQuery(testQuery).then(function(res) {
            var response = JSON.parse(res);
            expect(response.Code).to.equal(200);
            expect(response.Status).to.equal("Success");

            expect(response.Data).to.be.an('object');
            expect(response.Data.Customer).to.be.an('object');

            var c = response.Data.Customer;
            expect(c.Email).to.equal(testCustomer.email);
            expect(c.FirstName).to.equal(testCustomer.firstName);
            expect(c.LastName).to.equal(testCustomer.lastName);

            done();
        }).catch(done);
    });

    it('should update a customer', function(done) {
        expect(testCustomerId).to.be.a('number');
        expect(testUpdate).to.be.an('object');

        fab.Customer.UpdateCustomer(testCustomerId, testUpdate).then(function(res) {
            var response = JSON.parse(res);
            expect(response.Code).to.equal(200);
            expect(response.Status).to.equal("Success");

            expect(response.Data).to.be.an('object');
            expect(response.Data.CustomerID).to.be.a('number');
            expect(response.Data.CustomerID).to.equal(testCustomerId);

            done();
        }).catch(done);
    });
});

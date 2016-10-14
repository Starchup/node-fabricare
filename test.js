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
        fab.Customer.Create(testCustomer).then(function(res) {
            var response = JSON.parse(res);
            expect(response.Code).to.equal(200);
            expect(response.Status).to.equal("Success");

            expect(response.Data).to.be.an('object', "Data does not exist");
            expect(response.Data.CustomerID).to.be.a('number', "CustomerID is not a number or does not exist");

            testCustomerId = response.Data.CustomerID
            done();
        }).catch(done);
    });

    it('should find that the customer exists with ID', function(done) {
        expect(testCustomerId).to.be.a('number');

        fab.Customer.Exists(testCustomerId).then(function(res) {
            var response = JSON.parse(res);
            expect(response.Code).to.equal(200);
            expect(response.Status).to.equal("Success");

            expect(response.Data).to.be.an('object', "Data does not exist");
            expect(response.Data.CustomerID).to.be.a('number', "CustomerID is not a number or does not exist");
            expect(response.Data.CustomerID).to.equal(testCustomerId, "CustomerID does not match");

            done();
        }).catch(done);
    });

    it('should find a customer with ID', function(done) {
        expect(testCustomerId).to.be.a('number');

        fab.Customer.FindById(testCustomerId).then(function(res) {
            var response = JSON.parse(res);
            expect(response.Code).to.equal(200);
            expect(response.Status).to.equal("Success");

            expect(response.Data).to.be.an('object');
            expect(response.Data.Customer).to.be.an('object');

            var c = response.Data.Customer;
            expect(c.Email).to.equal(testCustomer.email, "Email does not match");
            expect(c.FirstName).to.equal(testCustomer.firstName, "FirstName does not match");
            expect(c.LastName).to.equal(testCustomer.lastName, "LastName does not match");

            done();
        }).catch(done);
    });

    it('should find a customer with query', function(done) {
        expect(testQuery).to.be.an('object');

        fab.Customer.FindWithQuery(testQuery).then(function(res) {
            var response = JSON.parse(res);
            expect(response.Code).to.equal(200);
            expect(response.Status).to.equal("Success");

            expect(response.Data).to.be.an('object');
            expect(response.Data.Customer).to.be.an('object');

            var c = response.Data.Customer;
            expect(c.Email).to.equal(testCustomer.email, "Email does not match");
            expect(c.FirstName).to.equal(testCustomer.firstName, "FirstName does not match");
            expect(c.LastName).to.equal(testCustomer.lastName, "LastName does not match");

            done();
        }).catch(done);
    });

    it('should update a customer', function(done) {
        expect(testCustomerId).to.be.a('number');
        expect(testUpdate).to.be.an('object');

        fab.Customer.Update(testCustomerId, testUpdate).then(function(res) {
            var response = JSON.parse(res);
            expect(response.Code).to.equal(200);
            expect(response.Status).to.equal("Success");

            expect(response.Data).to.be.an('object', "Data does not exist");
            expect(response.Data.CustomerID).to.be.a('number', "CustomerID is not a number or does not exist");
            expect(response.Data.CustomerID).to.equal(testCustomerId, "CustomerID does not match");

            done();
        }).catch(done);
    });
});

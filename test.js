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
            expect(res.Code).to.equal(200);
            expect(res.Status).to.equal("Success");

            expect(res.Data).to.be.an('object', "Data does not exist");
            expect(res.Data.CustomerID).to.be.a('number', "CustomerID is not a number or does not exist");

            testCustomerId = res.Data.CustomerID
            done();
        }).catch(done);
    });

    it('should find that the customer exists with ID', function(done) {
        expect(testCustomerId).to.be.a('number');

        fab.Customer.Exists(testCustomerId).then(function(res) {
            expect(res.Code).to.equal(200);
            expect(res.Status).to.equal("Success");

            expect(res.Data).to.be.an('object', "Data does not exist");
            expect(res.Data.CustomerID).to.be.a('number', "CustomerID is not a number or does not exist");
            expect(res.Data.CustomerID).to.equal(testCustomerId, "CustomerID does not match");

            done();
        }).catch(done);
    });

    it('should find a customer with ID', function(done) {
        expect(testCustomerId).to.be.a('number');

        fab.Customer.FindById(testCustomerId).then(function(res) {
            expect(res.Code).to.equal(200);
            expect(res.Status).to.equal("Success");

            expect(res.Data).to.be.an('object');
            expect(res.Data.Customer).to.be.an('object');

            var c = res.Data.Customer;
            expect(c.Email).to.equal(testCustomer.email, "Email does not match");
            expect(c.FirstName).to.equal(testCustomer.firstName, "FirstName does not match");
            expect(c.LastName).to.equal(testCustomer.lastName, "LastName does not match");

            done();
        }).catch(done);
    });

    it('should find a customer with query', function(done) {
        expect(testQuery).to.be.an('object');

        fab.Customer.FindWithQuery(testQuery).then(function(res) {
            expect(res.Code).to.equal(200);
            expect(res.Status).to.equal("Success");

            expect(res.Data).to.be.an('object');
            expect(res.Data.Customer).to.be.an('object');

            var c = res.Data.Customer;
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
            expect(res.Code).to.equal(200);
            expect(res.Status).to.equal("Success");

            expect(res.Data).to.be.an('object', "Data does not exist");
            expect(res.Data.CustomerID).to.be.a('number', "CustomerID is not a number or does not exist");
            expect(res.Data.CustomerID).to.equal(testCustomerId, "CustomerID does not match");

            done();
        }).catch(done);
    });
});

describe('Order Methods', function() {

    var now = new Date();
    var orderDate = now;

    now.setHours(now.getHours() + 24);
    var promisedDate = now;

    var testOrder = {
        customerId: 000001,
        hasInvoice: false,
        ordered: orderDate,
        promised: promisedDate,
        invNote1: "First Note",
        invNote2: 'Second Note',
        invMemo: 'Memo'
    };
    var testQuery = { invNote1: "First Note" };
    var testUpdate = { invNote1: "Updated Note" };
    var testOrderId = 1;

    it('should create an order', function(done) {
        fab.Order.Create(testOrder).then(function(res) {
            expect(res.Code).to.equal(200);
            expect(res.Status).to.equal("Success");

            expect(res.Data).to.be.an('object');
            expect(res.Data.OrderID).to.be.a('number');

            testOrderId = res.Data.OrderID;
            done();
        }).catch(done);
    });

    it('should find that the prder exists with ID', function(done) {
        expect(testOrderId).to.be.a('number');

        fab.Order.Exists(testOrderId).then(function(res) {
            expect(res.Code).to.equal(200);
            expect(res.Status).to.equal("Success");

            expect(res.Data).to.be.an('object', "Data does not exist");
            expect(res.Data.OrderID).to.be.a('number', "OrderID is not a number or does not exist");
            expect(res.Data.OrderID).to.equal(testOrderId, "OrderID does not match");

            done();
        }).catch(done);
    });

    it('should find an order with ID', function(done) {
        expect(testOrderId).to.be.a('number');

        fab.Order.FindById(testOrderId).then(function(res) {
            expect(res.Code).to.equal(200);
            expect(res.Status).to.equal("Success");

            expect(res.Data).to.be.an('object');
            expect(res.Data.Order).to.be.an('object');

            var o = res.Data.Order;
            expect(o.OrderID).to.equal(testOrderId, "OrderID does not match");
            expect(o.CustomerID).to.equal(testOrder.customerId, "CustomerID does not match");
            expect(o.HasInvoice).to.equal(false, "HasInvoice does not match");
            expect(new Date(o.Ordered)).to.be.a('date', "Ordered is not a date or does not exist");
            expect(new Date(o.Promised)).to.be.a('date', "Promised is not a date or does not exist");

            done();
        }).catch(done);
    });

    it('should update an order', function(done) {
        expect(testOrderId).to.be.a('number');
        expect(testUpdate).to.be.an('object');

        fab.Order.Update(testOrderId, testUpdate).then(function(res) {
            expect(res.Code).to.equal(200);
            expect(res.Status).to.equal("Success");

            expect(res.Data).to.be.an('object');
            expect(res.Data.OrderID).to.be.a('number');
            expect(res.Data.OrderID).to.equal(testOrderId);

            done();
        }).catch(done);
    });

        it('should mark an order as sold', function(done) {
            expect(testOrderId).to.be.a('number');

            fab.Order.Sold(testOrderId).then(function(res) {
                expect(res.Code).to.equal(200);
                expect(res.Status).to.equal("Success");

                expect(res.Data).to.be.an('object');
                expect(res.Data.OrderID).to.be.a('number');
                expect(res.Data.OrderID).to.equal(testOrderId);

                done();
            }).catch(done);
        });

        it('should get the order status', function(done) {
            expect(testOrderId).to.be.a('number');

            fab.Order.Status(testOrderId).then(function(res) {
                expect(res.Code).to.equal(200);
                expect(res.Status).to.equal("Success");

                expect(res.Data).to.be.an('object');

                var d = res.Data;
                expect(d.OrderID).to.equal(testOrderId, "OrderID does not match");
                expect(d.Finished).to.equal(false, "Order should not be finished");
                expect(d.Sold).to.equal(false, "Order should not be sold");

                done();
            }).catch(done);
        });
    });

    describe('Invoice Methods', function() {
        var testInvoiceId = 0001;

        it('should find that the invoice exists with ID', function(done) {
            expect(testInvoiceId).to.be.a('number');

            fab.Invoice.Exists(testInvoiceId).then(function(res) {
                expect(res.Code).to.equal(200);
                expect(res.Status).to.equal("Success");

                expect(res.Data).to.be.an('object', "Data does not exist");
                expect(res.Data.InvoiceID).to.be.a('number', "InvoiceID is not a number or does not exist");
                expect(res.Data.InvoiceID).to.equal(testInvoiceId, "InvoiceID does not match");

                done();
            }).catch(done);
        });

        it('should find an invoice with ID', function(done) {
            expect(testInvoiceId).to.be.a('number');

            fab.Invoice.FindById(testInvoiceId).then(function(res) {
                expect(res.Code).to.equal(200);
                expect(res.Status).to.equal("Success");

                expect(res.Data).to.be.an('object');
                expect(res.Data.Invoice).to.be.an('object');

                var i = res.Data.Invoice;
                expect(i.OrderID).to.be.a('number', "OrderID is not a number");
                expect(i.InvoiceID).to.equal(testInvoiceId, "InvoiceID does not match");
                expect(i.Finished).to.equal(false, "Order should not be finished");
                expect(i.Sold).to.equal(false, "Order should not be sold");
                expect(i.Total).to.be.a('number', "Total is not a number or does not exist");
                expect(i.Tax).to.be.a('number', "Tax is not a number or does not exist");

                expect(res.Data.Invoice).to.be.an('object');

                var ds = i.Detail;
                ds.forEach(function(d) {
                    expect(d.Typ).to.be.a('string', "Typ is not a string or does not exist");
                    expect(d.Qty).to.be.a('number', "Qty is not a number or does not exist");
                    expect(d.Pcs).to.be.a('number', "Pcs is not a number or does not exist");
                    expect(d.Amt).to.be.a('number', "Amt is not a number or does not exist");
                    expect(d.Dsc).to.be.a('string', "Dsc is not a string or does not exist");
                });

                done();
            }).catch(done);
        });
});

/**
 * Modules from the community: package.json
 */
var request = require('request-promise');

var DEFAULT_HEADERS = { 'Content-type': 'application/json' };

/**
 * Constructor
 */
var FABRICARE = function(config) {
    var self = this;

    self.Request = {

        CreateRequest: function(httpMethod, resource, identifier, method, body, query) {
            self.Util.validateArgument(resource, 'resource');
            self.Util.validateArgument(httpMethod, 'httpMethod');

            if (identifier === undefined) identifier = null;
            if (method === undefined) method = null;
            if (body === undefined) body = null;
            if (query === undefined) query = null;

            var url = self.Util.buildUrl(resource, identifier, method, query);
            var options = {
                headers: DEFAULT_HEADERS,
                uri: url,
                method: httpMethod,
                body: JSON.stringify(body),
                auth: {
                    'username': self.CONFIG.User,
                    'password': self.CONFIG.Password
                }
            };

            return request(options);
        }
    };

    self.Customer = {
        //Customer attributes
        /**
         * externalId
         * firstName
         * lastName
         * street
         * unit
         * city
         * state
         * zip
         * email
         * homePhone
         * cellPhone
         * workPhone
         * package
         * starch
         * comment
         * invReminder
         * notes
         * taxExempt
         **/

        Exists: function(customerId) {
            self.Util.validateArgument(customerId, 'customerId');

            return self.Request.CreateRequest('GET', 'customers', customerId, 'exists');
        },

        FindById: function(customerId) {
            self.Util.validateArgument(customerId, 'customerId');

            return self.Request.CreateRequest('GET', 'customers', customerId);
        },

        FindWithQuery: function(queryArguments) {
            return self.Request.CreateRequest('GET', 'customers', null, null, null, queryArguments);
        },

        Create: function(customer) {
            self.Util.validateArgument(customer, 'customer');
            self.Util.validateArgument(customer.email, 'customer.email');
            self.Util.validateArgument(customer.firstName, 'customer.firstName');
            self.Util.validateArgument(customer.lastName, 'customer.lastName');

            return self.Request.CreateRequest('POST', 'customers', null, null, customer);
        },

        Update: function(customerId, customer) {
            self.Util.validateArgument(customerId, 'customerId');
            self.Util.validateArgument(customer, 'customer');

            return self.Request.CreateRequest('POST', 'customers', customerId, null, customer);
        }
    };

    self.Order = {
        //Order attributes
        /**
         * externalId
         * customerId
         * Ordered
         * Promised
         * InvNote1
         * InvNote2
         * InvMemo
         **/

        Exists: function(orderId) {
            self.Util.validateArgument(orderId, 'orderId');

            return self.Request.CreateRequest('GET', 'orders', orderId, 'exists');
        },

        FindById: function(orderId) {
            self.Util.validateArgument(orderId, 'orderId');

            return self.Request.CreateRequest('GET', 'orders', orderId);
        },

        Create: function(order) {
            self.Util.validateArgument(order, 'order');
            self.Util.validateArgument(order.customerId, 'order.customerId');
            self.Util.validateArgument(order.ordered, 'order.ordered');

            order.ordered = order.ordered.toISOString();
            order.promised = order.promised.toISOString();

            return self.Request.CreateRequest('POST', 'orders', null, null, order);
        },

        Update: function(orderId, order) {
            self.Util.validateArgument(orderId, 'orderId');
            self.Util.validateArgument(order, 'order');

            return self.Request.CreateRequest('POST', 'orders', orderId, null, order);
        },

        Sold: function(orderId) {
            self.Util.validateArgument(orderId, 'orderId');

            return self.Request.CreateRequest('PATCH', 'orders', orderId);
        },

        Status: function(orderId) {
            self.Util.validateArgument(orderId, 'orderId');

            return self.Request.CreateRequest('GET', 'orders', orderId, 'status');
        }
    };

    self.Invoice = {
        //Invoice attributes
        /**
         * orderId
         * customerId
         * dept
         * rack
         * invoiced
         * promised
         * finished
         * paid
         * delivered
         * srvFees
         * coupons
         * discounts
         * savings
         * tax
         * total
         * paidAmt
         * detail
         * - typ
         * - qty
         * - dsc
         * - amt
         **/

        Exists: function(invoiceId) {
            self.Util.validateArgument(invoiceId, 'invoiceId');

            return self.Request.CreateRequest('GET', 'invoices', invoiceId, 'exists');
        },

        FindById: function(invoiceId) {
            self.Util.validateArgument(invoiceId, 'invoiceId');

            return self.Request.CreateRequest('GET', 'invoices', invoiceId);
        }
    };

    self.Util = {
        validateArgument: function(arg, name) {
            if (arg === null || arg === undefined) {
                throw new Error("Required argument missing: " + name);
            }
        },

        getBaseUrl: function() {
            return "https://" + self.CONFIG.IP + ":" + self.CONFIG.Port + "/" + self.CONFIG.Prefix;
        },

        isObject: function(prop) {
            return Object.prototype.toString.call(prop) === '[object Object]';
        },

        buildUrl: function(resource, id, method, query) {
            var url = this.getBaseUrl() + "/" + resource;

            if (id) url = url + "/" + id;
            if (method) url = url + "/" + method;
            if (query && this.isObject(query) && Object.keys(query).length > 0) {

                var queryArray = Object.keys(query).map(function(key, index) {
                    return key + "=" + query[key];
                });
                url = url + "?" + queryArray.join("&");
            }

            return url;
        }
    };

    self.Util.validateArgument(config.User, 'User');
    self.Util.validateArgument(config.Password, 'Password');
    self.Util.validateArgument(config.Prefix, 'Prefix');
    self.Util.validateArgument(config.Port, 'Port');
    self.Util.validateArgument(config.IP, 'IP');

    self.CONFIG = JSON.parse(JSON.stringify(config));

    return self;
};

module.exports = FABRICARE;

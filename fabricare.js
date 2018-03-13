/**
 * Modules from the community: package.json
 */
var request = require('request-promise');

var DEFAULT_HEADERS = {
    'Content-type': 'application/json'
};

/**
 * Constructor
 */
var FABRICARE = function (config)
{
    var self = this;

    self.Request = {

        CreateRequest: function (httpMethod, resource, identifier, method, body, query)
        {
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
                auth:
                {
                    'username': self.CONFIG.User,
                    'password': self.CONFIG.Password
                }
            };

            return request(options).then(function (res)
            {
                res = res.replace(/\\'/g, "'");
                var response = JSON.parse(res);
                if (!response || !response.Data) return Promise.reject(new Error("No data"));
                if (!self.Util.hasValidCode(response)) return Promise.reject(new Error(response.message));
                return Promise.resolve(response);
            }).catch(function (err)
            {
                if (err.statusCode && err.statusCode === 404)
                {
                    if (err.message && err.message.match(/No [a-zA-Z ]+ Found/i))
                    {
                        return Promise.resolve([]);
                    }
                }
                delete err.response;
                return Promise.reject(err);
            });
        }
    };

    self.Customer = {
        Exists: function (customerId)
        {
            self.Util.validateArgument(customerId, 'customerId');

            return self.Request.CreateRequest('GET', 'customers', customerId, 'exists');
        },

        FindById: function (customerId)
        {
            self.Util.validateArgument(customerId, 'customerId');

            return self.Request.CreateRequest('GET', 'customers', customerId);
        },

        FindByIdInvoices: function (customerId, status)
        {
            self.Util.validateArgument(customerId, 'customerId', customerId);
            self.Util.validateArgument(status, 'status', status);

            return self.Request.CreateRequest('GET', 'customers', customerId, status);
        },

        FindWithQuery: function (queryArguments)
        {
            return self.Request.CreateRequest('GET', 'customers', null, null, null, queryArguments);
        },

        Create: function (customer)
        {
            self.Util.validateArgument(customer, 'customer');
            self.Util.validateArgument(customer.email, 'customer.email');
            self.Util.validateArgument(customer.firstName, 'customer.firstName');
            self.Util.validateArgument(customer.lastName, 'customer.lastName');

            return self.Request.CreateRequest('POST', 'customers', null, null, customer);
        },

        Update: function (customerId, customer)
        {
            self.Util.validateArgument(customerId, 'customerId');
            self.Util.validateArgument(customer, 'customer');

            return self.Request.CreateRequest('POST', 'customers', customerId, null, customer);
        },

        CreditsBalance: function (customerId)
        {
            self.Util.validateArgument(customerId, 'customerId');

            return self.Request.CreateRequest('GET', 'customers', customerId, 'creditsbalance');
        }
    };

    self.Order = {
        Exists: function (orderId)
        {
            self.Util.validateArgument(orderId, 'orderId');

            return self.Request.CreateRequest('GET', 'orders', orderId, 'exists');
        },

        FindById: function (orderId)
        {
            self.Util.validateArgument(orderId, 'orderId');

            return self.Request.CreateRequest('GET', 'orders', orderId, 'verbose');
        },

        Create: function (order)
        {
            self.Util.validateArgument(order, 'order');
            self.Util.validateArgument(order.customerId, 'order.customerId');
            self.Util.validateArgument(order.ordered, 'order.ordered');
            self.Util.validateArgument(order.promised, 'order.promised');

            order.ordered = order.ordered.toISOString();
            order.promised = order.promised.toISOString();

            return self.Request.CreateRequest('POST', 'orders', null, null, order);
        },

        Update: function (orderId, order)
        {
            self.Util.validateArgument(orderId, 'orderId');
            self.Util.validateArgument(order, 'order');

            return self.Request.CreateRequest('POST', 'orders', orderId, null, order);
        },

        Sold: function (orderId)
        {
            self.Util.validateArgument(orderId, 'orderId');

            return self.Request.CreateRequest('PATCH', 'orders', orderId);
        },

        Status: function (orderId)
        {
            self.Util.validateArgument(orderId, 'orderId');

            return self.Request.CreateRequest('GET', 'orders', orderId, 'status');
        }
    };

    self.Invoice = {
        Exists: function (invoiceId)
        {
            self.Util.validateArgument(invoiceId, 'invoiceId');

            return self.Request.CreateRequest('GET', 'invoices', invoiceId, 'exists');
        },

        FindById: function (invoiceId)
        {
            self.Util.validateArgument(invoiceId, 'invoiceId');

            return self.Request.CreateRequest('GET', 'invoices', invoiceId, 'verbose');
        }
    };

    self.Route = {
        List: function ()
        {
            return self.Request.CreateRequest('GET', 'routes');
        }
    };

    self.RouteCustomer = {
        AllStops: function (routeId)
        {
            self.Util.validateArgument(routeId, 'routeId');

            return self.Request.CreateRequest('GET', 'routes', routeId, 'allstops');
        },

        ActiveStops: function (routeId)
        {
            self.Util.validateArgument(routeId, 'routeId');

            return self.Request.CreateRequest('GET', 'routes', routeId, 'activestops');
        },

        DeliveriesOnly: function (routeId)
        {
            self.Util.validateArgument(routeId, 'routeId');

            return self.Request.CreateRequest('GET', 'routes', routeId, 'deliveriesonly');
        },

        PickupsDeliveries: function (routeId)
        {
            self.Util.validateArgument(routeId, 'routeId');

            return self.Request.CreateRequest('GET', 'routes', routeId, 'pickupsdeliveries');
        },

        ActiveStopsInventory: function (routeId)
        {
            return self.Request.CreateRequest('GET', 'routes', routeId, 'activestopinventory');
        }
    };

    self.Stop = {
        FindWithQuery: function (queryArguments)
        {
            return self.Request.CreateRequest('GET', 'stops', null, null, null, queryArguments);
        },
    };

    self.Util = {
        hasValidCode: function (res)
        {
            if (res.statusCode && res.statusCode === 200) return true;
            if (res.Code && res.Code === 200) return true;
            return false;
        },

        validateArgument: function (arg, name)
        {
            if (arg === null || arg === undefined)
            {
                throw new Error("Required argument missing: " + name);
            }
        },

        getBaseUrl: function ()
        {
            return "https://" + self.CONFIG.IP + ":" + self.CONFIG.Port + "/" + self.CONFIG.Prefix;
        },

        isObject: function (prop)
        {
            return Object.prototype.toString.call(prop) === '[object Object]';
        },

        buildUrl: function (resource, id, method, query)
        {
            var url = this.getBaseUrl() + "/" + resource;

            if (id) url = url + "/" + id;
            if (method) url = url + "/" + method;
            if (query && this.isObject(query) && Object.keys(query).length > 0)
            {

                var queryArray = Object.keys(query).map(function (key, index)
                {
                    return key + "=" + query[key];
                });
                url = url + "?" + queryArray.join(",");
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
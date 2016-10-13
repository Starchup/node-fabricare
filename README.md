# node-fabricare
Fabricare POS Wrapper in NodeJS, fully promisified

#### Initialization

```
var FABRI = require('node-fabricare');
var options = {
    User: "your_user",
    Password: "your_password",
    Prefix: "your_prefix",
    Port: "your_port",
    IP: "your_ip"
}
var pos = new FABRI(options);
```


#### Basic use

Call fabricare for full documentation, but here are a few basics:

```
pos.Customer.CreateCustomer({ email: "a@b.com", firstName: "a", lastName: "b" });
pos.Customer.GetCustomer("id");
pos.Customer.GetCustomers({ firstName: "c" });
pos.Customer.UpdateCustomer("id", { firstName: "d" });
```


#### Tests

`npm test` will run a linter and the tests in `test.js`  
The tests will not pass unless you edit the configuration there and set it to your Fabricare Instance.  
Feel free to use those tests as reference for your implementation.  
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
FABRI.Customer.CreateCustomer({ email: "a@b.com", firstName: "a", lastName: "b" });
FABRI.Customer.GetCustomer("id");
FABRI.Customer.GetCustomers({ firstName: "c" });
FABRI.Customer.UpdateCustomer("id", { firstName: "d" });
```
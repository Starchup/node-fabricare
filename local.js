// var fab = new require('./fabricare')(
// {
//     User: "user",
//     Password: "password",
//     Prefix: "prefix",
//     Port: "0000",
//     IP: "127.0.0.1"
// });

var config = {
    "name": "fabricare",
    "account": "ChampsCleaners",
    ...
};
var fab = new require('./fabricare')(
{
    IP: config.host,
    User: config.account,
    Password: config.key,
    Prefix: 'sup',
    Port: config.port,
});

fab.Route.List().then(console.log).catch(console.log);
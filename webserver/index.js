"use strict";
const aws = require("@pulumi/aws");

let size = "t2.micro";
let ami = "ami-0f9ae750e8274075b";

let group = new aws.ec2.SecurityGroup("webserver-group", {
  ingress: [
    { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] },
    { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
    { protocol: "tcp", fromPort: 22, toPort: 22, cidrBlocks: ["0.0.0.0/0"] }
  ]
});

let userData = `#!/bin/bash
echo "Hello, World!" > index.html
nohup python -m SimpleHTTPServer 80 &`;

let server = new aws.ec2.Instance("webserver-www", {
  instanceType: size,
  securityGroups: [group.name],
  ami,
  userData
});

exports.publicIp = server.publicIp;
exports.publicHostName = server.publicDns;

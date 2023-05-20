---
title: 'Authentication using NGINX'
description: 'Authentication using NGINX'
date: 'December 11 2021'
thumbnail: 'nginx.png'
tags: 'security'
excerpt: "In this tutorial I'll show the main type of authentication NGINX open-source has to offer and how simple they are to implement"
draft: true
---

In this tutorial I'll show the main type of authentication NGINX open-source has to offer and how simple they are to implement.
The main authentication methods I'm going to cover on this guide are:

- Basic authentication
- JWT authentication

Those authentication methods are commonly used in the web-development field, that's why I've decided to omit some other authentication methods, because I want to cover those which you'll most likely face and need to implement.

First I'll explain why would we want to implement it on NGINX. There are other ways and SDK almost for every programing language that allow you to simply implement it, so why would you want to implement an authentication on NGINX ?

The reasons are simple:

- NGINX is a great solution for a front-controller, API gateway etc
- Lower footprint, NGINX code is being executed before the application layer is even hit, allowing to skip the interpretation layer of some high level languages
- NGINX is written in C, expect some blasting fast execution time (not that I claim that every C code is fast, but in that case NGINX code is well optimized and it's really fast)
- Having authentication in a centralized location makes it easier to maintain applications / micro-services

Now that we know the reasons of implementing it this way, let's assume we have the following very simple application:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    Hello World!
  </body>
</html>
```

And our /etc/nginx/conf.d/default.conf file is as follows:

```nginx
server {
    server_name example.com;
    listen 80;

    location / {
        root /var/www/html;
        index index.html index.htm;
    }
}
```

At the end the directory structure should look like this:

```sh
├── conf.d
│   └── default.conf
└── html
    └── index.html
```

I'll start up a new NGINX container webserver locally, I'll use docker to ease the installation process:

```sh
docker run -d -v ${PWD}/html:/var/www/html -v ${PWD}/conf.d:/etc/nginx/conf.d -p 80:80 --name nginx nginx:alpine
```

In conf.d I store the NGINX configuration mentioned above, and inside of html directory I store the html structure that I've mentioned previously.
When I run the docker command I mount those files in the right locations inside of the NGINX alpine container, where it's expecting to load them from, so I can quickly test it.
I also expose port 80 to my host-machine so I can view it in the browser.

Alright, if we open localhost in the browser on port 80, we should see our beautiful **Hello World!** application with the above mentioned HTML5 markup.

## Basic Authentication

Now let's assume this page contain some valuable information and should be password protected, assuming it's highly secured, we can implement basic authentication.

To do that we need to tweak the NGINX configuration a bit:

```nginx
server {
    server_name example.com;
    listen 80;
    auth_basic "My Secured Site";
    auth_basic_user_file /etc/nginx/htpasswd;

    location / {
        root /var/www/html;
        index index.html index.htm;
    }
}
```

Notice I only added auth_basic and auth_basic_user_file.
The auth_basic is the name for the secured area and auth_basic_user_file is the file which you'll store on the server with user's names and encrypted passwords.
By default NGINX forbid any access to the web-site, unless it finds a user with the right password in that file.
For creating a user, we need an encryption tool called htpasswd, this tool is available in apache2-utils package let's install it inside of the same container:

```sh
docker exec -it nginx apk --update add apache2-utils
```

And create a user using this tool:

```sh
docker exec -it nginx htpasswd -c /etc/nginx/htpasswd myuser
```

This will prompt you for typing a new password. Retype the password and confirm. After completion you should see a new entry inside of /etc/nginx/.htpasswd file inside of the container, the content of that file should look similar to the following:

```sh
myuser:<encrypted password>
```

Alright, user creation is complete, we just need to reload the webserver (every time you add a new user you need to reload the process configurations):

```sh
docker exec -it nginx nginx -s reload
```

Let's visit the http://localhost again, now let's type the username **myuser** and the password you entered when creating that htpasswd file, and that's it you are able to visit the website.
If you need another user, you can simply rerun that same commands:

```sh
docker exec -it nginx htpasswd -c /etc/nginx/htpasswd myuser2 # enter the password for that user and confirm it
docker exec -it nginx nginx -s reload # reload the NGINX process configurations
```

This is all that is needed for basic auth, it's the simplest form of authentication and that's where the name also comes from.

## JWT Authentication

Json Web Token (JWT), is modern authentication method that allow the clients to also pass useful information about their request. Their payload is signed normally with an algorithm sha256, that makes it almost impossible to reverse. This token consist of 3 main parts - header, payload and footer. The payload of that token is not encrypted, it's possible to view it using for example the [official JWT website](https://jwt.io/).

Brief overview of what JWT is and why would we want to use it - the main benefit of using JWT authentication is that this payload cannot be modified by a malicious attacker, because its payload is signed by the server, if the payload, which contain all the useful information about that client (i.e, username, role etc), is modified, say an attacker might try to change the role from a **regular user** to an **admin**, the server will try to match that token with the key that this token was originally signed, and if it doesn't match the server will reject that token.
Let's explore how JWT could be implemented in NGINX open-source.

NGINX Plus (paid version of NGINX) offers JWT authentication module out of the box, but since I assume we want to use the open-source solution, I'll use NJS script to implement this authentication.

NGINX offers different ways to extend its API, you can use one of the following to extend NGINX API:

- C Modules
- Perl
- Lua
- Javascript (NJS)

For the sake of simplicity we'll use NJS. Javascript fits pretty well with the nature of asyncrounse tasks of NGINX. When we use NJS we're validating the tokens on the front controller on an higher level before we actually letting the client hit the application, additionally this way we avoid using redundant authentication methods when implementing it on the application layer. Centralizing the responsibility for authentication is essential to avoid gaps and security holes.

To implement JWT using javascript crypto library which is built-into NJS, it's pretty straight-forward and it's doing all of the heavy lifting for us, so we don't have to deal with low-level cryptographic.
First I'll create a **main.js** file in **njs** folder, where I'll expose some of it's functionality to be used by NGINX configurations:

```javascript
const key = 'secret';
const claims = {
  iss: 'nginx',
  sub: 'alice',
  role: 'admin',
};

async function login(r) {
  if (r.method !== 'POST') {
    r.return(
      405,
      JSON.stringify({
        status: 'INVALID',
        message: 'Method not allowed',
      }),
    );
    return;
  }

  const body = JSON.parse(r.requestBody);
  if (body.username === 'alice' && body.password === 'secret') {
    const token = await jwt(r);
    const reply = {
      status: 'OK',
      token,
    };
    r.return(200, JSON.stringify(reply));
  } else {
    r.return(
      403,
      JSON.stringify({
        status: 'INVALID',
        message: 'Invalid username or password',
      }),
    );
  }
}

async function generate_hs256_jwt(init_claims, key, valid) {
  let header = { typ: 'JWT', alg: 'HS256' };
  let claims = Object.assign(init_claims, {
    exp: Math.floor(Date.now() / 1000) + valid,
  });

  let data = [header, claims]
    .map(JSON.stringify)
    .map((v) => Buffer.from(v).toString('base64url'))
    .join('.');

  let wc_key = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  let sign = await crypto.subtle.sign({ name: 'HMAC' }, wc_key, data);

  return data + '.' + Buffer.from(sign).toString('base64url');
}

function jwt(r) {
  return Promise.resolve(generate_hs256_jwt(claims, key, 3600));
}

async function verify(r) {
  if (!r.headersIn.Authorization) {
    r.return(
      403,
      JSON.stringify({
        status: 'INVALID',
        message: 'Authorization header is missing',
      }),
    );
    return;
  }
  const token = r.headersIn.Authorization.split(' ')[1];
  const parts = token.split('.');
  const header_b64 = parts[0];
  const payload_b64 = parts[1];
  const signature_b64 = parts[2];

  if (parts.length !== 3) {
    r.return(
      403,
      JSON.stringify({
        status: 'INVALID',
        message: 'JWT has too many or too little segments',
      }),
    );
  }

  const header_json = Buffer.from(header_b64, 'base64url').toString();
  const header_obj = JSON.parse(header_json);

  if (header_obj.alg === 'HS256') {
    const wc_key = await crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify(
      { name: 'HMAC' },
      wc_key,
      Buffer.from(signature_b64, 'base64url'),
      Buffer.from(header_b64 + '.' + payload_b64),
    );
    if (valid) {
      r.internalRedirect('@backend');
    } else {
      r.return(403, JSON.stringify({ status: 'INVALID', message: 'Failed to verify JWT' }));
    }
  } else {
    r.return(403, JSON.stringify({ status: 'INVALID', message: 'Algorithm not supported' }));
  }
}

export default { verify, login };
```

Let's assume we have only one user that we want to sign this token for, afterwards I'll extend it's functionality to be a bit more flexible, you can see at the top of the file I configured a claims object for Alice, she will have a role of an admin and the issuer is NGINX.
You can also notice that I hard-coded "secret" as the private key I want to use for the signing the token, this is of course just for demonstrating purposes kept simple, don't worry too much about it now, we'll make it more flexible later.
At the bottom of the file you can see I only export verify and login functions, those will be important later on when we use NGINX configurations.

- login function is handling the initial login where in order for alice to request a signed JWT, she'll need to send her credentials, username and password, to authenticate.
- verify function is handling the verification of the token that is being used by the requester. If that token was modified the signature made by NGINX will fail and therefore that token will no longer be valid. However, if everything went well, and this token is valid the request would be redirected to a location block defined in our server block called @backend

For this example I'm using HS256 algorithm.

That's it for this part, that's all we need to do for the authentication business logic.

Now how can we use this module ? let's create a conf.d/default.conf file:

```nginx
js_import main from njs/main.js;

server {
    server_name example.com;
    listen 80;

    location / {
        js_content main.verify;
    }

    location /login {
        js_content main.login;
    }

    location @backend {
        internal;
        root /var/www/html;
        index index.html;
    }
}
```

One last file is needed, which is the **nginx.conf**, the main configuration file of NGINX need to be slightly modified, we need to load an extension in order for use to use NJS:

```nginx
load_module modules/ngx_http_js_module.so;

user  nginx;
worker_processes  auto;

error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
```

Note it's a standard configuration, all I've added is the top line where it's written load_module.

I'll also create a small html/index.html file to simulate our backend secured service, but of course here you can load whatever service you like:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    Hello World!
  </body>
</html>
```

If you followed along the directory structure at the end should look like this:

```sh
.
├── conf.d
│   └── default.conf
├── html
│   └── index.html
├── nginx.conf
└── njs
    └── main.js
```

That's it, alright, let's test that it works as expected, I'll spin up a docker container:

```sh
docker run --rm -it \
  -v ${PWD}/html:/var/www/html \
  -v ${PWD}/conf.d:/etc/nginx/conf.d \
  -v ${PWD}/njs:/etc/nginx/njs \
  -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf \
  -w /etc/nginx \
  -p 80:80 \
  --name nginx \
  nginx:alpine
```

Now we can use a one-liner to get access to the secured backend:

```sh
TOKEN=$(curl -s -X POST -d '{"username":"alice","password":"secret"}' http://localhost/login | jq --raw-output .token); curl -X GET -H "Authorization: Bearer $TOKEN" http://localhost/
```

I'll break it down and explain what are we actually doing with the above mentioned one-liner.
Note that as a client I'm creating a TOKEN variable with the initial credentials of alice for requesting a signed JWT, I'm using jq util to parse the output and fetch only the JWT string.
With that token I'm then doing a sub-sequent request to the actual service at **/**, since this block is configured with main.verify function it will call the javascript function we have in njs directory to check if that's a valid token, if it is, the redirect to @backend location block will occur, otherwise the request would be rejected.

To test a rejection you can try to break these requests into 2 requests, i.e:

```sh
TOKEN=$(curl -s -X POST -d '{"username":"alice","password":"secret"}' http://localhost/login | jq --raw-output .token)
echo $TOKEN;
```

Let's grab this token and act as the hacker and try to modify it's content for example let's change alice role to super-admin (I'll use JWT official website to modify the payload).
Let's copy the newly modified token and assign it to MALICIOUS_TOKEN env variable and request that service again:

```sh
MALICIOUS_TOKEN=<add the modified JWT token here>
curl -X GET -H "Authorization: Bearer $MALICIOUS_TOKEN" http://localhost/
```

You should get the following message:

```sh
{"status":"INVALID","message":"Failed to verify JWT"}
```

Means the verification was not successful, since we modified the payload of the signed token that was originally signed by NGINX with "secret" private key is no longer valid and therefore the request is rejected.

You can immediately notice what's the benefits of having this module centralized, if you have another backend for example that requires authentication, all you need to do is copy that default server block and rename that server name, and you have another backend that accepts exclusively authenticated requests.

And that's the gist of it, the above mentioned should be sufficient to get you up and running. But if you want to continue reading, I'm going now to make the authentication more secure and flexible.

So what actions do we need to take in order to improve it ?

### Objectives

1. First I would like to have some data store for users credentials and verify their password with an hashed password from the data store, for each user we might also want to have a roles column which will be used for authorization and specify what actions a given user can do on the downstream backend
2. Secondly I would like to implement RS256 Algorithm, this is a bit more complicated the HS256 (HMAC), because it involves private keys and public keys that generated by different parties, it's normally good to reduce the risk of compromised private key and it helps to distinguish which party signed that token. With HS256 that using HMAC it is not possible to distinguish which party signed that JWT token since, both parties are sharing the same secret key
3. Lastly I want to pass the details of the user to the downstream server, so the application can handle the authorizations part

To tackle the first objective I'll first create a small util that will generate new users with roles, I'll call this file **utils/add_user.js** (this makes our application stateful but for the sake of simplicity I've chosen to write the users to a file, you could choose whatever datastore you want for your users, preferability you should choose for a light weight database lookup like redis or mongodb, or choose one of your favorite cloud providers data stores):

```javascript
#!/usr/bin/node

const secret = 'secret';

const crypto = require('crypto');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let username = '';
let password = '';
let roles = [];

rl.question('Choose username: ', (u) => {
  username = u;
  rl.question('Choose password: ', (p) => {
    password = p;
    rl.question('Assign roles: ', (r) => {
      roles = r.split(',');
      rl.close();

      let users = {};

      if (fs.existsSync('./data/users.json')) {
        users = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
      }

      const hashedPassword = crypto.createHmac('sha256', secret).update(password).digest('hex');

      users[username] = {
        username,
        password: hashedPassword,
        roles,
      };

      fs.writeFileSync('./data/users.json', JSON.stringify(users, null, 2));

      console.log(`User ${username} has been added!`);
    });
  });
});
```

Now we can simply create users using this CLI, it'll index all users by their username so it's easier to lookup using O(1) complexity.
Afterward we'll need to modify the njs/main.js file to lookup for users from that data store and attempt to authenticate them if their credentials are correct.

For testing purposes I'll create a user called test, its password would be secret and the role would be admin.

Let's now modify the login function to check for that user's credentials:

```javascript

```

Let's rerun the nginx, this time I'll mount the data into the nginx container at /etc/nginx/data:

```sh
docker run --rm -it \
  -v ${PWD}/html:/var/www/html \
  -v ${PWD}/conf.d:/etc/nginx/conf.d \
  -v ${PWD}/njs:/etc/nginx/njs \
  -v ${PWD}/nginx.conf:/etc/nginx/nginx.conf \
  -v ${PWD}/data:/etc/nginx/data \
  -w /etc/nginx \
  -p 80:80 \
  --name nginx \
  nginx:alpine
```

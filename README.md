# deno-smtp-connection
 A Deno Smtp connection module to be used with a Smtp Client

This module is responsible to establish a connection with a Smtp Server.
It helps sending smtp server commands and exposes the stmp server response.

## Features Roadmap
- TLS connection on port 465 => implemented 
- BASIC connection on port 25 => To be tested
- STARTTLS connection on port 587 or 2525 => Buggy atm, not supported.

## Usage
```ts
import * as SmtpConnection from "https://deno.land/x/smtp_connection@v0.2.4-alpha/mod.ts";
import type * as Smtp from "https://deno.land/x/smtp_connection@v0.2.1-alpha/mod.ts";

const options: Smtp.ConnectTlsOptions = {
    securityProtocol: 'TLS' as Smtp.SecurityProtocol,
    hostname: 'smtp.example.com',
    port: 465
};

const smtpConn = SmtpConnection.giveConnection( options );

// check if smtp server is ready

const serverResponse: string[] = await smtpConn.serverReplies();
const readyMessage = serverResponse.pop();
const serverIsReady =  readyMessage.startsWith('220');

// then send greeting

if ( serverIsready ) {
    const greetResponse: string[] = await smtpConn.clientCommands('HELO wolrd.com\r\n');
    const greetMessage = greetResponse.pop();
    const greetSuccess = greetMessage.startsWith('250');

    if ( greetSuccess )
        // do something...
}

```
## Test
To run the test you must create a `test.config.json` file providing the necessary config.

```json
// test.config.json
{
    "BASIC": {
        "securityProtocol": "BASIC",
        "hostname": "smtp.server.com",
        "port": 25
    },        
    
    "TLS": {
        "securityProtocol": "TLS",
        "hostname": "smtp.server.com",
        "port": 465
    },
    "SARTTLS": {
        "securityProtocol": "STARTTLS",
        "hostname": "smtp.server.com",
        "port": 587
    }
}
```
or you can pick the one you want to test
```json
// test.config.json
{
    "BASIC": null,
    "TLS": {
        "securityProtocol": "TLS",
        "hostname": "smtp.server.com",
        "port": 465
    },
    "SARTTLS": null
}
```
change `hostname` to the smtp address from an email provider.

Then in the console run `deno test --allow-net`;

If you experience errors while running the test like `corrupted data` or `handshake not complete`
It probably comes from Deno itslef being strict on security, 
anyway you can log an issue in this repo and I will relay those kind of issues to the Deno Team.

## Scope of this module
- To optimize support for smtp connections using basic, Tls or StartTls protocols
- Anything that can increase the quality or performance of sending smtp server command and receiving smtp server response.

## Out of scope of this module
- Interpetation of smtp server responses
- formating of smtp command

For this check the project Smtp Client (I will publish soon).

## Contributing 
you are welcome ;)

## Thanks
This module was inspired from [deno-smtp](https://github.com/manyuanrong/deno-smtp)
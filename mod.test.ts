import { assert } from "https://deno.land/std/testing/asserts.ts";

import * as SmtpConnection from "./mod.ts";
import type * as Smtp from "./mod.ts";
import config from "./test.config.json" assert { type: 'json' };


Deno.test('Give TLS connection and Greets Smtp server', async () => {

    const { securityProtocol, hostname, port } = config.TLS;

    const tlsConn = await SmtpConnection.giveConnection({
        securityProtocol: securityProtocol as Smtp.SecurityProtocol,
        hostname,
        port
    });

    const serverResponse = await tlsConn.serverMessage();
    const message = serverResponse.pop();
    
    const serverReady = message?.startsWith('220');

    const greetMessage = await tlsConn.tryCmd('HELO 127.0.0.1');
    const serverGreet = greetMessage.pop();
    const greetSuccess = serverGreet?.startsWith('250'); 

    console.log( message );
    console.log( serverGreet );

    tlsConn.close();

    assert( serverReady );
    assert( greetSuccess );

});


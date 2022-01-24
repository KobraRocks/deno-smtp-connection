import { assert } from "https://deno.land/std/testing/asserts.ts";

import * as SmtpConnection from "./mod.ts";
import type * as Smtp from "./mod.ts";
import config from "./test.config.json" assert { type: 'json' };


const { BASIC, TLS, STARTTLS } = config;

if ( BASIC ) {
    Deno.test('Give BASIC connection and Greets Smtp server', async () => {

        const { securityProtocol, hostname, port } = BASIC;
    
        const Conn = await SmtpConnection.giveConnection({
            securityProtocol: securityProtocol as Smtp.SecurityProtocol,
            hostname,
            port
        });
    
        const serverResponse = await Conn.serverMessage();
        const message = serverResponse.pop();
        
        const serverReady = message?.startsWith('220');
    
        const greetMessage = await Conn.clientCommands('HELO 127.0.0.1\r\n');
        const serverGreet = greetMessage.pop();
        const greetSuccess = serverGreet?.startsWith('250'); 
    
        console.log( message );
        console.log( serverGreet );
    
        Conn.close();
    
        assert( serverReady );
        assert( greetSuccess );
    
    });
}


if ( TLS ) {
    Deno.test('Give TLS connection and Greets Smtp server', async () => {

        const { securityProtocol, hostname, port } = TLS;
    
        const tlsConn = await SmtpConnection.giveConnection({
            securityProtocol: securityProtocol as Smtp.SecurityProtocol,
            hostname,
            port
        });
    
        const serverResponse = await tlsConn.serverMessage();
        const message = serverResponse.pop();
        
        const serverReady = message?.startsWith('220');
    
        const greetMessage = await tlsConn.clientCommands('HELO 127.0.0.1\r\n');
        const serverGreet = greetMessage.pop();
        const greetSuccess = serverGreet?.startsWith('250'); 
    
        console.log( message );
        console.log( serverGreet );
    
        tlsConn.close();
    
        assert( serverReady );
        assert( greetSuccess );
    
    });
}


if ( STARTTLS ) {
    Deno.test('Give TLS connection and Greets Smtp server', async () => {

        const { securityProtocol, hostname, port } = STARTTLS;
    
        const tlsConn = await SmtpConnection.giveConnection({
            securityProtocol: securityProtocol as Smtp.SecurityProtocol,
            hostname,
            port
        });
    
        const serverResponse = await tlsConn.serverMessage();
        const message = serverResponse.pop();
        
        const serverReady = message?.startsWith('220');
    
        const greetMessage = await tlsConn.clientCommands('HELO 127.0.0.1\r\n');
        const serverGreet = greetMessage.pop();
        const greetSuccess = serverGreet?.startsWith('250'); 
    
        console.log( message );
        console.log( serverGreet );
    
        tlsConn.close();
    
        assert( serverReady );
        assert( greetSuccess );
    
    });
}



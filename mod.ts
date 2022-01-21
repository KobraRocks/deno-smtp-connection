// Copyright 2018-2022 Kobra Rocks (https://kobra.rocks). All rights reserved. MIT license.

import type { ConnectOptions, ConnectTlsOptions, StartTlsOptions, SecurityProtocol } from "./options.ts";
import { Conn, TlsConn } from "./connections.ts";

const PROTOCOL_LIST = {
    BASIC: "BASIC",
    TLS: "TLS",
    STARTTLS: "STARTTLS"
};

const MODULE_NAME = 'SmtpConnection';

function connect ( options: ConnectOptions ): Promise<Deno.Conn> {

    return Deno.connect( options )
        .catch( ( reason ) => { throw new Error(`${MODULE_NAME} connect() ERROR ${reason.message}`); } );

}

async function connectTls ( options: ConnectTlsOptions ): Promise<Deno.TlsConn> {
const { hostname, port, caCerts } = options;
if ( Array.isArray( caCerts ) && caCerts.length > 0 ) {
    const caCert = await Deno.readTextFile( caCerts[0] );
    return Deno.connectTls({ caCerts:[caCert], hostname, port } )
        .catch( ( reason ) => { throw new Error(`${MODULE_NAME} connectTls() ERROR ${reason.message}`); } );
}   

return Deno.connectTls( options )
    .catch( ( reason ) => { throw new Error(`${MODULE_NAME} connectTls() ERROR ${reason.message}`); } );
}

async function startTls ( options: StartTlsOptions ): Promise<Deno.TlsConn>  {
const conn = await Deno.connect( options )
    .catch( ( reason ) => { throw new Error(`${MODULE_NAME} startTls() ERROR ${reason.message}`); } );

if ( Array.isArray( options.caCerts ) && options.caCerts.length > 0 ) {
    const caCert = await Deno.readTextFile( options.caCerts[0] );
    return Deno.startTls( conn , { caCerts:[caCert], hostname: options.hostname } )
        .catch( ( reason ) => { throw new Error(`${MODULE_NAME} startTls() ERROR ${reason.message}`); } );
}

return Deno.startTls( conn , options )
    .catch( ( reason ) => { throw new Error(`${MODULE_NAME} startTls() ERROR ${reason.message}`); } );
}


export async function giveConnection ( options: ConnectOptions | ConnectTlsOptions | StartTlsOptions ): Promise<Conn | TlsConn> {
    
    let conn;

    if ( options.securityProtocol === PROTOCOL_LIST.STARTTLS ) {
        console.log(' starting a STARTTLS connection ');

        conn = await startTls( options );
        if ( conn ) return new TlsConn( conn, options );
    }

    if ( options.securityProtocol === PROTOCOL_LIST.TLS ) {
        console.log(' starting a TLS connection ');

        conn = await connectTls( options );
        if ( conn ) return new TlsConn( conn, options );
    }


    if ( options.securityProtocol === PROTOCOL_LIST.BASIC ) {
        console.log(' starting a BASIC connection ');

        conn = await connect( options );
        if ( conn ) return new Conn( conn, options );
    }


    throw new Error(`Smtp.giveConnection() must be provided with a valid Smtp ConnectOption or ConnectTlsOptions or StartTlsOptions`);
} 

export type { ConnectOptions, ConnectTlsOptions, StartTlsOptions, SecurityProtocol } from "./options.ts";
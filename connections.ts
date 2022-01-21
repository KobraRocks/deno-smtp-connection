
// Copyright 2018-2022 Kobra Rocks (https://kobra.rocks). All rights reserved. MIT license.

import { BufReader, BufWriter } from "./deps.ts";
import { isLastLine } from "./utilities.ts";

import type { ConnectOptions, ConnectTlsOptions } from "./options.ts";


export class Conn implements Deno.Conn {
    
    #encoder = new TextEncoder();
    #writer: BufWriter;
    #reader: BufReader;

    getConn: () => Deno.Conn ;
    getOptions: () => ConnectOptions; 
    
    constructor ( conn: Deno.Conn, options: ConnectOptions ) {        
        this.getConn = () => conn;
        this.getOptions = () => options;

        this.#writer = new BufWriter( conn );
        // this.#reader = new TextProtoReader( new BufReader( conn ) );
        this.#reader = new BufReader( conn );
    }

    get localAddr () { return this.getConn().localAddr; }
    get remoteAddr () { return this.getConn().remoteAddr; }
    get rid () { return this.getConn().rid; }

    closeWrite () { return this.getConn().closeWrite(); }
    close(): void { return this.getConn().close(); }
    read (p: Uint8Array): Promise<number | null> { return this.getConn().read( p ); }
    write(p: Uint8Array): Promise<number> { return this.getConn().write( p ); }

    /** Send a smtp command or list of smtp commands to the smtp server and return a response
     * 
     * ```ts
     * serverResponse = await Conn.tryCmd('EHLO example.com');
     * console.log( 'success ? ' + serverResponse.pop().startsWith('250') );
     * ```
     * 
     * @param cmds A smtp command or a list of smtp commands to send to the smtp server
     * @returns A Promise whith the smtp server response when fullfilled
     */
    async tryCmd ( cmds: string | string[] ): Promise<string[]>  {

        if ( Array.isArray( cmds ) ) {
            for ( const cmd of cmds ) {
                await this.#tryCmd( cmd );
            }
        } else {
            await this.#tryCmd( cmds );
        }

        return this.serverMessage();
    }
    /** Send a smtp command to the smtp server
     * 
     * @param cmds A smtp command to send to the smtp server
     * @returns nothing
     */
    async #tryCmd ( smtpCmd: string ): Promise<void> {
        const p: Uint8Array = this.#encoder.encode( smtpCmd + "\r\n" );
        const totalByteSize = p.byteLength;

        let byteSize = 0;
        
        try {
            byteSize = await this.#writer.write( p );
        } catch ( err ) {
            throw err.message;
        }

        // console.log( `${this.constructor.name}.request() byteSize written ${byteSize} / Total of ${totalByteSize}`)
        
        if ( byteSize === totalByteSize ) { 
            
            await this.#writer.flush();
            // console.log( `${this.constructor.name}.request() writer flushed`);
 
        }        
    }

    /** Retreives smtp server and returns messages
     * 
     * @returns A Promise containing an array of server message
     */
    async serverMessage (): Promise<string[]> {

        // console.log(`${this.constructor.name}.serverMessage()`);

        const messages: string[] = [];

        // while server sends response to client continue to next line
        while ( true ) {

            const message = await this.#reader.readString('\n')
                .catch( ( reason ) => { throw new Error(`${this.constructor.name}.serverMessage() this.#reader.readString() Error: ${reason.message}`)});

            if ( message === null ) {
                // a custom Error message mimicing a std smtp server message
                messages.push( '000 Something went wrong when reading Uint8Array Buffer' );
                return messages;
            }

            messages.push( message );

            // console.log(`${this.constructor.name}.serverMessage() message: ${message}. Server sent last line ?`);

            if ( isLastLine( message ) ) break;
        }

        return messages;
    }

}

export class TlsConn extends Conn implements Deno.TlsConn {
    
    getConn: () => Deno.TlsConn;
    getOptions: () => ConnectTlsOptions ; 

    constructor ( conn: Deno.TlsConn, options: ConnectTlsOptions ) {

        super( conn, options );

        this.getConn = () => conn;
        this.getOptions = () => options;
    }

    handshake () { return this.getConn().handshake(); }

}
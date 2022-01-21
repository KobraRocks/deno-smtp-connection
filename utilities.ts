// Copyright 2018-2022 Kobra Rocks (https://kobra.rocks). All rights reserved. MIT license.

/** isLastLine is responsible to tell if the smtp server message
 * received is the last one.
 * 
 * The way to tell is to check the presence of '-' at index 3
 * right after the code.
 * 
 * ```ts
 * const message = '250-DNS';
 * console.log( isLastLine( message ) )
 * // expected false
 * 
  * const lastMessage = '250 AUTH LOGIN PLAIN';
 * console.log( isLastLine( lastMessage ) );
 * // expected true
 * ```
 * 
 * @param message A smtp server message
 * @returns A boolean
 */
export function isLastLine ( message: string ): boolean {
    const code = Number( message.slice(0, 3) );

    return message.startsWith(`${code} `);
}
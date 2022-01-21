import { assert } from "https://deno.land/std/testing/asserts.ts";
import { isLastLine } from "./utilities.ts";

const MODULE = 'Utililities'

Deno.test(`#${MODULE}.isLastLine('250-DNS') fail`, () => {

    const message = '250-DNS';
    const result = isLastLine( message );

    assert( !result );

});

Deno.test(`#${MODULE}.isLastLine('250 AUTH LOGIN PLAIN') success`, () => {

    const message = '250 AUTH LOGIN PLAIN';
    const result = isLastLine( message );

    assert( result );

});


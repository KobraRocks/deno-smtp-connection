// Copyright 2018-2022 Kobra Rocks (https://kobra.rocks). All rights reserved. MIT license.

export type SecurityProtocol = 'BASIC' | 'TLS' | 'STARTTLS';

export interface SecurityOptions {
    securityProtocol: SecurityProtocol;
}

export interface ConnectOptions extends Deno.ConnectOptions, SecurityOptions {}
export interface ConnectTlsOptions extends Deno.ConnectTlsOptions, SecurityOptions {}
export interface StartTlsOptions extends Deno.StartTlsOptions, Deno.ConnectOptions, SecurityOptions {}
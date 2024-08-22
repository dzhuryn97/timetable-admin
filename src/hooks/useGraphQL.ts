/* eslint-disable import/no-extraneous-dependencies */
import {ExecutionResult} from 'graphql';
import {QueryObserverResult, useQuery, UseQueryResult} from '@tanstack/react-query';
import {TypedDocumentString} from "../gql/graphql";
import {GraphQLError} from "graphql/error";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import type {ObjMap} from "graphql/jsutils/ObjMap";

const baseUrl = 'http://0.0.0.0';

export interface SuccessResult<
    TData = ObjMap<unknown>
> {
    data: TData;
}

class ErrorBag {
    private errors;

    constructor(errors: GQError[]) {
        this.errors = errors;
    }

    public count(){
        return this.errors.length
    }

    public hasError(path: String) {
        return !!this.findError(path);
    }

    public first(): GQError{
        return this.errors[0];
    }

    public getError(path: string): GQError {
        const error = this.findError(path)

        if (!error) {
            throw new Error('GQError not found');
        }

        return error;
    }

    public findError(path: String): GQError | null {
        const filtered = this.errors.filter((error) => error.path === path)

        return filtered.length > 0 ? filtered[0] : null;
    }
}

export class GQError {
    message: string
    path: String

    constructor(message: string, path: String) {
        this.message = message;
        this.path = path;
    }
}


interface ValidationErrorItem {
    field: String,
    message: String
}

export class GQValidationError extends GQError {
    items: ValidationErrorItem[]

    constructor(message: string, path: String, items: ValidationErrorItem[]) {
        super(message, path);
        this.items = items;
    }

}

interface GQQueryResponse<T>  {
    data: T,
    errors: ErrorBag

}


export async function uploadFileViaMutation(file: File): Promise<string> {
    var data = new FormData();

    data.append('0', file)
    data.append('operations', '{ "query": "mutation ($file: Upload!) { upload(file: $file) }", "variables": { "file": null } }')
    data.append('map', '{ "0": ["variables.file"] }')

    return await fetch(baseUrl + '/graphql', {
        method: 'POST',
        body: data
    }).then(async function (res): Promise<string> {
        const json = await res.json();
        return json.data.upload;
    })
}

export function grabError(queryKey: string, errors: readonly GraphQLError[] | null | undefined, defaultValue: string = "Something wrong"): string {

    if (errors === null || errors === undefined) {
        return defaultValue;
    }

    const filtered: string[] = [];
    errors.forEach(function (error: GraphQLError): void {
        if (error.path?.includes(queryKey)) {
            filtered.push(error.message)
        }
    })

    if (filtered.length === 0) {
        return defaultValue;
    }

    return filtered.join(', ');
}

export function executeQuery<TResult, TVariables>(
    document: TypedDocumentString<TResult, TVariables>,
    ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
    return fetch(baseUrl + '/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: document.toString(),
            variables: variables,
        }),
    }).then(async function (response) {
        const json = await response.json();

        let responseErrors: GQError[] = [];

        if (json.errors) {
            responseErrors = json.errors.map(function (error: any) {
                const path: String = error.path && error.path.length ? error.path[0]:'';
                if (error.extensions.validation) {

                    const items: ValidationErrorItem[] = [];

                    for (let [key, value] of Object.entries(error.extensions.validation)) {
                        key = key.replace('input.', '')
                        items.push({
                            field: key,
                            message: value as String
                        })
                    }

                    return new GQValidationError(
                        error.message,
                        path,
                        items);
                } else {
                    return new GQError(
                        error.message,
                        path
                    );
                }
            })
        }

        const errorBag: ErrorBag = new ErrorBag(responseErrors);


        return {
            data:json.data??{},
            errors: errorBag,
        };
    }) as Promise<GQQueryResponse<TResult>>;
}

export function useGraphQL<TResult, TVariables>(
    document: TypedDocumentString<TResult, TVariables>,
    queryKey: string | undefined,
    ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
    return useQuery({
        queryKey: [
            document,
            variables,
        ] as const,

        retry: false,

        queryFn: async ({queryKey}) => {
            return fetch(baseUrl + '/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: queryKey[0].toString(),
                    variables: queryKey[1],
                }),
            }).then(
                async (resp) => {
                    const res = await resp.json();
                    if (res.data) {
                        return res.data;
                    }
                    if (res.errors) {
                        const errors = res.errors.map(function (error: any) {
                            return error.message;
                        })
                        throw new Error(errors)
                    }

                    throw new Error('Something wrong')

                }
            ) as Promise<TResult>;
        }
    }) as UseQueryResult<TResult, string>;
}
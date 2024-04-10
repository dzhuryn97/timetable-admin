/* eslint-disable import/no-extraneous-dependencies */
import {ExecutionResult} from 'graphql';
import {QueryObserverResult, useQuery, UseQueryResult} from '@tanstack/react-query';
import {TypedDocumentString} from "../gql/graphql";
import {GraphQLError} from "graphql/error";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

const baseUrl = 'http://0.0.0.0';

export async function uploadFileViaMutation(file: File): Promise<string> {
    var data = new FormData();

    data.append('0', file)
    data.append('operations', '{ "query": "mutation ($file: Upload!) { upload(file: $file) }", "variables": { "file": null } }')
    data.append('map', '{ "0": ["variables.file"] }')

    return   await fetch(baseUrl + '/graphql', {
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
    }).then(response => response.json()) as Promise<ExecutionResult<TResult>>;
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
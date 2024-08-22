import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    schema: './schema.graphql',
    documents: ['src/**/*.tsx', 'src/**/*.ts'],
    ignoreNoDocuments: true, // for better experience with the watcher
    generates: {
        './src/gql/': {
            preset: 'client',
            config: {
                documentMode: 'string',
            },
        },

    }
}

export default config
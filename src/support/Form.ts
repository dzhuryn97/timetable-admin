import {GQValidationError} from "../hooks/useGraphQL";
import {UseFormSetError} from "react-hook-form";

export function utilRemoveOmittedFields<T>(data: T): T {
    // @ts-ignore
    Object.keys(data).forEach(key => {
        // @ts-ignore
        if (data[key] === '' || data[key] == null) {
            // @ts-ignore
            delete data[key];
        }
    });

    return data;
}

export function utilGQErrorsSetter(error: GQValidationError, setError: any) {
    // @ts-ignore
    error.items.forEach(function (validationError) {
        // @ts-ignore
        setError(validationError.field, {type: 'custom', message: validationError.message});
    })

}
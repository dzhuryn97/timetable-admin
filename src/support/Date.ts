export function ParseDate(input: string): Date {
    var parts = input.match(/(\d+)/g);

    //@ts-ignore
    return new Date(  parts[0],parts[1] - 1,parts[2] );
}

export function FormatDate(d: Date): string {
    return  d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2)  + "-" + ("0" + d.getDate()).slice(-2)
       ;
}

export function  GetDaysInMonth(month: number, year: number) {
    return month===2 ? year & 3 || !(year%25) && year & 15 ? 28 : 29 : 30 + (month+(month>>3)&1);
}
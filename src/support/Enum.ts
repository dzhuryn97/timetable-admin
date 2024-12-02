export function GetEnumByValue(value: string, enumObject: any) {
  for (const enumMember in enumObject) {
    // @ts-ignore
    if (value === enumObject[enumMember]) {
      return enumMember;
    }
  }
  return null;
}

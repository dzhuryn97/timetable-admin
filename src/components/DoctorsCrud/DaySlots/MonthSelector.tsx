import {Select} from "@chakra-ui/react";
import {ChangeEvent, SelectHTMLAttributes} from "react";
import {m} from "framer-motion";

interface MonthSelectorProps {
    previousMonthCount: number
    nextMonthCount: number,
    selectedMonth: SelectMonthOption
    onSelectMonth: (selectMonth: SelectMonthOption) => void
}

export interface SelectMonthOption {
    year: number,
    month: number,
    title: string,
    value: string,
    current: boolean
}

function makeOption(date: Date, current: boolean) {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return {
        year: year,
        month: month,
        title: (month > 9 ? month : '0' + month) + '-' + date.getFullYear(),
        value: month + '-' + year,
        current: current
    };
}

export function GetCurrentOption(): SelectMonthOption {
    const date = new Date();

    return makeOption(date,true)}

export default function MonthSelector({
                                          previousMonthCount,
                                          nextMonthCount,
                                          selectedMonth,
                                          onSelectMonth
                                      }: MonthSelectorProps) {

    let options: SelectMonthOption[] = [];

    function addDateToOption(date: Date, current: boolean) {
        options.push(makeOption(date,current));
    }

    let prevDate = new Date();
    for (let i = 0; i < previousMonthCount; i++) {
        prevDate.setMonth(prevDate.getMonth() - 1);
        addDateToOption(prevDate, false)
    }
    options = options.reverse();


    addDateToOption(new Date(), true);

    let nextDate = new Date();
    for (let i = 0; i < nextMonthCount; i++) {
        nextDate.setMonth(nextDate.getMonth() + 1);
        addDateToOption(nextDate, false)
    }

    function findOptionByValue(value: string): SelectMonthOption{
        const filtered = options.filter(function (option){
            return value === option.value
        })

        return filtered[0];
    }
    function handleSelectMonth(e: ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;

        onSelectMonth(findOptionByValue(value));
    }


    return <Select defaultValue={selectedMonth.value} onChange={handleSelectMonth}>
        {options.map((option, index) => {
            return <option value={option.value} key={index}>{option.title}</option>
        })}
    </Select>

}
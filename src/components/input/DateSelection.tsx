import React, { useRef, useState } from 'react'
import Style from './DateSelection.module.css'
import { isNumeric, padWithLeadingZeros } from '~/utils/input'
import { isValid } from 'date-fns'
import { Calendar } from 'react-date-range'
import useTarget from '~/hooks/useTarget'
type DateSelectionProps = {
    date: Date
    setDate: React.Dispatch<React.SetStateAction<Date>>
    nextInputRef?: React.RefObject<HTMLInputElement>
}

export const DateSelection: React.FC<DateSelectionProps> = ({
    date,
    setDate,
    nextInputRef
}) => {

    const {isTarget: showCalendar, setIsTarget:setShowCalendar, ref: calendarRef} = useTarget(false)



    const [day, setDay] = useState<string>(padWithLeadingZeros(date.getDate(), 2))
    const dayRef = useRef<HTMLInputElement>(null)
    const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!isNumeric(e.target.value)) return
        if (e.target.value.length === 2) {
            if (parseInt(e.target.value) > 31) {
                setDay('31')
                monthRef.current?.focus()
                return
            } else {
                setDay(e.target.value)
                monthRef.current?.focus()
                return
            }
        }

        setDay((e.target.value))
        return
    }

    const [month, setMonth] = useState<string>(padWithLeadingZeros((date.getMonth() + 1), 2))
    const monthRef = useRef<HTMLInputElement>(null)
    const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNumeric(e.target.value)) return
        if (e.target.value.length === 2) {
            if (parseInt(e.target.value) > 12) {
                setMonth('12')
                yearRef.current?.focus()
                return
            } else {
                setMonth(e.target.value)
                yearRef.current?.focus()
                return
            }
        }
        setMonth(e.target.value)

    }

    const [year, setYear] = useState<string>(padWithLeadingZeros(date.getFullYear(), 4))
    const yearRef = useRef<HTMLInputElement>(null)
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNumeric(e.target.value)) return
        if (e.target.value.length === 4) {
            setYear(e.target.value)
            const date = concatDate(day, month, e.target.value)
            if (isValid(date)) {
                directlySetDate(date)
                yearRef.current?.blur()
                return
            } else {
                setDay(padWithLeadingZeros(date.getDate(), 2))
                setMonth(padWithLeadingZeros((date.getMonth() + 1), 2))
                setYear(padWithLeadingZeros(date.getFullYear(), 4))
                dayRef.current?.focus()
                return
            }
        }
        setYear(e.target.value)
        return
    }

    const concatDate = (day: string, month: string, year: string) => {
        return new Date(`${year}-${month}-${day}T12:00:00.000Z`)
    }

    const directlySetDate = (date: Date) => {
        setDay(padWithLeadingZeros(date.getDate(), 2))
        setMonth(padWithLeadingZeros((date.getMonth() + 1), 2))
        setYear(padWithLeadingZeros(date.getFullYear(), 4))
        setDate(date)
        nextInputRef?.current?.focus()
    }


    return (
        <div className={Style.inputWrapper}>
            <div className={Style.textInputContainer}>
                <input
                    type="text"
                    className={Style.textInputDay}
                    value={day}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={(e) => setDay(padWithLeadingZeros(parseInt(e.currentTarget.value), 2))}
                    onChange={handleDayChange}
                    maxLength={2}
                    ref={dayRef}
                />
                <p className={Style.textInputDivider}>
                    /
                </p>
                <input
                    type="text"
                    className={Style.textInput}
                    value={month}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={(e) => setMonth(padWithLeadingZeros(parseInt(e.currentTarget.value), 2))}
                    onChange={handleMonthChange}
                    maxLength={2}
                    ref={monthRef}

                />
                <p className={Style.textInputDivider}>
                    /
                </p>
                <input
                    type="text"
                    className={Style.textInputYear}
                    value={year}
                    max={4}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={(e) => setYear(padWithLeadingZeros(parseInt(e.currentTarget.value), 4))}
                    onChange={handleYearChange}
                    maxLength={4}
                    ref={yearRef}
                />
                <div className={Style.inputIcon}
                    onClick={() => setShowCalendar(!showCalendar)}
                >
                    <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M18 15.75C16.7574 15.75 15.75 16.7574 15.75 18C15.75 19.2426 16.7574 20.25 18 20.25C19.2426 20.25 20.25 19.2426 20.25 18C20.25 16.7574 19.2426 15.75 18 15.75ZM14.25 18C14.25 15.9289 15.9289 14.25 18 14.25C20.0711 14.25 21.75 15.9289 21.75 18C21.75 18.7643 21.5213 19.4752 21.1287 20.068L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L20.068 21.1287C19.4752 21.5213 18.7643 21.75 18 21.75C15.9289 21.75 14.25 20.0711 14.25 18Z" fill="gray" />
                        <path d="M7.75 2.5C7.75 2.08579 7.41421 1.75 7 1.75C6.58579 1.75 6.25 2.08579 6.25 2.5V4.07926C4.81067 4.19451 3.86577 4.47737 3.17157 5.17157C2.47737 5.86577 2.19451 6.81067 2.07926 8.25H21.9207C21.8055 6.81067 21.5226 5.86577 20.8284 5.17157C20.1342 4.47737 19.1893 4.19451 17.75 4.07926V2.5C17.75 2.08579 17.4142 1.75 17 1.75C16.5858 1.75 16.25 2.08579 16.25 2.5V4.0129C15.5847 4 14.839 4 14 4H10C9.16097 4 8.41527 4 7.75 4.0129V2.5Z" fill="gray" />
                        <path d="M22 12V14C22 14.2053 22 14.405 21.9998 14.5992C21.0368 13.4677 19.6022 12.75 18 12.75C15.1005 12.75 12.75 15.1005 12.75 18C12.75 19.6022 13.4677 21.0368 14.5992 21.9998C14.405 22 14.2053 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 11.161 2 10.4153 2.0129 9.75H21.9871C22 10.4153 22 11.161 22 12Z" fill="gray" />
                    </svg>
                </div>
            </div>
            {
                showCalendar &&
                <div className={Style.calendarContainer} ref={calendarRef}>
                    <Calendar 
                        date={date}
                        onChange={(date) => {
                            directlySetDate(date)
                            setShowCalendar(false)
                        }}
                    
                    />
                </div>
            }
        </div>
    )
}

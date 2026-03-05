import { Temporal } from '@js-temporal/polyfill';


export const getDateTimeByTimezone = (timeZone: string) => {
    return Temporal.Now.zonedDateTimeISO(timeZone);
    

}
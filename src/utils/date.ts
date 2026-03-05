
import { parse } from 'date-fns';
import { formatInTimeZone,  fromZonedTime} from 'date-fns-tz';


export const normalizeDate = (date: Date | string, timeZone?: string): Date => {
    let dateString: string;
    
    if (typeof date === 'string') {
        dateString = date;
    } else {
        dateString = formatInTimeZone(date, timeZone || 'UTC', 'yyyy-MM-dd');
    }
    
    if (timeZone) {
        return fromZonedTime(`${dateString}T00:00:00`, timeZone);
    }
    
    return parse(`${dateString}T00:00:00`, 'yyyy-MM-dd\'T\'HH:mm:ss', new Date());
};

export const dateNow = (timeZone: string): Date => {
    const dateString = formatInTimeZone(new Date(), timeZone, 'yyyy-MM-dd');
    return fromZonedTime(`${dateString}T00:00:00`, timeZone);
};
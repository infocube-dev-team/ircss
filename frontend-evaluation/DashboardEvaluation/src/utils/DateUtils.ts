import moment from "moment";

class DateUtils {
    static timestampToDate = ( timestamp: number ) => {
        // convert timestamp to date
        let creationDateConverted = new Date ( timestamp );
        return `${ creationDateConverted.getDay () }/${ creationDateConverted.getMonth () }/${ creationDateConverted.getFullYear () } ${ creationDateConverted.getHours () }:${ creationDateConverted.getMinutes () } `;
    }

    static formatDate = (date: Date|number|string) => {
        return moment(date).format('DD/MM/YYYY HH:mm:ss')
    }

    static formatDateWithoutTime = (date: Date | number) => {
        return moment(date).format('DD/MM/YYYY');
    }

    static getDurationWarranty = (creationDate: Date | number, expiryDate: Date | number) => {
        const duration = new Date(expiryDate).getFullYear() - new Date(creationDate).getFullYear();
        return duration;
    }

    static formatSearchDates = (data: { [key: string]: any }) => {
        let dataClone: { [key: string]: any } = {};
        Object.keys(data).map((key) => {
            if (moment.isMoment(data[key])) {
                return dataClone[key] = data[key].format('YYYY-MM-DD');
            } else {
                return dataClone[key] = data[key];
            }
        });
        return dataClone;
    }

    static formatSearchDatesToISoString = (data: { [key: string]: any }) => {
        let dataClone: { [key: string]: any } = {};
        Object.keys(data).map((key) => {
            if (moment.isMoment(data[key])) {
                return dataClone[key] = data[key].toISOString();
            } else {
                return dataClone[key] = data[key];
            }
        });
        return dataClone;
    }

    static formatSearchRangeDates = (data: { [key: string]: any }) => {
        let dataClone: { [key: string]: any } = {};
        Object.keys(data).forEach((key) => {
            if (moment.isMoment(data[key][0])) {
                const keys = key.split('-');
                data[key].forEach((el: any, i: number) => {
                    dataClone[keys[i]] = el.format('YYYY-MM-DD');
                });
            } else {
                return dataClone[key] = data[key];
            }
        });
        return dataClone;
    }

    static formatSearchRangeDatesToISoString = (data: { [key: string]: any }) => {
        let dataClone: { [key: string]: any } = {};
        Object.keys(data).forEach((key) => {
            if (moment.isMoment(data[key][0])) {
                const keys = key.split('-');
                data[key].forEach((el: any, i: number) => {
                    dataClone[keys[i]] = el.toISOString();
                });
            } else {
                return dataClone[key] = data[key];
            }
        });
        return dataClone;
    }
}


export default DateUtils;

export class UserSettings implements ComponentFramework.UserSettings {
    dateFormattingInfo: ComponentFramework.UserSettingApi.DateFormattingInfo = new DateFormattingInfo();
    isRTL: boolean;
    languageId: number;
    numberFormattingInfo: ComponentFramework.UserSettingApi.NumberFormattingInfo = new NumberFormattingInfo();
    securityRoles: string[];
    userId: string;
    userName: string;
    getTimeZoneOffsetMinutes(date?: Date | undefined): number {
        throw new Error("Method not implemented.");
    }
    
}

export class DateFormattingInfo implements ComponentFramework.UserSettingApi.DateFormattingInfo {
    abbreviatedDayNames: string[];
    abbreviatedMonthGenitiveNames: string[];
    abbreviatedMonthNames: string[];
    amDesignator: string;
    calendar: ComponentFramework.UserSettingApi.Calendar = new Calendar();
    calendarWeekRule: number;
    dateSeparator: string;
    dayNames: string[];
    firstDayOfWeek: ComponentFramework.UserSettingApi.Types.DayOfWeek;
    fullDateTimePattern: string;
    longDatePattern: string;
    longTimePattern: string;
    monthDayPattern: string;
    monthGenitiveNames: string[];
    monthNames: string[];
    pmDesignator: string;
    shortDatePattern: string;
    shortestDayNames: string[];
    shortTimePattern: string;
    sortableDateTimePattern: string;
    timeSeparator: string;
    universalSortableDateTimePattern: string;
    yearMonthPattern: string;
    
}

export class Calendar implements ComponentFramework.UserSettingApi.Calendar {
    minSupportedDateTime: Date;
    maxSupportedDateTime: Date;
    algorithmType: number;
    calendarType: number;
    twoDigitYearMax: number;
}

export class NumberFormattingInfo implements ComponentFramework.UserSettingApi.NumberFormattingInfo {
    currencyDecimalDigits: number;
    currencyDecimalSeparator: string;
    currencyGroupSeparator: string;
    currencyGroupSizes: number[];
    currencyNegativePattern: number;
    currencyPositivePattern: number;
    currencySymbol: string;
    nanSymbol: string;
    nativeDigits: string[];
    negativeInfinitySymbol: string;
    negativeSign: string;
    numberDecimalDigits: number;
    numberDecimalSeparator: string;
    numberGroupSeparator: string;
    numberGroupSizes: number[];
    numberNegativePattern: number;
    percentDecimalDigits: number;
    percentDecimalSeparator: string;
    percentGroupSeparator: string;
    percentGroupSizes: number[];
    percentNegativePattern: number;
    percentPositivePattern: number;
    percentSymbol: string;
    perMilleSymbol: string;
    positiveInfinitySymbol: string;
    positiveSign: string;
    
}
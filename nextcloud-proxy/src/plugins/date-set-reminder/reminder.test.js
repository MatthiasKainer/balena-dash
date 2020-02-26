const { Reminder } = require("./reminder")

const template = `
date; headline; text;
2020-02-09; Restmülltag!; Heute die schwarze Tonne vor die Tür
2020-02-23T16:00:00; Restmülltag!;
2020-02-16; Wertstoff!; Heute die Wertstofftonne vor die Tür;
2020-03-01;; Heute die Wertstofftonne vor die Tür;
`
const currentDate = new Date(2020, 1, 8);
describe("[date-set-reminder]", () => {
    describe("When passing invalid inputs it should fail when", () => {
        it("no content", () => {
            expect(() => Reminder(undefined, () => currentDate)).toThrowErrorMatchingSnapshot()
        })

    })
    describe("When passing invalid inputs it should silently ignore when", () => {
        it("too many ", () => {
            expect(() => Reminder(`
        date; headline; text;
        2020-02-09; Restmülltag!;;;;;`, () => currentDate)).toMatchSnapshot()
        })

        it("not enough items in row", () => {
            expect(() => Reminder(`
        date; headline; text;
        2020-02-09; Restmülltag!`, () => currentDate)).toMatchSnapshot()
        })
    })

    describe("When starting the reminder on a specific date", () => {
        let reminder = null;
        let reminders = [];

        beforeEach(() => {
            reminder = Reminder(template, () => currentDate)
            reminders = reminder.all();
        })

        it("should read the correct reminders", () => {
            expect(reminders).toMatchSnapshot()
            expect(reminders.length).toBe(4);
        })
    })

    describe("On a day when one of the middle reminders is active", () => {
        let currentDate = new Date("2020-02-23T13:00:00.000")
        let reminder = null;
        beforeEach(() => {
            currentDate = new Date("2020-02-23T13:00:00.000")
            reminder = Reminder(template, () => currentDate)
        })
        it("should drop all old reminders", () => {
            const reminders = reminder.all();
            expect(reminders.length).toBe(2);
            expect(reminders).toMatchSnapshot()
        })
        it("should give no result before the reminder is active", () => {
            expect(reminder.next().__empty).toBeTruthy()
        })
        it("should give the result when the reminder is active", () => {
            currentDate = new Date("2020-02-23T16:10:00")
            expect(reminder.next().__empty).not.toBeTruthy()
            expect(reminder.next()).toMatchSnapshot()
        })
        it("should give no result once the current result has been deleted", () => {
            currentDate = new Date("2020-02-23T16:10:00")
            expect(reminder.next().__empty).not.toBeTruthy()
            reminder.done()
            expect(reminder.next().__empty).toBeTruthy()
        })
    })
})
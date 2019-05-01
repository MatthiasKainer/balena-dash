const { Reminder } = require("./reminder");

describe("Reminders", () => {
    describe("Given I have a predefined set of reminders", () => {
        const reminders = [
            {
                day: 3,
                hour: 3,
                message: {
                    headline: "It's wednesday morning!",
                    text: "Did you bring out the trash yet?"
                }
            },
            {
                day: 3,
                hour: 15,
                message: {
                    headline: "It's wednesday afternoon!",
                    text: "Did you bring out the trash yet?"
                }
            },
            {
                day: 0,
                hour: 3,
                occurences: 1,
                message: {
                    headline: "It's sunday morning!",
                    text: "Did you bring out the trash yet?"
                }
            },
            {
                day: 0,
                hour: 15,
                message: {
                    headline: "It's sunday afternoon!",
                    text: "Did you bring out the trash yet?"
                }
            }
        ]

        let date;
        let dateProvider = () => new Date(Date.parse(date))
        let reminder;

        describe("When starting the reminder for a date with an active reminder at the hour", () => {
            beforeEach(() => {
                date = "2019-05-01T15:00:00.000Z";
                reminder = Reminder(reminders, dateProvider);
            })

            it("should bring the reminders in order of next execution", () => {
                const ordered = ["It's wednesday afternoon!", "It's sunday morning!", "It's sunday afternoon!", "It's wednesday morning!"];
                const current = reminder.all();
                while(ordered.length > 0) {
                    expect(current.shift().message.headline).toBe(ordered.shift());
                }
            })

            it("should return the active event", () => {
                expect(reminder.next().message.headline).toBe("It's wednesday afternoon!");
            })
        })

        describe("When adding an item to the reminders", () => {
            beforeEach(() => {
                date = "2019-05-01T15:00:00.000Z";
                reminder = Reminder(reminders, dateProvider);
                reminder.add( {
                    day: 1,
                    hour: 7,
                    message: {
                        headline: "It's Monday!",
                        text: "Do wake up for work"
                    }
                });
            })

            it("should bring the reminders in order of next execution", () => {
                const ordered = ["It's wednesday afternoon!", "It's sunday morning!", "It's sunday afternoon!", "It's Monday!", "It's wednesday morning!"];
                const current = reminder.all();
                expect(ordered.length).toBe(current.length);
                while(ordered.length > 0) {
                    expect(current.shift().message.headline).toBe(ordered.shift());
                }
            })

            it("should return the active event", () => {
                expect(reminder.next().message.headline).toBe("It's wednesday afternoon!");
            })
        })

        describe("When starting the reminder for a date that has no active reminder at the hour", () => {
            
            beforeEach(() => {
                date = "2019-05-01T12:00:00.000Z";
                reminder = Reminder(reminders, dateProvider);
            })

            it("should bring the reminders in order of next execution", () => {
                const ordered = ["It's wednesday afternoon!", "It's sunday morning!", "It's sunday afternoon!", "It's wednesday morning!"];
                const current = reminder.all();
                expect(ordered.length).toBe(current.length);
                while(ordered.length > 0) {
                    expect(current.shift().message.headline).toBe(ordered.shift());
                }
            })

            it("should not return any reminder", () => {
                expect(reminder.next()).toBeNull();
            })

            describe("If time moved past the first reminder with no other in queue", () => {
                beforeEach(() => {
                    date = "2019-05-01T16:00:00.000Z"
                })

                it("should return the active event", () => {
                    expect(reminder.next().message.headline).toBe("It's wednesday afternoon!");
                })
                describe("If the reminder is set 'closed'", () => {
                    beforeEach(() => {
                        reminder.close(reminder.next());
                    })

                    it("And it should not return any reminder", () => {
                        expect(reminder.next()).toBeNull();
                    })
                    describe("If time moved past the next reminder with more in queue", () => {
                        beforeEach(() => {
                            date = "2019-05-05T16:00:00.000Z"
                        })
        
                        it("should return the active event", () => {
                            expect(reminder.next().message.headline).toBe("It's sunday morning!");
                        })
                        describe("If the reminder is set 'closed'", () => {
                            beforeEach(() => {
                                reminder.close(reminder.next());
                            })
        
                            it("it should return the next reminder", () => {
                                expect(reminder.next().message.headline).toBe("It's sunday afternoon!");
                            })

                            it("should completely remove the last event, as it was a one-time", () => {
                                const ordered = ["It's sunday afternoon!", "It's wednesday morning!", "It's wednesday afternoon!"];
                                const current = reminder.all();
                                expect(ordered.length).toBe(current.length);
                                while(ordered.length > 0) {
                                    expect(current.shift().message.headline).toBe(ordered.shift());
                                }
                            })
                        })
                    });
                })
                })
            });
    })
})
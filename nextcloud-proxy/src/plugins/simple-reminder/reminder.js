

const DateProvider = () => {
    return new Date(Date.now());
}

const getWeek = () => {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

const Reminder = (reminders, dateProvider) => {
    dateProvider = dateProvider || DateProvider;

    let innerReminders = [];
    if (reminders && reminders.length > 1) {

        const sortReminders = (reminders) => {
            innerReminders = [];
            let date = dateProvider();
            for (let day = date.getDay(); day < 7; day++) {
                const hour = day === date.getDay() ? date.getUTCHours() : 0;
                const remindersForDay = reminders.filter(reminder => reminder.day === day && reminder.hour >= hour);
                innerReminders.push(...remindersForDay.sort((a, b) => a.hour > b.hour ? 1 : -1))
            }
            for (let day = 0; day <= date.getDay(); day++) {
                const hour = day === date.getDay() ? date.getUTCHours() : 24;
                const remindersForDay = reminders.filter(reminder => reminder.day === day && reminder.hour < hour);
                innerReminders.push(...remindersForDay.sort((a, b) => a.hour > b.hour ? 1 : -1))
            }
        };
        sortReminders(reminders);
    }

    this.all = () => {
        return innerReminders;
    }

    this.close = () => {
        let now = dateProvider();
        if (innerReminders.length<1) return;
        const activeReminder = innerReminders[0];
        console.log(`Closing reminder`, activeReminder)
        if (now.getDay() === activeReminder.day &&
            now.getUTCHours() >= activeReminder.hour) {
            innerReminders.shift();
            if (activeReminder.occurences) {
                activeReminder.occurences--;
            }

            if (activeReminder.occurences < 1) return;
            now.setDate(activeReminder.date + 7);
            activeReminder.date = now.getUTCDate();
            innerReminders.push(activeReminder);
        }
    }

    this.next = () => {
        let now = dateProvider();
        if (innerReminders.length<1) return;
        const activeReminder = innerReminders[0];
        if (now.getDay() === activeReminder.day &&
            !activeReminder.date) {
            activeReminder.date = now.getUTCDate();
        }
        if (now.getDay() === activeReminder.day &&
            now.getUTCDate() === activeReminder.date &&
            now.getUTCHours() >= activeReminder.hour) {
            return activeReminder;
        }
        return null;
    }

    this.add = (...items) => {
        sortReminders([...innerReminders, ...items]);
    }

    return this;
}

module.exports = { Reminder };
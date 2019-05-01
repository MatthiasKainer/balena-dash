

const DateProvider = () => {
    return new Date(Date.now());
}

const Reminder = (reminders, dateProvider) => {
    dateProvider = dateProvider || DateProvider;

    let innerReminders = [];
    const sortReminders = () => {
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
    sortReminders();

    this.all = () => {
        return innerReminders;
    }

    this.close = () => {
        let now = dateProvider();
        const activeReminder = innerReminders[0];
        if (now.getDay() === activeReminder.day &&
            now.getUTCHours() >= activeReminder.hour) {
            innerReminders.shift();
            innerReminders.push(activeReminder);
        }
    }

    this.next = () => {
        let now = dateProvider();
        const activeReminder = innerReminders[0];
        if (now.getDay() === activeReminder.day &&
            now.getUTCHours() >= activeReminder.hour) {
            return activeReminder;
        }
        return null;
    }

    return this;
}

module.exports = { Reminder };
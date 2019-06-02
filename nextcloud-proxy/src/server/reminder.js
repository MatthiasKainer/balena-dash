

const DateProvider = () => {
    return new Date(Date.now());
}

const Reminder = (reminders, dateProvider) => {
    dateProvider = dateProvider || DateProvider;

    let innerReminders = [];
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

    this.all = () => {
        return innerReminders;
    }

    this.close = () => {
        let now = dateProvider();
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
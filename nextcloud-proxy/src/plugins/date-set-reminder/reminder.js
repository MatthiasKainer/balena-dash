const DateProvider = () => {
    return new Date(Date.now());
}

const Reminder = (reminders, dateProvider) => {
    dateProvider = dateProvider || DateProvider;
    if (!reminders) throw "No reminders passed"

    // remove all empty lines
    reminders = reminders.trim(/^$/gm, "")
    let innerReminders = reminders.split("\n").slice(1).map(reminder => {
        const parts = reminder.split(";")
        return {
            date : new Date(parts[0].trim()),
            headline : parts[1].trim(),
            text : parts[2].trim()
        }
    }).sort((a, b) => 
        parseInt(a.date - b.date)
    ).filter(reminder => {
        return dateProvider() < reminder.date
    })

    console.log(`Startup complete. ${innerReminders.length} reminder(s) loaded. Next reminder:`, innerReminders && innerReminders.length > 0 ? innerReminders[0] : "none")
    
    return {
        all : () => {
            return [...innerReminders];
        },
        next : () => {
            const nextAppointment = [...innerReminders][0];
            return (nextAppointment && dateProvider() > nextAppointment.date) 
                ? nextAppointment
                : { __empty : true };
        },
        done : () => {
            innerReminders = [...innerReminders].slice(1)
            console.log(`Event marked as done. ${innerReminders.length} reminder(s) loaded. Next reminder:`, innerReminders && innerReminders.length > 0 ? innerReminders[0] : "none")

        }
    }
}

module.exports = { Reminder };
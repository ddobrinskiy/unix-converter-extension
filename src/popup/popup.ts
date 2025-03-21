// Add type declaration for Flatpickr
declare const flatpickr: any;

// Log when the script is loaded
console.log('Popup script loaded');

// Wait for DOM content to be loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired');
    initializeConverter();
});

// Run the initialization immediately as well
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already ready, initializing immediately');
    setTimeout(initializeConverter, 100); // Small delay to ensure DOM is ready
}

function initializeConverter() {
    console.log('Initializing converter');
    
    // Get input elements
    const timestampInput = document.getElementById('timestamp-input') as HTMLInputElement;
    const yearInput = document.getElementById('year') as HTMLInputElement;
    const monthInput = document.getElementById('month') as HTMLInputElement;
    const dayInput = document.getElementById('day') as HTMLInputElement;
    const hourInput = document.getElementById('hour') as HTMLInputElement;
    const minuteInput = document.getElementById('minute') as HTMLInputElement;
    const secondInput = document.getElementById('second') as HTMLInputElement;
    const calendarContainer = document.getElementById('calendar-container') as HTMLElement;
    
    // Get output elements
    const gmtTimeOutput = document.getElementById('gmt-time') as HTMLElement;
    const localTimeOutput = document.getElementById('local-time') as HTMLElement;
    const relativeTimeOutput = document.getElementById('relative-time') as HTMLElement;
    const unixTimestampOutput = document.getElementById('unix-timestamp') as HTMLElement;
    
    // Get copy notification element
    const copyNotification = document.getElementById('copy-notification') as HTMLElement;
    
    console.log('Elements found:', {
        inputs: {
            timestamp: !!timestampInput,
            year: !!yearInput,
            month: !!monthInput,
            day: !!dayInput,
            hour: !!hourInput,
            minute: !!minuteInput,
            second: !!secondInput,
            calendarContainer: !!calendarContainer
        },
        outputs: {
            gmtTime: !!gmtTimeOutput,
            localTime: !!localTimeOutput,
            relativeTime: !!relativeTimeOutput,
            unixTimestamp: !!unixTimestampOutput
        }
    });
    
    // Initialize the date picker
    initializeCalendar(calendarContainer, yearInput, monthInput, dayInput, hourInput, minuteInput, secondInput);
    
    // Fill date inputs with current time in UTC/GMT
    const now = new Date();
    yearInput.value = now.getUTCFullYear().toString();
    monthInput.value = (now.getUTCMonth() + 1).toString().padStart(2, '0');
    dayInput.value = now.getUTCDate().toString().padStart(2, '0');
    hourInput.value = now.getUTCHours().toString().padStart(2, '0');
    minuteInput.value = now.getUTCMinutes().toString().padStart(2, '0');
    secondInput.value = now.getUTCSeconds().toString().padStart(2, '0');
    
    console.log('Current GMT date values set:', {
        year: yearInput.value,
        month: monthInput.value,
        day: dayInput.value,
        hour: hourInput.value,
        minute: minuteInput.value,
        second: secondInput.value
    });
    
    // Calculate and display Unix timestamp
    calculateTimestampFromDate();
    
    // Set up event listeners
    timestampInput.addEventListener('input', calculateDateFromTimestamp);
    yearInput.addEventListener('input', calculateTimestampFromDate);
    monthInput.addEventListener('input', calculateTimestampFromDate);
    dayInput.addEventListener('input', calculateTimestampFromDate);
    hourInput.addEventListener('input', calculateTimestampFromDate);
    minuteInput.addEventListener('input', calculateTimestampFromDate);
    secondInput.addEventListener('input', calculateTimestampFromDate);
    
    // Set up copy button listeners
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', handleCopy);
    });
    
    // Function to convert timestamp to date
    function calculateDateFromTimestamp() {
        const timestamp = parseInt(timestampInput.value);
        if (!timestamp) {
            gmtTimeOutput.textContent = '';
            localTimeOutput.textContent = '';
            relativeTimeOutput.textContent = '';
            return;
        }
        
        try {
            const date = new Date(timestamp * 1000);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid timestamp');
            }
            
            // Show the GMT time (using UTC methods)
            gmtTimeOutput.textContent = date.toUTCString();
            
            // Show the local time (using local methods)
            localTimeOutput.textContent = date.toString();
            
            // Calculate relative time
            relativeTimeOutput.textContent = getRelativeTime(date);
            
            timestampInput.classList.remove('error');
        } catch (error) {
            gmtTimeOutput.textContent = '';
            localTimeOutput.textContent = '';
            relativeTimeOutput.textContent = '';
            timestampInput.classList.add('error');
        }
    }
    
    // Function to convert date to timestamp
    function calculateTimestampFromDate() {
        const year = parseInt(yearInput.value);
        const month = parseInt(monthInput.value) - 1; // JavaScript months are 0-based
        const day = parseInt(dayInput.value);
        const hour = parseInt(hourInput.value);
        const minute = parseInt(minuteInput.value);
        const second = parseInt(secondInput.value);
        
        if ([year, month, day, hour, minute, second].some(isNaN)) {
            unixTimestampOutput.textContent = '';
            return;
        }
        
        try {
            // Create a UTC/GMT date using the Date.UTC method instead of the local date
            const utcTimestamp = Date.UTC(year, month, day, hour, minute, second);
            const timestamp = Math.floor(utcTimestamp / 1000);
            const timestampStr = timestamp.toString();
            unixTimestampOutput.textContent = timestampStr;
            
            // Update the timestamp input field as well
            timestampInput.value = timestampStr;
            
            // Also update GMT/local/relative time displays
            const date = new Date(timestamp * 1000);
            gmtTimeOutput.textContent = date.toUTCString();
            localTimeOutput.textContent = date.toString();
            relativeTimeOutput.textContent = getRelativeTime(date);
            
            // Auto-copy to clipboard
            navigator.clipboard.writeText(timestampStr).then(() => {
                // Show notification
                copyNotification.textContent = "Timestamp copied to clipboard!";
                copyNotification.classList.add('show');
                setTimeout(() => {
                    copyNotification.classList.remove('show');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy timestamp:', err);
            });
            
            [yearInput, monthInput, dayInput, hourInput, minuteInput, secondInput].forEach(input => {
                input.classList.remove('error');
            });
            timestampInput.classList.remove('error');
        } catch (error) {
            unixTimestampOutput.textContent = '';
            [yearInput, monthInput, dayInput, hourInput, minuteInput, secondInput].forEach(input => {
                input.classList.add('error');
            });
        }
    }
    
    // Function to get relative time
    function getRelativeTime(date: Date): string {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
        return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    }
    
    // Function to handle copy button clicks
    async function handleCopy(event: Event) {
        const button = event.currentTarget as HTMLButtonElement;
        const targetId = button.getAttribute('data-target');
        if (!targetId) return;
        
        const element = document.getElementById(targetId);
        if (!element?.textContent) return;
        
        try {
            await navigator.clipboard.writeText(element.textContent);
            
            // Show notification
            copyNotification.classList.add('show');
            setTimeout(() => {
                copyNotification.classList.remove('show');
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    }
    
    // Initialize calendar
    function initializeCalendar(
        container: HTMLElement,
        yearInput: HTMLInputElement,
        monthInput: HTMLInputElement,
        dayInput: HTMLInputElement,
        hourInput: HTMLInputElement,
        minuteInput: HTMLInputElement,
        secondInput: HTMLInputElement
    ) {
        try {
            // Get current date for fallback
            const currentDate = new Date();
            
            // Set initial date from inputs with proper fallbacks to current date
            const year = parseInt(yearInput.value) || currentDate.getFullYear();
            const month = (parseInt(monthInput.value) || (currentDate.getMonth() + 1)) - 1; // 0-indexed
            const day = parseInt(dayInput.value) || currentDate.getDate();
            const hour = parseInt(hourInput.value) || currentDate.getHours();
            const minute = parseInt(minuteInput.value) || currentDate.getMinutes();
            const second = parseInt(secondInput.value) || currentDate.getSeconds();
            
            const date = new Date(year, month, day, hour, minute, second);
            
            // Initialize the calendar directly in the container
            const calendar = flatpickr(container, {
                inline: true,
                enableTime: true,
                time_24hr: true,
                defaultDate: date,
                dateFormat: 'Y-m-d H:i:S',
                utc: true,
                onValueUpdate: function(selectedDates: Date[], dateStr: string, instance: any) {
                    if (selectedDates.length > 0) {
                        const selectedDate = selectedDates[0];
                        yearInput.value = selectedDate.getUTCFullYear().toString();
                        monthInput.value = (selectedDate.getUTCMonth() + 1).toString().padStart(2, '0');
                        dayInput.value = selectedDate.getUTCDate().toString().padStart(2, '0');
                        hourInput.value = selectedDate.getUTCHours().toString().padStart(2, '0');
                        minuteInput.value = selectedDate.getUTCMinutes().toString().padStart(2, '0');
                        secondInput.value = selectedDate.getUTCSeconds().toString().padStart(2, '0');
                        
                        calculateTimestampFromDate();
                    }
                },
                onChange: function(selectedDates: Date[], dateStr: string, instance: any) {
                    if (selectedDates.length > 0) {
                        // Check if the user clicked on the calendar date (not using time controls)
                        // This is a simple way to detect if the user clicked the date
                        if (instance.currentYear && instance.currentMonth !== undefined) {
                            // If date was selected, set time to 00:00:00 UTC
                            const selectedDate = selectedDates[0];
                            // Use UTC hours to ensure it's 00:00:00 in GMT
                            selectedDate.setUTCHours(0, 0, 0);
                            instance.setDate(selectedDate, false);
                            
                            yearInput.value = selectedDate.getUTCFullYear().toString();
                            monthInput.value = (selectedDate.getUTCMonth() + 1).toString().padStart(2, '0');
                            dayInput.value = selectedDate.getUTCDate().toString().padStart(2, '0');
                            hourInput.value = '00';
                            minuteInput.value = '00';
                            secondInput.value = '00';
                            
                            calculateTimestampFromDate();
                        }
                    }
                }
            });
            
            // Watch for changes in the form inputs to update the calendar
            [yearInput, monthInput, dayInput, hourInput, minuteInput, secondInput].forEach(input => {
                input.addEventListener('change', () => {
                    const newYear = parseInt(yearInput.value) || new Date().getFullYear();
                    const newMonth = (parseInt(monthInput.value) || 1) - 1;
                    const newDay = parseInt(dayInput.value) || 1;
                    const newHour = parseInt(hourInput.value) || 0;
                    const newMinute = parseInt(minuteInput.value) || 0;
                    const newSecond = parseInt(secondInput.value) || 0;
                    
                    const newDate = new Date(newYear, newMonth, newDay, newHour, newMinute, newSecond);
                    if (!isNaN(newDate.getTime())) {
                        calendar.setDate(newDate);
                    }
                });
            });
            
            console.log('Calendar initialized successfully');
        } catch (err) {
            console.error('Error initializing calendar:', err);
            // Add fallback in case calendar initialization fails
            container.textContent = 'Calendar could not be loaded. Please use the date/time inputs above.';
        }
    }
} 
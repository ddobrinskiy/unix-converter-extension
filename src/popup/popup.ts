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
        },
        outputs: {
            gmtTime: !!gmtTimeOutput,
            localTime: !!localTimeOutput,
            relativeTime: !!relativeTimeOutput,
            unixTimestamp: !!unixTimestampOutput
        }
    });
    
    // Fill date inputs with current time
    const now = new Date();
    yearInput.value = now.getFullYear().toString();
    monthInput.value = (now.getMonth() + 1).toString().padStart(2, '0');
    dayInput.value = now.getDate().toString().padStart(2, '0');
    hourInput.value = now.getHours().toString().padStart(2, '0');
    minuteInput.value = now.getMinutes().toString().padStart(2, '0');
    secondInput.value = now.getSeconds().toString().padStart(2, '0');
    
    console.log('Current date values set:', {
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
            
            gmtTimeOutput.textContent = date.toUTCString();
            localTimeOutput.textContent = date.toString();
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
            const date = new Date(year, month, day, hour, minute, second);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date');
            }
            
            const timestamp = Math.floor(date.getTime() / 1000);
            unixTimestampOutput.textContent = timestamp.toString();
            
            [yearInput, monthInput, dayInput, hourInput, minuteInput, secondInput].forEach(input => {
                input.classList.remove('error');
            });
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
} 
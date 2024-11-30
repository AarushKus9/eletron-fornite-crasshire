import psList from 'ps-list';
import { app, BrowserWindow } from 'electron';

let overlayWindow;

app.whenReady().then(() => {
    overlayWindow = new BrowserWindow({
        width: 200,
        height: 200,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        fullscreenable: false,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    overlayWindow.loadFile('index.html');
    overlayWindow.setIgnoreMouseEvents(true);
    overlayWindow.setAlwaysOnTop(true, 'screen-saver');

    // Periodically check if Fortnite is running
    setInterval(async () => {
        const running = await isFortniteRunning();
        if (running) {
            overlayWindow.show(); // Show the overlay if Fortnite is running
        } else {
            overlayWindow.hide(); // Hide the overlay if Fortnite is not running
        }
    }, 3000); // Check every 3 seconds

    // Handle closing the app when all windows are closed
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit();
    });
});

async function isFortniteRunning() {
    const processes = await psList();
    return processes.some(p => p.name.includes('FortniteClient-Win64-Shipping'));
}


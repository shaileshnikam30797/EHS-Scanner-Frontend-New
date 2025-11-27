// server.js (Production Ready for Front-end and API)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // Path module import kiya gaya

const app = express();
// Server ka port automatically environment variable se lega, ya 3000 use karega
const port = process.env.PORT || 3000; 

// --- Middleware ---
// Production mein, hum sirf API routes par CORS allow karenge.
// Static file serving ke liye CORS ki zaroorat nahi hai.
app.use(cors({
    origin: (origin, callback) => {
        // Sirf API calls ko allow karein, jahan origin exist karta ho (i.e., local development)
        // Production mein, yeh same server se aayega.
        callback(null, true);
    }
}));
app.use(bodyParser.json());

// --- 1. FRONT-END STATIC FILES SERVING ---
// Yeh line Node.js ko bataati hai ki saari Angular 'dist' files kahan hain.
// Kripya 'worker-scanner-app' ko apne dist folder ke naam se badal dein agar woh alag hai.
const frontendPath = path.join(__dirname, 'worker-scanner-app', 'dist', 'worker-scanner-app');
app.use(express.static(frontendPath));

// --- 2. WORKER DATA (API Data Source) ---
const workerData = [
    // ... (Aapka pura worker data yahan same rahega)
    {
        Worker_ID: '1',
        Name: 'Rahul R. Jangyadh',
        Safety_Induction_Status: 'Done',
        DOB: '05/03/1994',
        Medical_Report_Link: 'https://placehold.co/1000x600/1e40af/ffffff?text=Rahul+Medical+Report',
        Medical_Test_Date: '19/04/2025',
        Medical_Due_Date: '19/04/2026',
        Medical_Validity: 'M.R. Valid'
    },
    // ... (ID 2 se ID 10 tak ka baaki data yahan copy-paste karein)
    {
        Worker_ID: '10',
        Name: 'Mr. Sunil Sanjay',
        Safety_Induction_Status: 'Done',
        DOB: '01/01/1995',
        Medical_Report_Link: 'https://placehold.co/1000x600/7c3aed/ffffff?text=Sunil+Sanjay+Medical+Report',
        Medical_Test_Date: '07/09/2024',
        Medical_Due_Date: '06/09/2025',
        Medical_Validity: 'Medical Due'
    }
];

// --- 3. API Endpoint (Data Request handler) ---
app.get('/api/worker/:id', (req, res) => {
    const workerId = req.params.id;
    const worker = workerData.find(w => w.Worker_ID === workerId);

    const simplifiedWorker = worker ? {
        ...worker,
        Medical_Validity: worker.Medical_Validity.includes('Valid') 
                            ? 'Valid' 
                            : (worker.Medical_Validity.includes('Due') ? 'Due' : 'Expired'),
        Safety_Induction_Status: worker.Safety_Induction_Status.includes('Done') ? 'Done' : 'Pending'
    } : null;

    if (simplifiedWorker) {
        return res.json({ success: true, data: simplifiedWorker, message: 'Worker data fetched successfully.' });
    } else {
        return res.status(404).json({ success: false, message: `Worker ID ${workerId} not found.` });
    }
});

// --- 4. CATCH-ALL ROUTE (Front-end Routing ke liye) ---
// Yeh zaroori hai taki jab koi user seedhe 'yourdomain.com/scanner' type kare, toh Angular use handle kare.
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});


// --- Server Startup ---
app.listen(port, () => {
    console.log(`Production Server is running on port ${port}`);
    console.log(`Front-end files are being served from: ${frontendPath}`);
});
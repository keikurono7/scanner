import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { db } from './firebase/firebase'; 
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import PopupModal from './popup';

function QrScannerComponent() {
    const [popupMessage, setPopupMessage] = useState('');
    const [popupColor, setPopupColor] = useState(''); // To store the color for the popup
    const [popupVisible, setPopupVisible] = useState(false); // To manage modal visibility
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const html5QrCodeRef = useRef(null);

    const fetchAttendees = async () => {
        const querySnapshot = await getDocs(collection(db, "Attendees"));
        const attendeesList = [];
        querySnapshot.forEach((doc) => {
            attendeesList.push({ id: doc.id, ...doc.data() });
        });
        setAttendees(attendeesList);
        setLoading(false);
    };

    useEffect(() => {
        fetchAttendees();
    }, []);

    const startScanner = () => {
        const html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                handleScan(decodedText);
                html5QrCode.stop(); // Stop scanning after a successful scan
            },
            (errorMessage) => {
                console.log("QR Code Error: ", errorMessage);
            }
        ).catch((err) => {
            console.error("Unable to start scanning:", err);
        });
    };

    const handleScan = async (usn) => {
        const docRef = doc(db, "Attendees", usn);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const attendee = docSnap.data();
            if (!attendee.event) {
                await updateDoc(docRef, { event: true });
                showPopup("Attendance marked!", "green");
            } else if (!attendee.food) {
                await updateDoc(docRef, { food: true });
                showPopup("Food marked!", "orange");
            } else {
                showPopup("Not allowed!", "red");
            }
            fetchAttendees(); // Refresh attendee list
        } else {
            showPopup("No attendee found with this USN.", "red");
        }
    };

    const showPopup = (message, color) => {
        setPopupMessage(message);
        setPopupColor(color);
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const toggleAttendance = async (id, field) => {
        const docRef = doc(db, "Attendees", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const currentStatus = docSnap.data()[field];
            await updateDoc(docRef, { [field]: !currentStatus });
            fetchAttendees(); // Refresh the attendee list
        }
    };

    return (
        <div className="qr-scanner">
            <h2>Scan QR Code with Camera</h2>
            <div id="qr-reader" style={{ width: "300px" }}></div>
            <button onClick={startScanner}>Start Scanner</button>

            {popupVisible && (
                <PopupModal message={popupMessage} color={popupColor} onClose={closePopup} />
            )}

            <h2>Attendee List</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {attendees.map((attendee) => (
                        <li key={attendee.id}>
                            {attendee.name} - USN: {attendee.usn}<br/>
                            <button onClick={() => toggleAttendance(attendee.id, 'event')}>
                                {attendee.event ? 'Mark as Not Attended' : 'Mark as Attended'}
                            </button>
                            <button onClick={() => toggleAttendance(attendee.id, 'food')}>
                                {attendee.food ? 'Mark as Not Fed' : 'Mark as Fed'}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default QrScannerComponent;

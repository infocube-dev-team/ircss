import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './HospitalOptions.css';
// import { getOrganizations } from '../controller/FhirHandler';
import { Button, TextField } from '@mui/material';

const Patients: React.FC = () => {
    const location = useLocation();
    const state = location.state as { ospedale: string };
    const [patientId, setPatientId] = useState<string>('');
    const [patientData] = useState(null);

    const fetchPatient = async () => {
        // try {
        //     const patientData = await getPatientById();
        //     setPatientData(patientData);
        // } catch (error) {
        //     console.error(error);
        // }

    };

    const handleKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            fetchPatient();
        }
    }

    return (
        <div className="centered-page">
            <h1>Seleziona il paziente da analizzare da {state.ospedale}</h1>
            <TextField
                label="ID paziente"
                variant="standard"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <Button variant="outlined" onClick={fetchPatient} sx={{ m: 2 }}>
                Cerca paziente
            </Button>

            {patientData && (
                <div>
                    <h2>Dettagli del paziente:</h2>
                    <pre>{JSON.stringify(patientData, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Patients;

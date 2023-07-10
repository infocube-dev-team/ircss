import { useLocation } from 'react-router-dom';
import './HospitalOptions.css';

const Reports: React.FC = (props) => {
    const location = useLocation();
    const state = location.state as { ospedale: string };

    return (
        <div className="centered-page">
            <h1>Documenti {state.ospedale}</h1>
        </div>
    );
}

export default Reports;

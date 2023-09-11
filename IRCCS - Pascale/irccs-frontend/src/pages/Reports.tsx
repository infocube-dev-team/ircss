import './Options/HospitalOptions/HospitalOptions.css';

interface ReportsProps {
    ospedale?: string;
}

const Reports = (props: ReportsProps) => {

    return (
        <div className="centered-page">
            <h1>Documenti {props.ospedale}</h1>
        </div>
    );
}

export default Reports;

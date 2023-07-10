import { useLocation, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import './HospitalOptions.css';

interface JsonTable {
    id: number;
    name: string;
    description: string;
}


const selezionaComponente = (name: string): string => {
    switch (name) {
        case 'Reports':
            return '/reports';
        case 'Pazienti già inseriti':
            return '/patients';
        case 'Nuovo Paziente':
            return '/new-patient';
        default:
            return '/';
    }
};

const HospitalOptions: React.FC = () => {
    const location = useLocation();
    const state = location.state as { ospedale: string };

    const tableData: JsonTable[] = [];

    const navigate = useNavigate();

    const handleLinkClick = (name: string) => {
        const ospedale = state?.ospedale || '';
        const link = selezionaComponente(name);
        navigate(link, { state: { ospedale } });
    };

    if (state?.ospedale === 'Pascale') {
        tableData.push(
            { id: 1, name: 'Reports', description: 'Reports' },
            { id: 2, name: 'Nuovo Paziente', description: 'Aggiungi un nuovo paziente' },
            { id: 3, name: 'Pazienti già inseriti', description: 'Visualizza pazienti già inseriti' }
        );
    } else if (state?.ospedale === 'Infocube') {
        tableData.push(
            { id: 1, name: 'Reports', description: 'Reports' },
            { id: 3, name: 'Pazienti già inseriti', description: 'Visualizza pazienti già inseriti' }
        );
    }
    else if (state?.ospedale === 'Other Hospital') {
        tableData.push(
            { id: 2, name: 'Nuovo Paziente', description: 'Aggiungi un nuovo paziente' },
            { id: 3, name: 'Pazienti già inseriti', description: 'Visualizza pazienti già inseriti' }
        );
    }
    else if (state?.ospedale === 'MITO-16b Phase 3') {
        tableData.push(
            { id: 1, name: 'Reports', description: 'Reports' }
        );
    }

    return (
        <div className="centered-page">
            <p className='header'>Sei abilitato alle seguenti funzioni per {state.ospedale}:</p>
            <TableContainer component={Paper} className="table-container-hospital-options">
                <Table>
                    <TableBody>
                        <TableRow>
                        </TableRow>
                        {tableData.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="centered-cell link-cell" onClick={() => handleLinkClick(item.name)}>
                                    {item.name}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default HospitalOptions;

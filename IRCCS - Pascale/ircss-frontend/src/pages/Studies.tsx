import React, { useEffect, useState } from 'react';
import { getStudiesComplete } from '../service/FhirHandler';
import { MenuItem, FormControl, Select, Input, Button, Box } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './Organizations.css';
import Tabella from '../components/Tabella';

interface Study {
    id: string;
    title: string;
    status: string;
    sponsor: string;
    principalInvestigator: string;
    documentsLink: string;
    numberOfPatientsEnrolled: string;
}

interface TableColumn {
    header: string;
}

const headers: TableColumn[] = [
    { header: 'ID' },
    { header: 'Descrizione' },
    { header: 'On-Line' },
];

type TableRow = Array<string | number>;

const Studies = () => {
    const [studies, setStudies] = useState<Study[]>([]);
    const [filterParam, setFilterParam] = useState<string>('');
    const [filterValue, setFilterValue] = useState<string>('');
    const [filteredStudies, setFilteredStudies] = useState<TableRow[]>([]);

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                const response: Study[] = await getStudiesComplete();

                const sortedStudies = response.sort((a, b) => {
                    if (a.id && b.id) {
                        return a.id.localeCompare(b.id);
                    } else if (!a.id && b.id) {
                        return 1;
                    } else if (a.id && !b.id) {
                        return -1;
                    } else {
                        return 0;
                    }
                });

                setStudies(sortedStudies);
                setFilteredStudies(sortedStudies.map(convertToTableRow));
            } catch (error) {
                console.error(error);
            }
        };

        fetchStudies();
    }, []);

    const handleFilterParamChange = (event: SelectChangeEvent<string>) => {
        const value = event.target.value;
        setFilterParam(value);

        // Se il valore del filtro è vuoto o il filtro stesso non è selezionato, mostriamo tutte gli studi senza filtro
        if (!value || !filterValue) {
            setFilteredStudies(studies.map(convertToTableRow));
        } else {
            applyFilter(filterValue, value);
        }
    };

    const handleFilterValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFilterValue(value);
        applyFilter(value);
    };

    const convertToTableRow = (study: Study): TableRow => {
        return [study.id, study.title, study.status];
    };

    const applyFilter = (value?: string, param?: string) => {
        if (filterParam) {
            const filteredStudies = studies.filter((study) => {
                const paramValue = study[(param ?? filterParam) as keyof Study] as string;
                if (paramValue == null) {
                    return false;
                }
                return paramValue.toLowerCase().includes((value || filterValue).toLowerCase());
            });
            setFilteredStudies(filteredStudies.map(convertToTableRow));
        } else {
            setFilteredStudies([]);
        }
    };

    const handleNewStudyClick = () => {
        // Implementare la gestione del click su "Nuovo studio"
    };

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="centered-page">
            <Box sx={{ overflow: "auto" }}>
                <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
                    <div className="header">
                        <h3>UOSC BackOffice</h3>
                        <h4>Gestione Studi - Indice</h4>
                    </div>
                    <div className="filters-container">
                        <ArrowBackIcon onClick={handleGoBack} className="back-icon" />
                        <div className="filter-section">
                            <FormControl>
                                <Select
                                    value={filterParam}
                                    onChange={handleFilterParamChange}
                                    displayEmpty
                                    className="filter-select textContainer"
                                >
                                    <MenuItem value="" disabled>
                                        Scegli il parametro di filtro
                                    </MenuItem>
                                    <MenuItem value="id">ID</MenuItem>
                                    <MenuItem value="title">Descrizione</MenuItem>
                                    <MenuItem value="status">On-Line</MenuItem>
                                </Select>
                            </FormControl>
                            <Input
                                placeholder="Inserisci il valore di filtraggio"
                                value={filterValue}
                                onChange={handleFilterValueChange}
                                className="filter-input textContainer"
                            />
                        </div>
                        <div className="new-center-button">
                            <Button className='textContainer' variant="outlined" onClick={handleNewStudyClick}>
                                Nuovo studio
                            </Button>
                        </div>
                    </div>
                    {filteredStudies.length > 0 ? (
                        <Tabella
                            rows={filteredStudies}
                            headers={headers}
                        />
                    ) : (
                        <div className="no-results">Nessun risultato trovato.</div>
                    )}
                </Box>
            </Box>
        </div>
    );
};

export default Studies;

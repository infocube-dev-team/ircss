import React, { useEffect, useState } from 'react';
import { getOrganizations } from '../service/FhirHandler';
import { MenuItem, FormControl, Select, Input, Button, Box } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './Organizations.css';
import Tabella from '../components/Tabella';
import { useNavigate } from 'react-router-dom';

// Definiamo l'interfaccia per il tipo Organization
interface Organization {
    id?: string;
    name?: string;
    code?: string;
    city?: string;
    responsible?: string;
    country?: string;
    description?: string;
    address?: string;
    postalCode?: string;
    province?: string;
    telephoneNumber?: string;
    fax?: string;
    referent?: string;
    ethicsCommittee?: string;
    group?: string;
    osscCode?: string;
    administrativeReferences?: string;
    notes?: string;
}

// Interfaccia per le colonne della tabella
interface TableColumn {
    header: string;
}

// Definiamo le intestazioni delle colonne della tabella
const headers: TableColumn[] = [
    { header: 'ID' },
    { header: 'Descrizione' },
    { header: 'Codice' },
    { header: 'Città' },
    { header: 'Responsabile' },
    { header: 'Nazione' }
];

// Tipo per le righe della tabella
type TableRow = Array<string | number>;

const Organizations = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [filterParam, setFilterParam] = useState<string>('');
    const [filterValue, setFilterValue] = useState<string>('');
    const [filteredOrganizations, setFilteredOrganizations] = useState<TableRow[]>([]);
    const navigate = useNavigate();

    // Effettuiamo la chiamata per ottenere le organizzazioni
    useEffect(() => {
        // Effettuiamo la chiamata per ottenere le organizzazioni
        const fetchOrganizations = async () => {
            try {
                const response: Organization[] = await getOrganizations();

                // Ordina gli elementi in base al codice in maniera ascendente, posizionando quelli senza codice alla fine
                const sortedOrganizations = response.sort((a, b) => {
                    if (a.code && b.code) {
                        return a.code.localeCompare(b.code);
                    } else if (!a.code && b.code) {
                        return 1;
                    } else if (a.code && !b.code) {
                        return -1;
                    } else {
                        return 0;
                    }
                });

                setOrganizations(sortedOrganizations);
                setFilteredOrganizations(sortedOrganizations.map(convertToTableRow));
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrganizations();
    }, []);

    // Gestione del cambio del parametro di filtro
    const handleFilterParamChange = (event: SelectChangeEvent<string>) => {
        setFilterParam(event.target.value);
        applyFilter(filterValue ?? '', event.target.value);
    };

    // Gestione del cambio del valore del filtro
    const handleFilterValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFilterValue(value);
        applyFilter(value);
    };

    // Funzione per convertire un oggetto Organization in TableRow
    const convertToTableRow = (org: Organization): TableRow => {
        return [
            org.id || "",
            org.name || "",
            org.code || "",
            org.city || "",
            org.responsible || "",
            org.country || "",
        ];
    };

    // Funzione per applicare il filtro
    const applyFilter = (value?: string, param?: string) => {
        if (value && filterParam) {
            const filteredOrgs = organizations.filter((org) => {
                const paramValue = org[(param ?? filterParam) as keyof Organization] as string;

                if (paramValue == null) {
                    return false;
                }
                return paramValue.toLowerCase().includes(value.toLowerCase());
            });
            setFilteredOrganizations(filteredOrgs.map(convertToTableRow));
        } else {
            // Se il valore del filtro è vuoto o il filtro stesso non è selezionato, mostriamo tutte le organizzazioni senza filtro
            setFilteredOrganizations(organizations.map(convertToTableRow));
        }
    };

    // Gestione del click sul pulsante "Nuovo centro"
    const handleNewCenterClick = () => {
        // Implementare la gestione del click su "Nuovo centro"
        navigate('newCenter');
    };

    // Gestione del click sul pulsante di "Torna indietro"
    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div className="centered-page">
            <Box sx={{ overflow: "auto" }}>
                <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
                    <div className="header">
                        <h3>UOSC BackOffice</h3>
                        <h4>Gestione Centri - Indice</h4>
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
                                    <MenuItem value="name">Descrizione</MenuItem>
                                    <MenuItem value="code">Codice</MenuItem>
                                    <MenuItem value="city">Città</MenuItem>
                                    <MenuItem value="responsible">Responsabile</MenuItem>
                                    <MenuItem value="country">Nazione</MenuItem>
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
                            <Button className='textContainer' variant="outlined" onClick={handleNewCenterClick}>
                                Nuovo centro
                            </Button>
                        </div>
                    </div>
                    {/* Visualizziamo la tabella solo se ci sono organizzazioni da mostrare */}
                    {filteredOrganizations.length > 0 ? (
                        <Tabella
                            rows={filteredOrganizations}
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

export default Organizations;

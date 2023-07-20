import React, { useEffect, useState } from 'react';
import { getOrganizations } from '../service/FhirHandler';
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    MenuItem,
    FormControl,
    Select,
    Input,
    Button,
    Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { SelectChangeEvent } from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import './Organizations.css';
import { useNavigate } from 'react-router-dom';

interface Organization {
    id: string;
    name: string;
    code: string;
    city: string;
    responsible: string;
    country: string;
    description: string;
    address: string;
    postalCode: string;
    province: string;
    telephoneNumber: string;
    fax: string;
    referent: string;
    ethicsCommittee: string;
    group: string;
    osscCode: string;
    administrativeReferences: string;
    notes: string;
  }
  

const Organizations = () => {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [filterParam, setFilterParam] = useState<string>('');
    const [filterValue, setFilterValue] = useState<string>('');
    const [filteredOrganizations, setFilteredOrganizations] = useState<Organization[]>([]);
    const [filterApplied, setFilterApplied] = useState<boolean>(false);
    const navigate = useNavigate();


    useEffect(() => {
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
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrganizations();
    }, []);


    const handleFilterParamChange = (event: SelectChangeEvent<string>) => {
        setFilterParam(event.target.value);
        applyFilter(filterValue ?? '', event.target.value);
    };


    const handleFilterValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFilterValue(value);
        applyFilter(value);
    };


    const handleNewCenterClick = () => {
        let filteredData: Organization[] = [];

        if (filterParam && filterValue) {
            filteredData = organizations.filter((entry: Organization) => {
                const filterField = entry[filterParam as keyof Organization]?.toLowerCase();
                return filterField?.includes(filterValue.toLowerCase());
            });
        }

        setFilteredOrganizations(filteredData);
        setFilterApplied(true);
    };

    // Funzione per applicare il filtro
    const applyFilter = (value?: string, param?: string) => {
        if (filterParam) {
            const filteredOrgs = organizations.filter((org) => {
                const paramValue = org[(param ?? filterParam) as keyof Organization] as string;

                if (paramValue == null) {
                    return false;
                }
                return paramValue.toLowerCase().includes((value || filterValue).toLowerCase());
            });
            setFilteredOrganizations(filteredOrgs);
            setFilterApplied(true);
        } else {
            setFilteredOrganizations([]);
            setFilterApplied(false);
        }
    };


    const handleGoBack = () => {
        window.history.back();
    };

    const handleEdit = (id: string) => {
        navigate('edit', { state: { id } });
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
                    <Table className="table-container">
                        <TableHead>
                            <TableRow>
                                <TableCell className="category-cell textContainer">ID</TableCell>
                                <TableCell className="category-cell textContainer">Descrizione</TableCell>
                                <TableCell className="category-cell textContainer">Codice</TableCell>
                                <TableCell className="category-cell textContainer">Città</TableCell>
                                <TableCell className="category-cell textContainer">Responsabile</TableCell>
                                <TableCell className="category-cell textContainer">Nazione</TableCell>
                                <TableCell className="category-cell textContainer">Edit</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterApplied && filterValue
                                ? filteredOrganizations.map((entry: Organization) => (
                                    <TableRow key={entry.id} className="category-row">
                                        <TableCell className="centered-cell cell-wrap">{entry.id}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">{entry.name}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">{entry.code}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">{entry.city}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">{entry.responsible}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">{entry.country}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">
                                            <IconButton onClick={() => handleEdit(entry.id) }>
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                                : organizations.map((entry: Organization) => (
                                    <TableRow key={entry.id} className="category-row">
                                        <TableCell className="centered-cell cell-wrap">{entry.id}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">{entry.name}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">{entry.code}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">{entry.city}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">{entry.responsible}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">{entry.country}</TableCell>
                                        <TableCell className="centered-cell cell-wrap">
                                        <IconButton onClick={() => handleEdit(entry.id) }>
                                                <EditIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </Box>
            </Box>
        </div>
    );
};

export default Organizations;

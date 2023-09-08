import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Select,
    Table,
    TableBody, TableCell, TableHead, TableRow, TextField
} from '@mui/material';


import React, {useCallback, useEffect, useState} from "react";
import {Organization} from "../interfaces/Organization";
import {Country} from "../interfaces/Country";
import {createOrganization} from "../service/FhirHandler";
import {useNavigate} from "react-router-dom";


const NewCenter: React.FC = () => {

    const navigate = useNavigate();
    const [countries, setCountries] = useState<Country[]>([]);
    const [modifiedOrganization, setModifiedOrganization] = useState<Organization>({
        id: '',
        name: '',
        code: '',
        city: '',
        responsible: '',
        country: '',
        description: '',
        address: '',
        postalCode: '',
        province: '',
        telephoneNumber: '',
        fax: '',
        referent: '',
        ethicsCommittee: '',
        group: '',
        osscCode: '',
        administrativeReferences: '',
        notes: '',
    });


    const handleInputChange = (fieldName: keyof Organization, value: string) => {
        setModifiedOrganization((prevOrganization) => {
            const organization = {
                ...prevOrganization!,
                [fieldName]: value,
            };
            return organization;
        });
    };


    const fetchCountries = useCallback(async () => {
        try {
            const response = await fetch('https://restcountries.com/v2/all');
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            console.error(error);
        }
    }, []);


    const handleSaveChanges = () => {
        createOrganization(modifiedOrganization).then(r =>
            navigate('/organizations')
        );
    };


    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);


    return (
        <div className="centered-page">
            <Box>
                <Box>
                    <Table className="table-container">
                        <TableBody>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Codice</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="code"
                                        onChange={(e) => handleInputChange("code", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per il codice</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Descrizione</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="description"
                                        onChange={(e) => handleInputChange("description", e.target.value)}
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per la descrizione</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Nome del centro</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="name"
                                        onChange={(e) => handleInputChange("name", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per il nome del centro</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Indirizzo</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="address"
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per l'indirizzo</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">CAP</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="postalCode"
                                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per il CAP</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Città</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="city"
                                        onChange={(e) => handleInputChange("city", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per la città</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Provincia</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="province"
                                        onChange={(e) => handleInputChange("province", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per la provincia</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Telefono</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="telephoneNumber"
                                        onChange={(e) => handleInputChange("telephoneNumber", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per il telefono</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Fax</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="fax"
                                        onChange={(e) => handleInputChange("fax", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per il fax</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Referente</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="referent"
                                        onChange={(e) => handleInputChange("referent", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per il referente</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Responsabile</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="responsible"
                                        onChange={(e) => handleInputChange("responsible", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per il responsabile</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Nazione</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <FormControl variant="outlined">
                                        <Select
                                            name="country"
                                            onChange={(e) => handleInputChange('country', e.target.value as string)}
                                            label="Nazione"
                                        >
                                            {countries.map((country) => (
                                                <MenuItem  key={country.alpha2Code} value={country.name}>
                                                    {country.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per la nazione</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Comitato Etico</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="ethicsCommittee"
                                        onChange={(e) => handleInputChange("ethicsCommittee", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per il comitato etico</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Gruppo</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="group"
                                        onChange={(e) => handleInputChange("group", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per il gruppo</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Codice centro clinico OSSC</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="osscCode"
                                        onChange={(e) => handleInputChange("osscCode", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per il codice centro clinico OSSC</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Ref. Amministrative</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="administrativeReferences"
                                        onChange={(e) => handleInputChange("administrativeReferences", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per le referenze amministrative</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Note</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="notes"
                                        onChange={(e) => handleInputChange("notes", e.target.value)}
                                        variant="outlined"
                                        multiline
                                        rows={4}
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per le note</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Box>
            </Box>
            <div className="save-button">
                <Button variant="contained" onClick={handleSaveChanges}>
                    Salva modifiche
                </Button>
            </div>

        </div>
    );
}


export default NewCenter;
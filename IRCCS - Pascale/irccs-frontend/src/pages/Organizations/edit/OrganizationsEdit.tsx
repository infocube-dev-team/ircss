import { Organization } from '../../../interfaces/Organization';
import { Country } from '../../../interfaces/Country';
import  '../../../service/ClientService';
import { Box, Button, Table, TableHead, TableRow, TableCell, TableBody, TextField, FormControl, Select, MenuItem } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {getOrganizationById, getStudies, updateOrganizationById} from "../../../service/FhirHandler";
import {useLocation, useNavigate} from "react-router-dom";

import '../Organizations.css';


const OrganizationsEdit = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState<Organization>();
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


    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);
    const [studies, setStudies] = useState<any[]>([]);

    const fetchOrganizations = useCallback(async () => {
        try {
            const organizationResponse: Organization | null = await getOrganizationById(state.id);
            //const studiesResponse: any[] = await getStudies(organizationResponse.id);

            setOrganization(organizationResponse ?? undefined);
            setModifiedOrganization(organizationResponse ?? undefined);
            //setStudies(studiesResponse);
        } catch (error) {
            console.error(error);
        }
    }, [state.id]);



    useEffect(() => {
        fetchOrganizations();
    }, [fetchOrganizations]);

    const handleInputChange = (fieldName: keyof Organization, value: string) => {
        setModifiedOrganization((prevOrganization) => {
            const updatedOrganization = {
                ...prevOrganization!,
                [fieldName]: value,
            };

            const isModified = Object.keys(updatedOrganization).some((key) => {
                return updatedOrganization[key as keyof Organization] !== organization?.[key as keyof Organization];
            });

            setIsSaveButtonDisabled(!isModified);

            return updatedOrganization;
        });
    };


    const handleSaveChanges = () => {
        if (modifiedOrganization) {
            updateOrganizationById(modifiedOrganization).then(r => navigate('/organizations'));
        }
    };



    const [countries, setCountries] = useState<Country[]>([]);

    const fetchCountries = useCallback(async () => {
        try {
            const response = await fetch('https://restcountries.com/v2/all');
            const data = await response.json();
            setCountries(data);
        } catch (error) {
            console.error(error);
        }
    }, []);


    useEffect(() => {
        fetchCountries();
    }, [fetchCountries]);

    const headerNames = [
        "Studio",
        "Abilitato",
        "Documenti",
        "Principal Investigator",
        "Paz. Arruolati",
    ];

    return (
        <div className="centered-page">
            <h1>{organization?.name}</h1>
            <Box>
                <Box>
                    <Table className="table-container">
                        <TableBody>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Codice</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="code"
                                        value={modifiedOrganization?.code}
                                        onChange={(e) => handleInputChange("code", e.target.value)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell className="centered-cell cell-wrap">Link per il codice</TableCell>
                            </TableRow>
                            <TableRow className="category-row">
                                <TableCell className="centered-cell cell-wrap">Nome del centro</TableCell>
                                <TableCell className="centered-cell cell-wrap">
                                    <TextField
                                        name="name"
                                        value={modifiedOrganization?.name}
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
                                        value={modifiedOrganization?.address}
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
                                        value={modifiedOrganization?.postalCode}
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
                                        value={modifiedOrganization?.city}
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
                                        value={modifiedOrganization?.province}
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
                                        value={modifiedOrganization?.telephoneNumber}
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
                                        value={modifiedOrganization?.fax}
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
                                        value={modifiedOrganization?.referent}
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
                                        value={modifiedOrganization?.responsible}
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
                                            value={modifiedOrganization?.country}
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
                                        value={modifiedOrganization?.ethicsCommittee}
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
                                        value={modifiedOrganization?.group}
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
                                        value={modifiedOrganization?.osscCode}
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
                                        value={modifiedOrganization?.administrativeReferences}
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
                                        value={modifiedOrganization?.notes}
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
                <Button variant="contained" onClick={handleSaveChanges} disabled={isSaveButtonDisabled}>
                    Salva modifiche
                </Button>
            </div>
        </div>
    );
}
export default OrganizationsEdit;

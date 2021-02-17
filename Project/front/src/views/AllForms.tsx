import { FormControl, Icon, IconButton, InputAdornment, InputLabel, OutlinedInput, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormApi from '../api/formApis';
import { GetAllFormsRes } from '../types/form';
import { notif } from '../Utils/notification.utils';

const formsService = new FormApi();

function AllForms() {
    const [state , setState] = useState<GetAllFormsRes>({
        forms: []
    })

    useEffect(() => {
        getAllForms()
    }, []);

    function getAllForms(){
        formsService.getAllForms()
        .then((data)=>{
            setState(data)
        })
        .catch(e=>{
            notif('danger','Error', e.message)
        })
    }

    const searchForm = (e: any) =>{
        const content = e.target.value;
        if(!content){
            getAllForms();
            return;
        }
        formsService.searchForms({content})
        .then(data=>{
            setState(data)
        })
        .catch(e=>{
            notif('danger','Error', e.message)
        })
    }

    return (
        <div className="forms-list">
            <h3 className="mb-3">All Forms</h3>
            <div className="desciption mb-4">All Forms can be seen in the table bellow, you can fill the one's you like.</div>
            <FormControl className="w-100 mb-4" variant="outlined">
                <InputLabel htmlFor="search">Search</InputLabel>
                <OutlinedInput
                    id="search"
                    onChange={searchForm}
                    startAdornment={
                    <InputAdornment position="start">
                        <Icon>search</Icon>
                    </InputAdornment>}
                    labelWidth={60}
                />
            </FormControl>
            <TableContainer component={Paper}>
                <Table className="table" aria-label="forms table">
                    <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Submit</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {state.forms.map((f, i) => (
                        <TableRow key={f.title}>
                            <TableCell>{i+1}</TableCell>
                            <TableCell>{f.title}</TableCell>
                            <TableCell>
                                <div className="table-description">
                                {f.description}
                                </div>
                               </TableCell>
                            <TableCell>
                                <Link to={`/dashboard/submit-form?id=${f.form_id}`}>
                                    <IconButton>
                                        <Icon>keyboard_arrow_right</Icon>
                                    </IconButton>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div> 
    );
}

export default AllForms;

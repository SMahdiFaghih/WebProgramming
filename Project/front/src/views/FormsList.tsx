import { Icon, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormApi from '../api/formApis';
import { FormData, GetUserFormsRes } from '../types/form';
import { notif } from '../Utils/notification.utils';

const formsService = new FormApi();

function FormsList() {
    const role = JSON.parse(localStorage.getItem('Role') as string)
    const [state , setState] = useState<GetUserFormsRes>({
        forms: []
    })
    useEffect(() => {
        getForms()
    }, []);

    function getForms(){
        formsService.getUserForms()
        .then((data)=>{
            setState(data)
        })
        .catch(e=>{
            notif('danger','Error', e.message)
        })
    }

    function closeForm(formId:number){
        formsService.closeForm({formId})
        .then((data)=>{
            getForms();
        })
        .catch(e=>{
            notif('danger','Error', e.message)
        })
    }

    const formActions = (f:FormData)=>{
        if(role === 'lecturer')
            return( 
            <>
            <TableCell>
                <Link to={`/dashboard/submit-list?id=${f.form_id}`}>
                        Responses
                </Link>
            </TableCell>
            <TableCell >
                <IconButton edge="start"  color="inherit" aria-label="menu" onClick={()=>closeForm(f.form_id)}>
                    <Icon>close</Icon>
                </IconButton>
            </TableCell>
            </>)
    }

    const description = ()=>{
        if(role === 'lecturer'){
            return(
                <div className="desciption mb-4">
                    These are the froms that you have made, you can close them or see the responses to the forms.
                </div>
            )
        }else{
            return(
                <div className="desciption mb-4">
                    These are the froms that you have filled, you can see their status in here.
                </div>
            )
        }
    }

    return (
        <div className="forms-list">
            <h3 className="mb-3">My Forms</h3>
            {description()}
            <TableContainer component={Paper}>
                <Table className="table" aria-label="forms table">
                    <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
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
                            <TableCell>{f.status}</TableCell>
                        {formActions(f)}
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div> 
    );
}

export default FormsList;

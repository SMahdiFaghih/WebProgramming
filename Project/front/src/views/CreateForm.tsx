import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Icon, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import FormApi from '../api/formApis';
import { default as AddCheckListDialog, default as AddChecklistDialog } from '../dialogs/AddCheckList';
import AddFieldDialog from '../dialogs/AddField';
import { FormContent, FormField } from '../types/form';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

function createData(name:string, calories:number, fat:number, carbs:number, protein:number) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const formsService = new FormApi();

function CreateForm() {
    const history = useHistory();
    const [state , setState] = useState<FormContent>({
        title:'',
        description:'',
        fields: [],
    })
    const [error , setError] = useState({
        title:'',
        description:'',
    })
    
    function createForm(){
        const formContent = state;
        formsService.createForm({formContent})
        .then((data)=>{
            // setState(data.forms as Form[])
            history.push('/dashboard/forms-list')
        })
        .catch(e=>console.error(e))
    }

    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        const hasError = Object.values(error).some(err=>!!err)
        || Object.values(state).some(v=>!v)
        if(hasError) return
        createForm();
    }

    function handleChange(e:any){
        const {id, value} = e.target 
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
        setError(prevError => ({
            ...prevError,
            [id] : value ? '' : `${id} is required`
        }))
    }

    const [openAddFieldDialog, setOpenAddFieldDialog] = useState(false);
    const openAddField = () => {
        setOpenAddFieldDialog(true);
    }
    const addField = (field: FormField) => {
        setOpenAddFieldDialog(false);
        const fields = state.fields;
        fields.push(field);
        setState(prevState => ({
            ...prevState,
            fields
        }))
    }

    const [openAddCheckListDialog, setOpenAddCheckListDialog] = useState(false);
    const openAddCheckList = () => {
        setOpenAddCheckListDialog(true);
    }
    const addCheckList = (field: FormField) => {
        setOpenAddCheckListDialog(false);
        const fields = state.fields;
        fields.push(field);
        setState(prevState => ({
            ...prevState,
            fields
        }))
    }



    function renderFields() {
        return state.fields.map(f => {                  
            if(f.type === 'TextField'){
                return(
                <TextField className="mb-3" label={f.field_name} defaultValue={f.field_name} variant="outlined" disabled required={f.required}/>);
            }
            else if(f.type === 'CheckList'){
                const options = f.checklist_options!.split(',') as string[];
                return(
                <FormControl className="mb-3">
                    <FormLabel required={f.required} component="legend">{f.field_name}</FormLabel>
                    <FormGroup row>
                        {options.map((o, i) =>(
                                <FormControlLabel disabled control={<Checkbox checked={i === 0} name={o} />} label={o} />
                            ))}
                    </FormGroup>
                </FormControl>
                );
            }
        });
     }

    return (
        <div className="CreateForm">
            <div className="desciption mb-4">You Can create forms in here and establish them</div>
            <div className="form-container">
                <h2 className="mb-4">Create Form</h2>
                <form className="mb-3 d-flex flex-column" onSubmit={onSubmit}>
                    <TextField className="mb-3" id="title" error={!!error.title} helperText={error.title} label="Title" variant="outlined" onChange={handleChange} />
                    <TextField className="mb-3" id="description" error={!!error.description}  helperText={error.description} label="Description" variant="outlined"  multiline rows={4} onChange={handleChange}/>
                    <div className="desciption mb-4">Your Form Fields:</div>
                    {renderFields()}
                    <div className="d-flex">
                        <Button className="mb-3 w-50 mr-2" variant="outlined" onClick={openAddField}>
                            <Icon>add</Icon>
                            <span>Add Field</span>
                        </Button>
                        <AddFieldDialog open={openAddFieldDialog} onClose={addField}></AddFieldDialog>
                        
                        <Button className="mb-3 w-50 ml-2" variant="outlined" onClick={openAddCheckList}>
                            <Icon>add</Icon>
                            <span>Add Check List</span>
                        </Button>
                        <AddCheckListDialog open={openAddCheckListDialog} onClose={addCheckList}></AddCheckListDialog>
                    </div>
                    <Button variant="contained" type="submit" color="primary">Submit Form</Button>
                </form> 
            </div>
        </div> 
    );
}

export default CreateForm;

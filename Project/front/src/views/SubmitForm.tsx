import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Icon, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import FormApi from '../api/formApis';
import { FormFieldData, FormSubmitState } from '../types/form';
import { notif } from '../Utils/notification.utils';
import { useQuery } from '../Utils/routing.utils';

const formsService = new FormApi();

function SubmitForm() {
    const history = useHistory();
    const [state , setState] = useState<FormSubmitState>({
        email:'',
        title:'',
        description:'',
        fields: [],
    })


    const [submit , setSubmit] = useState<FormFieldData[]>([])
    const [error , setError] = useState<FormFieldData[]>([])
    const query = useQuery();

    useEffect(() => {
        getFormSubmits();
      }, []);
    
      function getFormSubmits(){
        const formId = query.get('id');
        if(!formId) {
            notif('danger','Error', 'we must have formId in them params')
            return;
          }
        formsService.getFormById({formId: Number(formId)})
        .then((data)=>{
            setState({
                email:data.formContent.lecturer_email,
                title:data.formContent.title,
                description:data.formContent.description,
                fields: data.fields,
            })
            setSubmit(
                data.fields.map(f=>({field_name:f.field_name, data:'', id:f.id}))
            )
            setError(
                data.fields.map(f=>({field_name:f.field_name, data:'', id:f.id}))
            )
        })
        .catch(e=>{
            notif('danger','Error', e.message)
        })
      }
    
    
    function submitForm(){
        const formId = query.get('id');
        if(!formId) {
            notif('danger','Error','we must have formId in them params' )
            return;
        }
        console.log(submit)
        formsService.submitForm({formId: Number(formId),fields:submit})
        .then((data)=>{
            history.push('/dashboard/forms-list')
        })
        .catch(e=>{
            notif('danger','Error', e.message)
        })
    }

    function handleChange(e:any, index:number){
        const {id, value} = e.target 
        if(e.target.type === 'checkbox'){
            // fill this
        }
        else{
            setSubmit(prevState => ([
                ...prevState.filter(p=>p.field_name!==id),
                {field_name:id,data: value, id:Number(index)} as FormFieldData
            ]))

            setError(prevState => {
                const field = state.fields.filter(f=>f.field_name === id)[0]
                const hasError = field.required && !value
                const err_msg = hasError? `${id} is required`: ''
                return([
                    ...prevState.filter(p=>p.field_name!==id),
                    {field_name:id, data: err_msg, id:Number(index)} as FormFieldData
                ])
            })
        }
    }


    function onSubmit(e: React.FormEvent){
        e.preventDefault();
        const hasError = error.some(err=>!!err.data)
        if(hasError) return
        submitForm();
    }


    function renderFields() {
        return [...(state.fields)].map((f,i) => {
            const errorObj = error.filter(e=>e.field_name == f.field_name)[0];
            if(f.type === 'TextField'){
                return(
                <TextField id={f.field_name} className="mb-3" label={f.field_name}  error={!!errorObj?.data} helperText={errorObj?.data} variant="outlined" required={!!f.required} onChange={e=>handleChange(e, f.id)}/>);
            }
            else if(f.type === 'CheckList'){
                const options = f.checklist_options!.split(',') as string[];
                return(
                <FormControl id={f.field_name} className="mb-3">
                    <FormLabel required={!!f.required} component="legend">{f.field_name}</FormLabel>
                    <FormGroup row>
                        {options.map((o, i) =>(
                                <FormControlLabel control={<Checkbox defaultChecked={i === 0} data-index={f.id} id={`${f.field_name}`} value={o} name={o} />} label={o} onChange={e=>handleChange(e, f.id)} />
                            ))}
                    </FormGroup>
                </FormControl>
                );
            }
        });
     }

    return (
        <>
      <div className="p-3">
        <Link className="text-link" to="/dashboard/forms-all">
            <Button>
            <Icon>keyboard_arrow_left</Icon>
            <span>back</span>
            </Button>
        </Link>
      </div>
        <div className="SubmitForm">
            <h2 className="mb-4">Submit Form</h2>
            <h3 className="mb-4">{state.title}</h3>
            <div className="desciption mb-4">{state.description}</div>
            <div className="desciption mb-4">lecturer email: {state.email}</div>
            <div className="form-container">
                <form className="mb-3 d-flex flex-column" onSubmit={onSubmit}>
                    {renderFields()}
                <Button className="align-self-start" variant="contained" type="submit" color="primary">Submit Form</Button>
                </form> 
            </div>
        </div> 
        </>
    );
}

export default SubmitForm;

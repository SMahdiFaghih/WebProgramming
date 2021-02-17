import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { FormField } from "../types/form";

export interface AddChecklistDialogProps {
    open: boolean;
    selectedValue?: FormField;
    onClose: (value: FormField) => void;
}
  
function AddCheckListDialog(props: AddChecklistDialogProps) {
    const { onClose, selectedValue, open } = props;
    const [ newValue, setNewValue ] = useState<FormField>(selectedValue || {field_name:'', required: true, type:"CheckList", checklist_options:''}) 


    const handleClose = () => {
      onClose(newValue);
    };
  
    const handleChange = (e:any) => {
        const {id, value} = e.target ;
        setNewValue(prevState => ({
            ...prevState,
            [id] : value
        }));
    }

    return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Field</DialogTitle>
        <DialogContent>
            <TextField
                className="mb-3"
                autoFocus
                id="field_name"
                label="Name"
                type="text"
                fullWidth
                onChange={handleChange}
           />
            Seperate Checklist options with , 
           <TextField
                className="mb-3"
                autoFocus
                id="checklist_options"
                label="Options"
                type="text"
                fullWidth
                onChange={handleChange}
            />
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox checked={newValue.required} id="required" onChange={handleChange} name="required" />}
                    label="Required"
                />
            </FormGroup>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                ADD
            </Button>
        </DialogActions>
    </Dialog>
    );
  }

export default AddCheckListDialog;
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { FormField } from "../types/form";

export interface AddFieldDialogProps {
    open: boolean;
    selectedValue?: FormField;
    onClose: (value: FormField) => void;
}
  
function AddFieldDialog(props: AddFieldDialogProps) {
    const { onClose, selectedValue, open } = props;
    const [ newValue, setNewValue ] = selectedValue ? useState(selectedValue) : useState<FormField>({field_name:'', required: true, type:"TextField"})


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

export default AddFieldDialog;
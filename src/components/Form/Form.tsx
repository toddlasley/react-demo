import React, { ChangeEvent, FormEvent } from 'react';
import { TextField, createMuiTheme, ThemeProvider, Button, IconButton } from '@material-ui/core';
import { PolarAreaChart } from './PolarAreaChart/PolarAreaChart';
import ClearIcon from '@material-ui/icons/Clear';
import './Form.scss';
import '../../styles/variables.scss';
import { MATERIAL_FORM_THEME } from '../../config/constants';

interface Input {
    type: string;
    name: string;
}

const theme = createMuiTheme(MATERIAL_FORM_THEME);

export class Form extends React.Component {
    private readonly MIN_CATEGORIES = 6;
    private readonly MAX_CATEGORIES = 10;
    private readonly INPUTS_PER_ROW = 2;
    private readonly MIN_CATEGORY_VALUE = 1;
    private readonly MAX_CATEGORY_VALUE = 10;
    private readonly CATEGORY_INPUT_TYPE = 'category';
    private readonly VALUE_INPUT_TYPE = 'value';
    
    private formRef: React.RefObject<HTMLFormElement>;
    public inputs: Input[] = [];

    public state: any;

    constructor(props: any) {
        super(props);

        this.formRef = React.createRef();

        this.state = {};

        for ( let i = 0; i < this.MIN_CATEGORIES; i++ ) {
            this.inputs.push(
                {
                    type: this.CATEGORY_INPUT_TYPE,
                    name: this.CATEGORY_INPUT_TYPE + i.toString()
                },
                {
                    type: this.VALUE_INPUT_TYPE,
                    name: this.VALUE_INPUT_TYPE + i.toString()
                }
            );
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.removeLastInputRow = this.removeLastInputRow.bind(this);
    }

    render() {
        const rows: JSX.Element[] = [];
        const labels = [];
        const data = [];

        for ( let i = 0; i < this.inputs.length; i += this.INPUTS_PER_ROW ) {
            const valueIndex = i + 1;

            const categoryInput = this.inputs[i];
            const categoryFieldHasError = this.state[this.getErrorKey(categoryInput.name)];
            const valueInput = this.inputs[valueIndex];
            const valueFieldHasError = this.state[this.getErrorKey(valueInput.name)];

            rows.push(
                <div key={"row" + i.toString()} className="input-row">
                    <TextField
                        variant="filled"
                        type="text"
                        label="Category*"
                        className="text-input"
                        key={categoryInput.name}
                        name={categoryInput.name}
                        onChange={(e) => this.handleValueChange(e, categoryInput)}
                        error={categoryFieldHasError}
                        helperText="* Required"
                    />
                    <TextField
                        variant="filled"
                        type="number"
                        label="Value*"
                        className="number-input"
                        key={valueInput.name}
                        name={valueInput.name}
                        onChange={(e) => this.handleValueChange(e, valueInput)}
                        error={valueFieldHasError}
                        helperText={valueFieldHasError ? 'Please provide a whole number between 1 and 10, inclusively.' : '* Required'}
                    />
                    {
                        valueIndex === this.inputs.length - 1 && valueIndex > this.MIN_CATEGORIES * 2
                            ?
                                <IconButton
                                    aria-label="remove"
                                    className="remove-row-btn"
                                    onClick={this.removeLastInputRow}
                                >
                                    <ClearIcon />
                                </IconButton>
                            : null
                    }
                </div>
            );

            if ( this.formRef && this.formRef.current ) {
                const formValues = this.formRef.current;
                const categoryFormValue = formValues[i.toString()];
                const categoryValue = categoryFormValue ? categoryFormValue.value : '';

                const numberFormValue = formValues[valueIndex.toString()];
                const numberValue = numberFormValue ? numberFormValue.value : 0;

                if ( !this.categoryFieldHasError(categoryValue) ) {
                    labels.push(categoryValue);
                }

                if ( !this.valueFieldHasError(numberValue) ) {
                    data.push(numberValue);
                }

            }
        }

        const categoryCount = this.inputs.length / this.INPUTS_PER_ROW;
        const formInvalid = categoryCount !== labels.length || categoryCount !== data.length;

        const polarAreaChartProps = {
            labels: labels,
            data: data,
            formInvalid: formInvalid
        };


        return (
            <div id="form-container">
                <form ref={this.formRef} onSubmit={this.handleSubmit}>
                    <ThemeProvider theme={theme}>
                        {rows}
                        <Button
                            id="add-category-btn"
                            variant="contained"
                            color="primary"
                            onClick={this.addCategory}
                            disabled={this.inputs.length / this.INPUTS_PER_ROW >= this.MAX_CATEGORIES}
                        >
                            Add Category
                        </Button>
                    </ThemeProvider>
                </form>
                <PolarAreaChart {...polarAreaChartProps} />
            </div>
        );
    }

    private removeLastInputRow() {
        const removedInputs = this.inputs.splice(this.inputs.length - this.INPUTS_PER_ROW, this.INPUTS_PER_ROW);
        
        const newState: any = {};

        removedInputs.forEach((input) => {
            newState[this.getErrorKey(input.name)] = false;    
        });

        this.setState(newState);
    }

    private addCategory(event: any) {
        event.preventDefault();

        const index = this.inputs.length;

        const categoryInput = {
            type: this.CATEGORY_INPUT_TYPE,
            name: this.CATEGORY_INPUT_TYPE + index.toString()
        };

        const valueInput = {
            type: this.VALUE_INPUT_TYPE,
            name: this.VALUE_INPUT_TYPE + (index + 1).toString()
        };

        this.inputs.push(categoryInput, valueInput);

        const newState: any = {};
        newState[this.getErrorKey(categoryInput.name)] = false;
        newState[this.getErrorKey(valueInput.name)] = false;

        this.setState(newState);
    }

    private handleValueChange(event: ChangeEvent<any>, input: Input) {
        event.preventDefault();
        const newState: any = {};

        if ( input.type === this.VALUE_INPUT_TYPE ) {
            newState[this.getErrorKey(input.name)] = this.valueFieldHasError(event.target.value);
        } else if (input.type === this.CATEGORY_INPUT_TYPE ) {
            newState[this.getErrorKey(input.name)] = this.categoryFieldHasError(event.target.value);
        }

        this.setState(newState);
    }

    private handleSubmit(event: FormEvent<any>) {
        event.preventDefault();
        console.log(this.formRef);
    }

    private categoryFieldHasError(value: string): boolean {
        return !value.length;
    }

    private valueFieldHasError(value: number): boolean {
        return isNaN(value) || value < this.MIN_CATEGORY_VALUE || value > this.MAX_CATEGORY_VALUE || value - Math.floor(value) !== 0;
    }

    private getErrorKey(inputName: string) {
        return inputName + 'Error';
    }
}
import React, { ChangeEvent, FormEvent } from 'react';
import { TextField, createMuiTheme, ThemeProvider } from '@material-ui/core';
import { PolarAreaChart } from './PolarAreaChart/PolarAreaChart';
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
    }

    render() {
        const rows: JSX.Element[] = [];
        const labels = [];
        const data = [];

        for ( let i = 0; i < this.inputs.length; i += 2 ) {
            const categoryInput = this.inputs[i];
            const categoryFieldHasError = this.state[this.getErrorKey(categoryInput.name)];
            const valueInput = this.inputs[i + 1];
            const valueFieldHasError = this.state[this.getErrorKey(valueInput.name)];

            rows.push(
                <div key={"row" + i.toString()} className="input-row">
                    <ThemeProvider theme={theme}>
                        <TextField
                            variant="filled"
                            type="text"
                            label="Category"
                            className="text-input"
                            key={categoryInput.name}
                            name={categoryInput.name}
                            onChange={(e) => this.handleValueChange(e, categoryInput)}
                            error={categoryFieldHasError}
                            helperText={categoryFieldHasError ? 'Please provide a category.' : ''}
                        />
                        <TextField
                            variant="filled"
                            type="number"
                            label="Value"
                            className="number-input"
                            key={valueInput.name}
                            name={valueInput.name}
                            onChange={(e) => this.handleValueChange(e, valueInput)}
                            error={valueFieldHasError}
                            helperText={valueFieldHasError ? 'Please provide a whole number between 1 and 10, inclusively.' : ''}
                        />
                    </ThemeProvider>
                </div>
            );

            if ( this.formRef && this.formRef.current ) {
                const formValues = this.formRef.current;
                const categoryValue = formValues[i.toString()].value;
                const numberValue = formValues[(i + 1).toString()].value;

                if ( !this.categoryFieldHasError(categoryValue) ) {
                    labels.push(categoryValue);
                }

                if ( !this.valueFieldHasError(numberValue) ) {
                    data.push(numberValue);
                }

            }
        }

        const categoryCount = this.inputs.length / 2;
        const formInvalid = categoryCount !== labels.length || categoryCount !== data.length;

        const polarAreaChartProps = {
            labels: labels,
            data: data,
            formInvalid: formInvalid
        };


        return (
            <div id="form-container">
                <form ref={this.formRef} onSubmit={this.handleSubmit}>
                    {rows}
                    <input type="submit" value="Submit" />
                </form>
                <PolarAreaChart {...polarAreaChartProps} />
            </div>
        );
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
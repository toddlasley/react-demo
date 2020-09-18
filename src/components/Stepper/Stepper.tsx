import React from 'react';
import { Button, createMuiTheme, Theme, ThemeProvider, Tooltip, withStyles } from '@material-ui/core';
import './Stepper.scss';
import '../../styles/variables.scss';
import { LIFE_CATEGORIES, MATERIAL_FORM_THEME } from '../../config/constants';
import { LifeCategory } from '../../models/LifeCategory';

const theme = createMuiTheme(MATERIAL_FORM_THEME);

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: 'black',
        color: 'white',
        fontSize: theme.typography.pxToRem(12)
    },
}))(Tooltip);

export class Stepper extends React.Component {
    public state: any;

    private readonly MAX_CATEGORIES_PER_ROW = 3;
    private readonly REQUIRED_SELECTION_COUNT = 8;

    constructor(props: any) {
        super(props);

        this.state = {
            activeStep: 0
        };

        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
    }

    get confirmButtonDisabled() {
        return !this.requiredCategoriesSelected;
    }

    get confirmButtonText() {
        return 'Next';
    }

    get requiredCategoriesSelected() {
        return this.state.selectedCategories && this.state.selectedCategories.length === this.REQUIRED_SELECTION_COUNT;
    }

    get categorySelectionElementRows(): JSX.Element[] {
        const rows = [];

        for(let row = 0; row < Math.ceil(LIFE_CATEGORIES.length / this.MAX_CATEGORIES_PER_ROW); row++) {
            const startingIndex = row * this.MAX_CATEGORIES_PER_ROW;
            const categories = LIFE_CATEGORIES.slice(startingIndex, startingIndex + this.MAX_CATEGORIES_PER_ROW);
            const buttons: JSX.Element[] = [];

            categories.forEach((category) => {
                buttons.push(
                    <HtmlTooltip
                        key={'tooltip' + category.name}
                        title={category.description}
                        placement="top-start"
                    >
                        <Button
                            key={category.name}
                            variant="contained"
                            color={this.categoryIsSelected(category) ? 'secondary' : 'default'}
                            className="category-button"
                            onClick={(e) => { this.handleSelection(e, category) }}
                            disabled={this.requiredCategoriesSelected && !this.categoryIsSelected(category)}
                        >
                            {category.name}
                        </Button>
                    </HtmlTooltip>
                );
            });

            while ( buttons.length < this.MAX_CATEGORIES_PER_ROW ) {
                buttons.push(
                    <span key={'faux' + buttons.length.toString()} className="faux-button"></span>
                );
            }

            rows.push(
                <div key={'row' + row.toString()} className="button-row">
                    {buttons}
                </div>
            );
        }

        return rows;
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div>
                    <h2>Wheel of Life</h2>
                    <div>
                        {
                            this.state.activeStep === 0
                            ?
                                <>
                                    <h3>Choose the top 8 life categories most important to you</h3>
                                    <div id="wol-category-rows-container">
                                        {this.categorySelectionElementRows}
                                    </div>
                                </>
                            : <p>Not on first page</p>
                        }

                        <div id="wol-button-actions-row">
                            <Button disabled={this.state.activeStep === 0} onClick={this.handleBack}>
                                Back
                            </Button>
                            <Button disabled={this.confirmButtonDisabled} variant="contained" color="primary" onClick={this.handleNext}>
                                {this.confirmButtonText}
                            </Button>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        );
    }

    categoryIsSelected(category: LifeCategory) {
        return this.state.selectedCategories && this.state.selectedCategories.some((a: LifeCategory) => a.name === category.name);
    }

    handleBack(event: any): void {
        event.preventDefault();

        this.setState({ activeStep: this.state.activeStep - 1 });
    }

    handleNext(event: any): void {
        event.preventDefault();

        this.setState({ activeStep: this.state.activeStep + 1 });
    }

    handleSelection(event: any, category: LifeCategory) {
        event.preventDefault();

        let selectedCatgories = this.state.selectedCategories;

        if ( selectedCatgories ) {
            if ( this.categoryIsSelected(category) ) {
                selectedCatgories = selectedCatgories.filter((a: LifeCategory) => a.name !== category.name);
            } else {
                selectedCatgories.push(category);
            }
        } else {
            selectedCatgories = [ category ];
        }

        this.setState({ selectedCategories: selectedCatgories });
    }
}
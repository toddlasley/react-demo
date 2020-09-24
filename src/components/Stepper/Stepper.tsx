import React from 'react';
import { Button, createMuiTheme, Theme, ThemeProvider, Tooltip, withStyles } from '@material-ui/core';
import './Stepper.scss';
import '../../styles/variables.scss';
import { LIFE_CATEGORIES, MATERIAL_FORM_THEME } from '../../config/constants';
import { LifeCategory } from '../../models/LifeCategory';
import { StepperPage } from './StepperPage/StepperPage';
import { PolarAreaChart } from './PolarAreaChart/PolarAreaChart';
import html2canvas from 'html2canvas';

const theme = createMuiTheme(MATERIAL_FORM_THEME);

const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        backgroundColor: 'black',
        color: 'white',
        fontSize: theme.typography.pxToRem(12)
    },
}))(Tooltip);

interface StepperState {
    activeStep: number;
    ratings: number[];
    selectedCategories: LifeCategory[];
};

export class Stepper extends React.Component<{}, StepperState> {

    private readonly MAX_CATEGORIES_PER_ROW = 3;
    private readonly REQUIRED_SELECTION_COUNT = 8;

    constructor(props: any) {
        super(props);

        this.state = {
            activeStep: 0,
            ratings: [],
            selectedCategories: []
        };

        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleRatingSelection = this.handleRatingSelection.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handlePrint = this.handlePrint.bind(this);
    }

    get nextButtonDisabled() {
        const activeStep = this.state.activeStep;
        let disabled = true;

        if ( activeStep === 0 ) {
            disabled = !this.requiredCategoriesSelected;
        } else if ( this.state.selectedCategories && activeStep <= this.state.selectedCategories.length ) {
            disabled = !this.state.ratings[activeStep - 1];
        }

        return disabled;
    }

    get requiredCategoriesSelected() {
        return this.state.selectedCategories && this.state.selectedCategories.length === this.REQUIRED_SELECTION_COUNT;
    }

    get categorySelectionElementRows(): JSX.Element[] {
        const rows = [];

        for ( let row = 0; row < Math.ceil(LIFE_CATEGORIES.length / this.MAX_CATEGORIES_PER_ROW); row++ ) {
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
                            onClick={(e) => { this.handleCategorySelection(e, category) }}
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

    get advancedPage() {
        return this.showRatingSelectPage
            ?   <StepperPage
                    {...{lifeCategory: this.state.selectedCategories[this.state.activeStep - 1], rating: this.state.ratings[this.state.activeStep - 1]}}
                    onRatingSelect={this.handleRatingSelection}
                />
            :   <PolarAreaChart {...{ labels: this.state.selectedCategories.map(c => c.name), data: this.state.ratings}} />
    }

    get showRatingSelectPage() {
        return this.state.activeStep - 1 < this.REQUIRED_SELECTION_COUNT;
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div>
                    <h2 id="wol-app-title">Wheel of Life</h2>
                    <div>
                        {
                            this.state.activeStep === 0   
                                ?   <>
                                        <h3 id="wol-call-to-action">Choose the top 8 life categories most important to you</h3>
                                        <div id="wol-category-rows-container">
                                            {this.categorySelectionElementRows}
                                        </div>
                                    </>
                                :   this.advancedPage
                        }

                        <div id="wol-button-actions-row">
                            {
                                this.showRatingSelectPage
                                    ?   <>
                                            <Button disabled={this.state.activeStep === 0} onClick={this.handleBack}>
                                                Back
                                            </Button>
                                            <Button disabled={this.nextButtonDisabled} variant="contained" color="primary" onClick={this.handleNext}>
                                                Next
                                            </Button>
                                        </>
                                    :   <>
                                            <Button onClick={this.handleReset}>
                                                Reset
                                            </Button>
                                            <Button variant="contained" color="primary" onClick={this.handlePrint}>
                                                Print
                                            </Button>
                                        </>
                            }
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

        const updatedState: any = {
            activeStep: this.state.activeStep + 1
        };

        if ( !this.state.activeStep && this.state.ratings.length ) {
            updatedState.ratings = [];
        }

        this.setState(updatedState);
    }

    handleCategorySelection(event: any, category: LifeCategory) {
        event.preventDefault();

        let selectedCatgories = this.state.selectedCategories;

        if ( this.categoryIsSelected(category) ) {
            selectedCatgories = selectedCatgories.filter((a: LifeCategory) => a.name !== category.name);
        } else {
            selectedCatgories.push(category);
        }

        this.setState({ selectedCategories: selectedCatgories });
    }

    handleRatingSelection(rating: number) {
        const ratings = this.state.ratings;
        ratings[this.state.activeStep - 1] = rating;
        this.setState({ ratings: ratings });
    }

    handleReset(event: any) {
        event.preventDefault();
        this.setState(
            {
                activeStep: 0,
                selectedCategories: [],
                ratings: []
            }
        );
    }

    handlePrint(event: any) {
        event.preventDefault();
        const mainChartContainerElement = document.getElementById('wol-main-chart-container'); 
        if ( mainChartContainerElement ) {
            html2canvas(mainChartContainerElement).then((canvas) => {
                mainChartContainerElement.innerHTML = '';
                mainChartContainerElement.appendChild(canvas);
                window.print();
            });
        }
    }
}
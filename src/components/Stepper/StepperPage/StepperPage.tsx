import { Button } from '@material-ui/core';
import React from 'react';
import { LifeCategory } from '../../../models/LifeCategory';
import './StepperPage.scss';

interface StepperPageProps {
    lifeCategory: LifeCategory;
    rating: number;
    onRatingSelect: (rating: number) => void
}

interface StepperPageState {
    rating: number;   
}

export class StepperPage extends React.Component<StepperPageProps, StepperPageState> {
    constructor(props: StepperPageProps) {
        super(props);
    }

    render() {
        const buttonsRow1 = [];
        const buttonsRow2 = [];

        for ( let i = 1; i < 6; i++ ) {
            buttonsRow1.push(
                this.getRatingButton(this.props, i)
            );

            buttonsRow2.push(
                this.getRatingButton(this.props, i + 5)
            );
        }

        return (
            <div>
                <h3>How would you rate this category of your life?</h3>
                <div id="wol-rating-button-container">
                    <div className="rating-button-sub-container">
                        <span className="rating-label">Very little satisfaction</span>
                        {buttonsRow1}
                    </div>
                    <div className="rating-button-sub-container">
                        {buttonsRow2}
                        <span className="rating-label">Extremely satisfied</span>
                    </div>
                </div>
                <div id="wol-category-description">
                    {
                        this.props && this.props.lifeCategory
                            ?   <>
                                    <h4>{this.props.lifeCategory.name}</h4>
                                    <p>{this.props.lifeCategory.description}</p>
                                </>
                            :   <></>
                    }
                </div>
            </div>
        );
    }

    getRatingButton(props: StepperPageProps, ratingValue: number) {
        return (
            <Button
                key={'rating' + ratingValue.toString()}
                variant="contained"
                color={props && props.rating === ratingValue ? 'secondary' : 'default'}
                className="rating-button"
                onClick={() => props.onRatingSelect(ratingValue)}
            >
                {ratingValue}
            </Button>
        );
    }
}
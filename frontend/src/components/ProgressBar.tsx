import React from 'react';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
    const progress = (currentStep / totalSteps) * 100;

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
                className="bg-[#59198B] h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ProgressBar;

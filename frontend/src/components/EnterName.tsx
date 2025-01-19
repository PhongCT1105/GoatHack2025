import React from 'react';

interface EnterNameProps {
    onBack: () => void;
    onContinue: () => void;
    firstName: string;
    setFirstName: (value: string) => void;
    lastName: string;
    setLastName: (value: string) => void;
}

const EnterName: React.FC<EnterNameProps> = ({
    onBack,
    onContinue,
    firstName,
    setFirstName,
    lastName,
    setLastName,
}) => {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Enter your first name and last name
            </h1>
            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="First Name"
                    className="border-2 p-4 w-full rounded-lg"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    className="border-2 p-4 w-full rounded-lg"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div className="flex justify-between mt-4">
                <button
                    className="px-6 py-2 border-2 border-black hover:bg-gray-100 text-black font-bold rounded-lg"
                    onClick={onBack}
                >
                    Back
                </button>
                <button
                    className="px-6 py-2 bg-[#59198B] text-white font-bold rounded-lg"
                    onClick={onContinue}
                    disabled={!firstName || !lastName}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default EnterName;

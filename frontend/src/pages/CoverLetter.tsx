import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CreateNewLetter from './CreateNewLetter';
import UploadFromResume from './UploadFromResume';
import { useResumeContext } from '../context/ResumeContext';

interface CoverLetterProps {
    setNavbarVisible: (visible: boolean) => void;
  }
  
  type OptionType = 'new' | 'resume' | null;
  const CoverLetter: React.FC<CoverLetterProps> = ({ setNavbarVisible }) => {
    const { personalDetails, experiences } = useResumeContext();
    const [selectedOption, setSelectedOption] = useState<'new' | 'resume' | null>(null);
  
    useEffect(() => {
      // Update navbar visibility based on selectedOption
      setNavbarVisible(!selectedOption);
  
      // Cleanup - show navbar when component unmounts
      return () => {
        setNavbarVisible(true);
      };
    }, [selectedOption, setNavbarVisible]);
  

    const handleSelect = (option: OptionType) => {
        setSelectedOption(option);
        // Add navigation logic based on the selected option
        if (option === 'new') {
          console.log('Navigating to Create a New Letter');
        } else if (option === 'resume') {
          console.log('Navigating to Use Your Resume');
        }
      };
    
      useEffect(() => {
        setNavbarVisible(!selectedOption);
        return () => {
          setNavbarVisible(true);
        };
      }, [selectedOption, setNavbarVisible]);

    const handleBackToHome = () => {
        setSelectedOption(null);
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeInOut' },
        },
    };

    return (
        <div className="flex flex-col items-center p-8 space-y-8">
            {selectedOption === null ? (
                <>
                    <motion.h1
                        className="text-2xl font-bold text-gray-800"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                    >
                        How do you want to start your cover letter?
                    </motion.h1>
                    <div className="flex space-x-8">
                        <motion.div
                            className="cursor-pointer"
                            onClick={() => handleSelect('new')}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="border-2 rounded-lg p-6 w-64 cursor-pointer hover:border-black transition ease-in-out duration-300">
                                <div className="text-4xl mb-4">+</div>
                                <h2 className="text-xl font-bold mb-2">Create a new letter</h2>
                                <p className="text-gray-500">
                                    We'll start from the beginning.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            className="cursor-pointer"
                            onClick={() => handleSelect('resume')}
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.3 }} // Slight delay for staggered effect
                        >
                            <div className="border-2 rounded-lg p-6 w-64 cursor-pointer hover:border-black transition ease-in-out duration-300">
                                <div className="text-4xl mb-4">↑</div>
                                <h2 className="text-xl font-bold mb-2">Use Your Resume</h2>
                                <p className="text-gray-500">
                                    We'll import the information from your built resume.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </>
            ) : selectedOption === 'new' ? (
                <CreateNewLetter onBackToHome={handleBackToHome} />
            ) : selectedOption === 'resume' ? (
                <UploadFromResume onBackToHome={handleBackToHome} personalDetails={personalDetails} experiences={experiences}/>
            ) : null}
        </div>
    );
}

export default CoverLetter;
import React, { useState, useEffect } from 'react';

const InputWithValidation = ({ label, min, max, onChange, className }) => {
    const [value, setValue] = useState('');
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        switch (label) {
            case "Start year:":
                setValue(min);
                break;
            case "End year:":
                setValue(max);
                break;
            default:
                break;
        }
    }, [min, max]);


    const handleChange = (event) => {
        let newVal = event.target.value;
        setValue(newVal);
        if (newVal >= 1000) {
            setIsValid(event.target.checkValidity());
        }
        onChange(newVal);
    }

    return (
        <div className='p-2 pl-3 '>
            <div className='flex w-[29%]  justify-between'>
                <p> {label} </p>
                <input
                    type="number"
                    value={value}
                    min={min}
                    max={max}
                    onChange={handleChange}
                    required
                    className={className} />
            </div>
            <br />
            {!isValid && (
                <label style={{ color: 'red' }}>Value must be between {min} and {max}.</label>
            )}
        </div>
    );
};

export default InputWithValidation;
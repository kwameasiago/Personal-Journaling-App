import React from "react";
import Input from "./inputs";
import Loader from "./loading";

interface InputProps {
  placeholder: string;
  type: string;
  name: string
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  additionalClass?: string;
  
}

interface ReusableFormProps {
  inputs: InputProps[];
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  width?: number;
  loader: boolean;
  submitText?: string
}

const ReusableForm: React.FC<ReusableFormProps> = ({ inputs, onSubmit, width, loader, submitText }) => {
  return (
    <form onSubmit={onSubmit} action="" className={`flex flex-col  ${width ? `w-[${width}px]` : 'w-[546px]'}`}>
      {inputs.map((inputProps, index) => (
        <Input
          key={index}
          placeholder={inputProps.placeholder}
          type={inputProps.type}
          name={inputProps.name}
          onChange={inputProps.onChange}
          additionalClass={inputProps.additionalClass || ""}
        />
      ))}
     <button 
     className='text-white bg-slate-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'
     disabled={loader}
     type='submit'
     >
      {loader ?
      <Loader width="w-5" height="h-5" />
    : submitText}
     </button>

    </form>
  );
};

export default ReusableForm;

import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessAlertProps {
  message: string;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ message }) => {
  return (
    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
        <span className="text-green-700">{message}</span>
      </div>
    </div>
  );
};

export default SuccessAlert;
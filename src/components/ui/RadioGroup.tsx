import * as React from "react";

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onValueChange,
  className,
  children,
}) => {
  return (
    <div className={className} role="radiogroup">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<RadioGroupItemProps>, { selectedValue: value, onValueChange })
          : child
      )}
    </div>
  );
};

interface RadioGroupItemProps {
  value: string;
  id: string;
  selectedValue?: string;
  onValueChange?: (value: string) => void;
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({
  value,
  id,
  selectedValue,
  onValueChange,
}) => {
  return (
    <input
      type="radio"
      id={id}
      value={value}
      checked={selectedValue === value}
      onChange={() => onValueChange?.(value)}
      className="hidden"
    />
  );
};
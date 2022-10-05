import { Currency, CurrencyAmount } from '@uniswap/sdk-core';
import React, { useCallback } from 'react';
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount';
import { maxAmountSpend } from 'utils/maxAmountSpend';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  currencyBalance?: CurrencyAmount<Currency>;
  onUserInput?: (value: string) => void;
  testid?: string;
  label?: string;
  className?: string;
}

const Input = (props: InputProps) => {
  const { className, currencyBalance, placeholder, label, onUserInput, value } = props;

  const maxAmountInput = maxAmountSpend(currencyBalance);
  const handleMax = useCallback(() => {
    if (onUserInput) {
      maxAmountInput && onUserInput(maxAmountInput.toExact());
    }
  }, [maxAmountInput, onUserInput]);
  return (
    // todo #Beigiz we need to programmaticly bind the input focus to its wrapper for ui changes (border + shadow)
    <div className={`${className ? className : ''} inline-flex flex-col`}>
      {label && <label className={'text-gray mb-0.5 pl-0.5'}>{label}</label>}
      <div
        className={
          'inline-flex bg-white border-soft-sky border-2 focus:border-pink-500 focus:ring-pink-500 rounded-xl px-4 h-14'
        }
      >
        <div className={'input-icon'}></div>
        {/*todo remove focus on input*/}
        <input
          disabled={props.disabled}
          type={props.type}
          value={value}
          placeholder={placeholder}
          className={'focus:outline-0'}
          onChange={(e) => (onUserInput ? onUserInput(e.target.value) : null)}
          data-testid={props.testid && `${props.testid}-input`}
        ></input>
        <div className={'input-token'}></div>
      </div>
      <footer className={'mt-2'}>
        {/* This is for error messages and showing balance */}
        {currencyBalance && (
          <div className={'flex justify-end gap-2 pr-2'}>
            <p className={'text-dark-gray text-sm'}>
              Balance:{' '}
              <span className={'font-semibold'}>
                {currencyBalance
                  ? formatCurrencyAmount(currencyBalance, 4) + ' ' + currencyBalance.currency.symbol
                  : ''}
              </span>
            </p>
            <button
              onClick={handleMax}
              className={'btn-primary-inverted rounded-md px-2 text-xs font-semibold'}
              data-testid={props.testid && `${props.testid}-max`}
            >
              Max
            </button>
          </div>
        )}
      </footer>
    </div>
  );
};

export default Input;

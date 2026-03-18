import { act, create } from 'react-test-renderer';
import { describe, expect, it } from 'vitest';
import { AccountsSelect } from './accounts-select';

const accounts = [
  {
    id: 'account_checking',
    name: 'Checking',
    nickname: 'Mercury Checking',
    numberLast4: '1234',
  },
  {
    id: 'account_savings',
    name: 'Savings',
    nickname: 'Mercury Savings',
    numberLast4: '5678',
  },
];

describe('AccountsSelect', () => {
  it('renders dropdown mode without breaking selected values', () => {
    let rendered!: ReturnType<typeof create>;

    act(() => {
      rendered = create(
        <AccountsSelect
          accounts={accounts}
          selectedAccountId="account_savings"
          onSelect={() => undefined}
          variant="dropdown"
        />,
      );
    });

    const picker = rendered.root.find((node) => node.props?.selectedValue === 'account_savings');
    expect(picker).toBeTruthy();
    expect(rendered.toJSON()).toBeTruthy();
  });
});

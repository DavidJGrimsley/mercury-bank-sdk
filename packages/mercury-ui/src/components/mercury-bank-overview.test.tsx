import { act, create } from 'react-test-renderer';
import { describe, expect, it, vi } from 'vitest';
import { MercuryBankOverview } from './mercury-bank-overview';

vi.mock('../../assets/brand/mercury_logo_horizontal.png', () => ({
  default: 'horizontal-logo.png',
}));

vi.mock('../../assets/brand/mercury_logo_icon.png', () => ({
  default: 'icon-logo.png',
}));

vi.mock('../../assets/brand/mercury_logo_vertical.png', () => ({
  default: 'vertical-logo.png',
}));

async function flush(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
}

function collectText(node: unknown): string {
  if (typeof node === 'string') {
    return node;
  }

  if (!node || typeof node !== 'object') {
    return '';
  }

  const value = node as { children?: unknown[] };
  return (value.children ?? []).map((child) => collectText(child)).join('');
}

describe('MercuryBankOverview', () => {
  it('loads accounts and lets the selected account details change', async () => {
    const adapter = {
      listAccounts: vi.fn(async () => [
        {
          id: 'account_savings',
          name: 'Savings',
          nickname: 'Mercury Savings',
          status: 'active',
          balances: { available: 40, current: 40 },
        },
        {
          id: 'account_checking',
          name: 'Checking',
          nickname: 'Mercury Checking',
          status: 'active',
          kind: 'checking',
          balances: { available: 125, current: 150 },
        },
      ]),
    };

    let rendered!: ReturnType<typeof create>;
    await act(async () => {
      rendered = create(<MercuryBankOverview adapter={adapter} />);
      await flush();
    });

    let text = collectText(rendered.toJSON());
    expect(text).toContain('Mercury Checking');

    const picker = rendered.root.find((node) => node.props?.selectedValue === 'account_checking');
    await act(async () => {
      picker.props.onValueChange('account_savings');
      await flush();
    });

    text = collectText(rendered.toJSON());
    expect(text).toContain('Mercury Savings');
    expect(adapter.listAccounts).toHaveBeenCalledTimes(1);
  });
});

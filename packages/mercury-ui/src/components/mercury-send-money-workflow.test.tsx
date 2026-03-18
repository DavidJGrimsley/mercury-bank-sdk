import { act, create } from 'react-test-renderer';
import { describe, expect, it, vi } from 'vitest';
import { MercurySendMoneyWorkflow } from './mercury-send-money-workflow';

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

describe('MercurySendMoneyWorkflow', () => {
  it('loads accounts and recipients through the provided adapter', async () => {
    const adapter = {
      listAccounts: vi.fn(async () => [
        { id: 'account_checking', name: 'Checking', nickname: 'Mercury Checking', kind: 'checking' },
      ]),
      listRecipients: vi.fn(async () => [
        { id: 'recipient_1', name: 'Primary Recipient', paymentMethod: 'ach' },
      ]),
      sendMoney: vi.fn(async () => ({ id: 'txn_1' })),
      createRecipient: vi.fn(async () => ({ id: 'recipient_2', name: 'Created Recipient' })),
      updateRecipient: vi.fn(async () => ({ id: 'recipient_1', name: 'Updated Recipient' })),
    };

    let rendered!: ReturnType<typeof create>;
    await act(async () => {
      rendered = create(<MercurySendMoneyWorkflow adapter={adapter} />);
      await flush();
    });

    const text = collectText(rendered.toJSON());
    expect(text).toContain('Send Money');
    expect(text).toContain('Recipient Manager');
    expect(adapter.listAccounts).toHaveBeenCalledTimes(1);
    expect(adapter.listRecipients).toHaveBeenCalledTimes(1);
  });
});

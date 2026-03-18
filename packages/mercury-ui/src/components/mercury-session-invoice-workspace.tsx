import { useEffect, useState } from 'react';
import type { MercuryAccount } from '@mr.dj2u/mercury';
import type { MercurySessionInvoiceAdapter, MercuryUiAdapter } from '../adapter';
import { Time2PayMercuryInvoiceBuilder } from './time2pay-mercury-invoice-builder';
import type { InvoiceWizardStatus } from './invoice-wizard';

type MercurySessionInvoiceWorkspaceProps = {
  adapter: Pick<MercuryUiAdapter, 'listAccounts'>;
  sessionAdapter: MercurySessionInvoiceAdapter;
  subtitle?: string;
  onError?: (message: string) => void;
};

export function MercurySessionInvoiceWorkspace({
  adapter,
  sessionAdapter,
  subtitle = 'Time2Pay session-based invoice drafting with Mercury invoice settings layered on top.',
  onError,
}: MercurySessionInvoiceWorkspaceProps) {
  const [accounts, setAccounts] = useState<MercuryAccount[]>([]);
  const [accountsStatus, setAccountsStatus] = useState<InvoiceWizardStatus>({
    message: 'Loading Mercury accounts...',
    tone: 'neutral',
  });

  useEffect(() => {
    let active = true;

    async function loadAccounts(): Promise<void> {
      if (!adapter.listAccounts) {
        const message = 'Mercury session invoice workspace requires a listAccounts adapter.';
        onError?.(message);
        setAccountsStatus({ message, tone: 'error' });
        return;
      }

      setAccountsStatus({ message: 'Loading Mercury accounts...', tone: 'neutral' });
      try {
        const rows = await adapter.listAccounts();
        if (!active) {
          return;
        }

        setAccounts(rows);
        setAccountsStatus({
          message:
            rows.length > 0
              ? `Mercury connected. Loaded ${rows.length} account(s) for invoice routing.`
              : 'Mercury connected, but no destination accounts were returned.',
          tone: rows.length > 0 ? 'success' : 'error',
        });
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : 'Failed to load Mercury accounts.';
        onError?.(message);
        setAccountsStatus({ message, tone: 'error' });
      }
    }

    loadAccounts().catch(() => undefined);

    return () => {
      active = false;
    };
  }, [adapter, onError]);

  const resolvedStatus =
    accountsStatus.tone === 'error' || accounts.length === 0 ? accountsStatus : sessionAdapter.status;

  return (
    <Time2PayMercuryInvoiceBuilder
      accounts={accounts}
      defaults={sessionAdapter.defaults}
      resetKey={sessionAdapter.resetKey}
      onSubmit={sessionAdapter.submitInvoice}
      busy={sessionAdapter.busy}
      status={resolvedStatus}
      footer={sessionAdapter.footer}
      sourceChildren={sessionAdapter.renderSourcePanel?.()}
      subtitle={subtitle}
    />
  );
}
